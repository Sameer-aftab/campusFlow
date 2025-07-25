import { StudentForm } from '@/components/dashboard/StudentForm';

export default function AddStudentPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-6">
        <h1 className="text-xl font-semibold">Add New Student</h1>
      </header>
      <div className="p-6">
        <StudentForm />
      </div>
    </>
  );
}
