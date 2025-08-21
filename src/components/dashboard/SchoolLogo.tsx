import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function SchoolLogo({ className, ...props }: React.ComponentProps<"img">) {
  return (
   <Image src="/Logo.png" alt="School Logo" width={100} height={100} className={cn(className)} {...props} />
  );
}
