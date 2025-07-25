import { BulkCertificateGenerator } from '@/components/dashboard/BulkCertificateGenerator';
import { getStudents } from '@/lib/actions';

export default async function GenerateCertificatesPage() {
  const students = await getStudents();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-6 no-print">
        <h1 className="text-xl font-semibold">Bulk Generate Certificates</h1>
      </header>
       <div className="p-6">
        <BulkCertificateGenerator students={students} />
      </div>
    </>
  );
}
