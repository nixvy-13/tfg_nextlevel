// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" redirectUrl="/missions" />
    </div>
  );
}
