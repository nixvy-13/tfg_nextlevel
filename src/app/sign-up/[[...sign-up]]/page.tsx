// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" redirectUrl="/missions" />
    </div>
  );
}
