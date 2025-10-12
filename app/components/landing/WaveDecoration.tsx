/**
 * Wave decoration component inspired by Kesennuma's ocean
 * Adds visual maritime elements between sections
 */

interface WaveDecorationProps {
  variant?: 'top' | 'bottom' | 'both';
  color?: 'blue' | 'green' | 'light';
  className?: string;
}

export default function WaveDecoration({
  variant = 'bottom',
  color = 'blue',
  className = ''
}: WaveDecorationProps) {
  const colors = {
    blue: 'text-brand-600',
    green: 'text-kesennuma-green-500',
    light: 'text-brand-100',
  };

  const Wave = ({ flip = false }: { flip?: boolean }) => (
    <svg
      className={`w-full h-12 md:h-16 ${flip ? 'rotate-180' : ''} ${colors[color]}`}
      preserveAspectRatio="none"
      viewBox="0 0 1200 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,0 C300,80 600,80 900,40 C1050,20 1150,10 1200,20 L1200,120 L0,120 Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M0,20 C300,100 600,100 900,60 C1050,40 1150,30 1200,40 L1200,120 L0,120 Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M0,40 C300,120 600,120 900,80 C1050,60 1150,50 1200,60 L1200,120 L0,120 Z"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );

  return (
    <div className={`relative w-full ${className}`}>
      {(variant === 'top' || variant === 'both') && <Wave flip={true} />}
      {(variant === 'bottom' || variant === 'both') && <Wave />}
    </div>
  );
}
