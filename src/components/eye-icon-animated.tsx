export default function EyeIconAnimated(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g className="animate-eye-blink">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <g className="animate-eye-look">
          <circle
            cx="12"
            cy="12"
            r="3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}
