import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LabelBadgeProps {
  label: string;
  variant?: 'default' | 'vegan' | 'organic' | 'glutenfree' | 'vegetarian';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-secondary text-secondary-foreground',
  vegan: 'bg-green-100 text-green-800',
  organic: 'bg-emerald-100 text-emerald-800',
  glutenfree: 'bg-amber-100 text-amber-800',
  vegetarian: 'bg-lime-100 text-lime-800',
};

function getVariant(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('vegan')) return 'vegan';
  if (lowerLabel.includes('organic') || lowerLabel.includes('bio')) return 'organic';
  if (lowerLabel.includes('gluten-free') || lowerLabel.includes('sans gluten')) return 'glutenfree';
  if (lowerLabel.includes('vegetarian')) return 'vegetarian';
  return 'default';
}

function formatLabel(label: string): string {
  return label
    .replace(/^en:/, '')
    .replace(/^fr:/, '')
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function LabelBadge({ label, variant, className }: LabelBadgeProps) {
  const resolvedVariant = variant || getVariant(label);
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        variantStyles[resolvedVariant],
        className
      )}
    >
      {formatLabel(label)}
    </motion.span>
  );
}
