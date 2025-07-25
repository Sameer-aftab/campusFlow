import { StudentForm } from '@/components/dashboard/StudentForm';

export default function AddStudentPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-6">
        <h1 className="text-xl font-semibold">Add New Student</h1>
      </header>
      <div className="flex-1 p-6 overflow-auto">
        <StudentForm />
      </div>
    </div>
  );
}
