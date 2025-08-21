import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Logo from "../../app/assets/Logo.png"

export function SchoolLogo({ className, ...props }: React.ComponentProps<"img">) {
  return (
   <Image src={Logo} alt="School Logo" width={50} height={50} className={cn(className)} {...props} />
  );
}
