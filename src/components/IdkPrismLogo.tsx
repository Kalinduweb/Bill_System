import React from 'react';

interface IdkPrismLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const IdkPrismLogo: React.FC<IdkPrismLogoProps> = ({
  className = '',
  size = 64,
  color = '#111827',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="IDK Geometric Logo"
    >
      {/* Faceted optical illusion geometric prism matching IDK Design & Printers logo */}
      {/* Top Half */}
      {/* Top Left Facet - Black stripes / geometric pattern */}
      <path
        d="M 50 10 L 22 42 L 50 42 Z"
        fill={color}
      />
      <path
        d="M 27 34 L 50 20 L 50 24 L 32 38 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M 36 42 L 50 29 L 50 33 L 42 42 Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Top Right Facet - Mirrored prism rays */}
      <path
        d="M 50 10 L 78 42 L 50 42 Z"
        fill={color}
      />
      <path
        d="M 73 34 L 50 20 L 50 24 L 68 38 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M 64 42 L 50 29 L 50 33 L 58 42 Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Center divider subtle gap */}
      <rect x="49" y="8" width="2" height="84" fill="#ffffff" />
      <rect x="18" y="47" width="64" height="6" fill="#ffffff" />

      {/* Bottom Half */}
      {/* Bottom Left Facet */}
      <path
        d="M 50 90 L 22 58 L 50 58 Z"
        fill={color}
      />
      <path
        d="M 27 66 L 50 80 L 50 76 L 32 62 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M 36 58 L 50 71 L 50 67 L 42 58 Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Bottom Right Facet */}
      <path
        d="M 50 90 L 78 58 L 50 58 Z"
        fill={color}
      />
      <path
        d="M 73 66 L 50 80 L 50 76 L 68 62 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M 64 58 L 50 71 L 50 67 L 58 58 Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Center diamond highlight */}
      <polygon
        points="50,44 54,50 50,56 46,50"
        fill="#ffffff"
      />
    </svg>
  );
};
