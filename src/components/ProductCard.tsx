import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { NutriScoreBadge } from './NutriScoreBadge';
import { type Product } from '@/services/api';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const placeholderImage = '/placeholder.svg';

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imageUrl = product.image_front_small_url || product.image_front_url || product.image_url;
  const nutriScore = product.nutriscore_grade || product.nutrition_grades;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', stiffness: 100 }}
    >
      <Link to={`/product/${product.code}`}>
        <motion.div
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn(
            'group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300',
            'card-shine border border-border/50'
          )}
        >
          {/* Nutri-Score Badge */}
          {nutriScore && (
            <div className="absolute top-3 right-3 z-10">
              <NutriScoreBadge grade={nutriScore} size="md" />
            </div>
          )}

          {/* Image */}
          <div className="aspect-square p-4 bg-gradient-to-b from-muted/30 to-transparent flex items-center justify-center">
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={product.product_name || 'Product image'}
                className="w-full h-full object-contain mix-blend-multiply"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                <Package className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 pt-2">
            <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {product.product_name || 'Unknown Product'}
            </h3>
            {product.brands && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {product.brands}
              </p>
            )}
            {product.quantity && (
              <p className="text-xs text-muted-foreground/70 mt-1">
                {product.quantity}
              </p>
            )}
          </div>

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
