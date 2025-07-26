import * as React from 'react';

export function AjrakBorder() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Ethnic-style triangle pattern */}
        <pattern id="border-pattern" patternUnits="userSpaceOnUse" width="5" height="5">
          <rect width="5" height="5" fill="white" />
          <path d="M0,0 L2.5,2.5 L0,5 Z" fill="black" />
          <path d="M5,0 L2.5,2.5 L5,5 Z" fill="black" />
        </pattern>
      </defs>

      {/* Red background */}
      <rect width="100" height="100" fill="red" />

      {/* Top border */}
      <rect x="0" y="0" width="100" height="5" fill="url(#border-pattern)" />

      {/* Bottom border */}
      <rect x="0" y="95" width="100" height="5" fill="url(#border-pattern)" />

      {/* Left border */}
      <rect x="0" y="5" width="5" height="90" fill="url(#border-pattern)" />

      {/* Right border */}
      <rect x="95" y="5" width="5" height="90" fill="url(#border-pattern)" />
    </svg>
  );
}
