import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolLogo } from '@/components/dashboard/SchoolLogo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
             <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
               <SchoolLogo className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">CampusFlow</CardTitle>
            <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
