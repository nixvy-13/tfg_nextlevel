-- Migration number: 0002 	 2025-10-21T20:22:20.542Z
-- migrations/0001_initial_schema.sql

-- Tabla de Usuarios
CREATE TABLE Users (
    clerkId TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    experience INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías
CREATE TABLE Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Tabla de Proyectos
CREATE TABLE Projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    isPublic BOOLEAN NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(clerkId)
);

-- Tabla de Tareas (Misiones)
CREATE TABLE Tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    projectId INTEGER,
    categoryId INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK(type IN ('ONCE', 'RECURRENT')),
    difficulty INTEGER NOT NULL DEFAULT 1,
    experienceReward INTEGER NOT NULL DEFAULT 10,
    recurrencePattern TEXT,
    recurrenceInterval INTEGER,
    isDefault BOOLEAN NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(clerkId),
    FOREIGN KEY (projectId) REFERENCES Projects(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Categories(id)
);

-- Tabla para registrar cada vez que se completa una tarea
CREATE TABLE TaskCompletions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskId INTEGER NOT NULL,
    userId TEXT NOT NULL,
    completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (taskId) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(clerkId)
);

-- Tabla de Logros
CREATE TABLE Achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    iconUrl TEXT
);

-- Tabla que une Usuarios y Logros
CREATE TABLE UserAchievements (
    userId TEXT NOT NULL,
    achievementId INTEGER NOT NULL,
    achievedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDisplayed BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (userId, achievementId),
    FOREIGN KEY (userId) REFERENCES Users(clerkId),
    FOREIGN KEY (achievementId) REFERENCES Achievements(id)
);