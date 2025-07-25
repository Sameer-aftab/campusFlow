import { BulkCertificateGenerator } from '@/components/dashboard/BulkCertificateGenerator';
import { getStudents } from '@/lib/actions';

export default async function GenerateCertificatesPage() {
  const students = await getStudents();

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-6 no-print">
        <h1 className="text-xl font-semibold">Bulk Generate Certificates</h1>
      </header>
       <div className="flex-1 p-6 overflow-auto">
        <BulkCertificateGenerator students={students} />
      </div>
    </div>
  );
}
