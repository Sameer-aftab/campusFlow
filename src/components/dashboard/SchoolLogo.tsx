import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Logo from '../../app/Logo.png'

export function SchoolLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
   <Image src={Logo} alt="School Logo" className={cn(className)} {...props} />
  );
}
