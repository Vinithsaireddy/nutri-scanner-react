import { cn } from '@/lib/utils';

interface NutriScoreBadgeProps {
  grade?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gradeStyles: Record<string, string> = {
  a: 'nutri-badge-a',
  b: 'nutri-badge-b',
  c: 'nutri-badge-c',
  d: 'nutri-badge-d',
  e: 'nutri-badge-e',
};

const sizeStyles = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-lg',
};

export function NutriScoreBadge({ grade, size = 'md', className }: NutriScoreBadgeProps) {
  const normalizedGrade = grade?.toLowerCase();
  
  if (!normalizedGrade || !gradeStyles[normalizedGrade]) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold uppercase shadow-sm',
        sizeStyles[size],
        gradeStyles[normalizedGrade],
        className
      )}
    >
      {normalizedGrade.toUpperCase()}
    </div>
  );
}
