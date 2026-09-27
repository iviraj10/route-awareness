export function RoadSenseLogo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="RoadSense"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="38" height="38" rx="9" fill="currentColor" />
      <path
        d="M15.2 31.5c.7-4.3 2.1-7.5 4.2-9.7M24.8 31.5c-.5-3.4-1.5-6.1-3-8.2"
        stroke="var(--color-primary-foreground)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M20 24.2s6-5.7 6-10.4a6 6 0 1 0-12 0c0 4.7 6 10.4 6 10.4Z"
        fill="var(--color-primary-foreground)"
      />
      <circle cx="20" cy="13.8" r="2.2" fill="currentColor" />
      <path
        d="M19.7 27.3v1.8M18.9 32.1l-.3 1.2"
        stroke="var(--color-primary-foreground)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}