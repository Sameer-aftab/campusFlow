import * as React from 'react';
import { cn } from '@/lib/utils';

export function SchoolLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={cn(className)}
      {...props}
    >
      <defs>
        <path
          id="circlePath"
          d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
        ></path>
      </defs>
      <g fill="currentColor" stroke="currentColor">
        <text style={{ fontSize: '24px', letterSpacing: '2px' }} fill="currentColor">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            GOVT.(N) NOOR MUHAMMAD HIGH SCHOOL*HYD*
          </textPath>
        </text>
        <path
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          d="M 60 55 L 60 145 C 60 155, 140 155, 140 145 L 140 55 C 120 40, 80 40, 60 55 Z"
        />
        <line x1="60" y1="100" x2="140" y2="100" stroke="currentColor" strokeWidth="2" />
        <line x1="100" y1="55" x2="100" y2="145" stroke="currentColor" strokeWidth="2" />

        {/* Top-left quadrant: Candle */}
        <path d="M75 90 C 75 80, 85 80, 85 90" fill="none" strokeWidth="1.5" />
        <path d="M80 82 Q 78 80, 76 82" fill="none" strokeWidth="1.5" />
        <path d="M80 75 L 80 80" strokeWidth="1.5" />
        <path d="M79 74 A 1 1 0 0 1 81 74 Z" fill="currentColor"/>

        {/* Top-right quadrant: Crescent and stars */}
        <path d="M115 80 A 10 10 0 1 1 115 79 Z" fill="none" strokeWidth="1.5" />
        <path d="M117 80 A 8 8 0 1 0 117 79 Z" fill="var(--background, white)" stroke="none" />
        <path d="M 120 85 l 2 2 l -2 2 l -2 -2 Z" fill="currentColor" />
        <path d="M 125 82 l 2 2 l -2 2 l -2 -2 Z" fill="currentColor" />

         {/* Bottom quadrant: Book */}
        <path d="M 70 135 C 80 125, 120 125, 130 135" fill="none" strokeWidth="2" />
        <path d="M 70 135 L 70 110 L 100 115 L 130 110 L 130 135" fill="none" strokeWidth="2" />
        <line x1="100" y1="115" x2="100" y2="137" strokeWidth="2"/>

      </g>
    </svg>
  );
}
