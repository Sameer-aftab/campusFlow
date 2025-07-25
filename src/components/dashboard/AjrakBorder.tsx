import * as React from 'react';

export function AjrakBorder() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="ajrak" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="scale(0.8)">
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M0 10h10V0h10v10h10V0h10v10h10V0h10v10h10V0h10v10" />
                    <path d="M10 80v-10h10v-10h10v-10h10v-10h10v-10h10v-10h10v-10h10" />
                    <path d="M20 20v10h10V20zm30 0v10h10V20zM0 40h10v10H0zm20 0h10v10H20zm20 0h10v10H40zm20 0h10v10H60z" />
                    <path d="M30 50h10v10H30zM10 60v10h10V60zm50 0v10h10V60z" />
                    <circle cx="25" cy="25" r="3" fill="currentColor" />
                    <circle cx="55" cy="25" r="3" fill="currentColor" />
                    <circle cx="5" cy="45" r="3" fill="currentColor" />
                    <circle cx="25" cy="45" r="3" fill="currentColor" />
                    <circle cx="45" cy="45" r="3" fill="currentColor" />
                    <circle cx="65" cy="45" r="3" fill="currentColor" />
                    <circle cx="35" cy="55" r="3" fill="currentColor" />
                    <circle cx="15" cy="65" r="3" fill="currentColor" />
                    <circle cx="55" cy="65" r="3" fill="currentColor" />
                </g>
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="url(#ajrak)" strokeWidth="40" />
    </svg>
  );
}
