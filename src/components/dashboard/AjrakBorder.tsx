import * as React from 'react';

export function AjrakBorder() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
            <pattern id="ajrak-top" patternUnits="userSpaceOnUse" width="100" height="30" patternTransform="scale(1)">
                <rect width="100" height="30" fill="hsl(var(--primary))" />
                <rect y="12" width="100" height="6" fill="hsl(var(--foreground))" />
                {/* Simple representation of the top pattern */}
                <g fill="hsl(var(--primary-foreground))">
                    <circle cx="10" cy="15" r="2" />
                    <rect x="20" y="13" width="10" height="4" />
                    <circle cx="40" cy="15" r="2" />
                    <rect x="50" y="13" width="10" height="4" />
                    <circle cx="70" cy="15" r="2" />
                    <rect x="80" y="13" width="10" height="4" />
                    <circle cx="100" cy="15" r="2" />
                </g>
                 <g fill="hsl(var(--primary-foreground))">
                    <circle cx="5" cy="5" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="25" cy="5" r="1" />
                    <circle cx="35" cy="5" r="1" />
                    <circle cx="45" cy="5" r="1" />
                    <circle cx="55" cy="5" r="1" />
                    <circle cx="65" cy="5" r="1" />
                    <circle cx="75" cy="5" r="1" />
                    <circle cx="85" cy="5" r="1" />
                    <circle cx="95" cy="5" r="1" />
                    <circle cx="5" cy="25" r="1" />
                    <circle cx="15" cy="25" r="1" />
                    <circle cx="25" cy="25" r="1" />
                    <circle cx="35" cy="25" r="1" />
                    <circle cx="45" cy="25" r="1" />
                    <circle cx="55" cy="25" r="1" />
                    <circle cx="65" cy="25" r="1" />
                    <circle cx="75" cy="25" r="1" />
                    <circle cx="85" cy="25" r="1" />
                    <circle cx="95" cy="25" r="1" />
                </g>
            </pattern>
            <pattern id="ajrak-main" patternUnits="userSpaceOnUse" width="120" height="120" patternTransform="scale(1)">
                <rect width="120" height="120" fill="hsl(var(--foreground))" />
                {/* Central Medallion */}
                <path d="M60 10 C 30 10, 10 30, 10 60 C 10 90, 30 110, 60 110 C 90 110, 110 90, 110 60 C 110 30, 90 10, 60 10 Z" fill="hsl(var(--primary))"/>
                <circle cx="60" cy="60" r="15" fill="hsl(var(--foreground))"/>
                <circle cx="60" cy="60" r="8" fill="hsl(var(--primary))"/>
                <g fill="hsl(var(--primary-foreground))" transform="translate(60,60)">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(r => (
                         <path key={r} transform={`rotate(${r})`} d="M 0 -18 C 5 -18, 5 -28, 0 -28 C -5 -28, -5 -18, 0 -18 Z" />
                    ))}
                </g>
                 {/* Leafy elements */}
                <g fill="hsl(var(--primary-foreground))">
                    <path d="M10 60 C 20 40, 20 20, 40 10 L 30 30 C 30 30, 40 50, 10 60 Z"/>
                    <path d="M110 60 C 100 40, 100 20, 80 10 L 90 30 C 90 30, 80 50, 110 60 Z"/>
                    <path d="M10 60 C 20 80, 20 100, 40 110 L 30 90 C 30 90, 40 70, 10 60 Z"/>
                    <path d="M110 60 C 100 80, 100 100, 80 110 L 90 90 C 90 90, 80 70, 110 60 Z"/>

                    <path d="M60 10 C 40 20, 20 20, 10 40 L 30 30 C 30 30, 50 40, 60 10 Z" transform="rotate(90, 60, 60)"/>
                    <path d="M60 110 C 40 100, 20 100, 10 80 L 30 90 C 30 90, 50 80, 60 110 Z" transform="rotate(90, 60, 60)"/>
                    <path d="M60 10 C 80 20, 100 20, 110 40 L 90 30 C 90 30, 70 40, 60 10 Z" transform="rotate(-90, 60, 60)"/>
                    <path d="M60 110 C 80 100, 100 100, 110 80 L 90 90 C 90 90, 70 80, 60 110 Z" transform="rotate(-90, 60, 60)"/>
                </g>
            </pattern>
        </defs>
        
        {/* Top Border */}
        <rect x="0" y="0" width="100%" height="30" fill="url(#ajrak-top)" />

        {/* Main Content Area Border */}
        <rect x="0" y="30" width="30" height="calc(100% - 60px)" fill="url(#ajrak-main)" />
        <rect x="calc(100% - 30px)" y="30" width="30" height="calc(100% - 60px)" fill="url(#ajrak-main)" />

        {/* Bottom Border */}
        <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#ajrak-top)" />
    </svg>
  );
}