import { CertificateGenerator } from '@/components/dashboard/CertificateGenerator';
import { getStudentById } from '@/lib/actions';
import { notFound } from 'next/navigation';

export default async function GenerateCertificatePage({ params }: { params: { id: string } }) {
  const student = await getStudentById(params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-6 no-print">
        <h1 className="text-xl font-semibold">Generate Certificate for {student.studentName}</h1>
      </header>
       <div className="flex-1 p-6 overflow-auto">
        <CertificateGenerator student={student} />
      </div>
    </div>
  );
}
