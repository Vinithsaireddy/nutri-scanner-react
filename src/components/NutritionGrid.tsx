import { motion } from 'framer-motion';
import { Flame, Droplets, Wheat, Beef, Cookie, Mountain, Leaf } from 'lucide-react';
import { type Product } from '@/services/api';

interface NutritionGridProps {
  nutriments: Product['nutriments'];
}

interface NutrientItem {
  key: string;
  label: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

const nutrients: NutrientItem[] = [
  { key: 'energy', label: 'Energy', unit: 'kcal', icon: <Flame className="w-5 h-5" />, color: 'text-orange-500' },
  { key: 'fat', label: 'Fat', unit: 'g', icon: <Droplets className="w-5 h-5" />, color: 'text-yellow-500' },
  { key: 'carbohydrates', label: 'Carbs', unit: 'g', icon: <Wheat className="w-5 h-5" />, color: 'text-amber-500' },
  { key: 'proteins', label: 'Proteins', unit: 'g', icon: <Beef className="w-5 h-5" />, color: 'text-red-500' },
  { key: 'sugars', label: 'Sugars', unit: 'g', icon: <Cookie className="w-5 h-5" />, color: 'text-pink-500' },
  { key: 'salt', label: 'Salt', unit: 'g', icon: <Mountain className="w-5 h-5" />, color: 'text-blue-500' },
  { key: 'fiber', label: 'Fiber', unit: 'g', icon: <Leaf className="w-5 h-5" />, color: 'text-green-500' },
];

function getValue(nutriments: Product['nutriments'], key: string): number | null {
  if (!nutriments) return null;
  
  if (key === 'energy') {
    return nutriments['energy-kcal_100g'] ?? nutriments.energy_kcal_100g ?? null;
  }
  
  const value = nutriments[`${key}_100g` as keyof typeof nutriments];
  return typeof value === 'number' ? value : null;
}

export function NutritionGrid({ nutriments }: NutritionGridProps) {
  if (!nutriments) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nutritional information not available
      </div>
    );
  }

  const availableNutrients = nutrients.filter((n) => getValue(nutriments, n.key) !== null);

  if (availableNutrients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nutritional information not available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {availableNutrients.map((nutrient, index) => {
        const value = getValue(nutriments, nutrient.key);
        
        return (
          <motion.div
            key={nutrient.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/20 transition-colors"
          >
            <div className={`mb-2 ${nutrient.color}`}>
              {nutrient.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">
              {value?.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {nutrient.unit}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {nutrient.label}
            </p>
            <p className="text-xs text-muted-foreground/70">
              per 100g
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
