import type { SVGProps } from 'react';

export function IntomassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="M12 22V12" />
      <path d="M17.5 14.5c0 1.9-2.5 3.5-5.5 3.5s-5.5-1.6-5.5-3.5 2.5-3.5 5.5-3.5 5.5 1.6 5.5 3.5z" />
    </svg>
  );
}
