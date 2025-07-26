import * as React from 'react';

export function AjrakBorder() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
            <pattern id="border-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <g fill="hsl(var(--primary-foreground))">
                    <rect width="10" height="10" fill="hsl(var(--primary))"/>
                    <path d="M0 0 L5 5 L0 10 Z" />
                    <path d="M10 0 L5 5 L10 10 Z" />
                </g>
            </pattern>
            <pattern id="frame-pattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
              <rect width="100%" height="100%" fill="hsl(var(--foreground))"/>
              <rect width="100%" height="30" y="35" fill="url(#border-pattern)"/>
              <rect width="100%" height="30" y="75" fill="url(#border-pattern)"/>
            </pattern>
        </defs>
        
        {/* Top Border */}
        <rect x="0" y="0" width="100%" height="30" fill="url(#frame-pattern)" />

        {/* Main Content Area Border */}
        <rect x="0" y="30" width="30" height="calc(100% - 60px)" fill="url(#frame-pattern)" />
        <rect x="calc(100% - 30px)" y="30" width="30" height="calc(100% - 60px)" fill="url(#frame-pattern)" />

        {/* Bottom Border */}
        <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#frame-pattern)" />
    </svg>
  );
}
