import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, ExternalLink, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { NutriScoreBadge } from '@/components/NutriScoreBadge';
import { NutritionGrid } from '@/components/NutritionGrid';
import { LabelBadge } from '@/components/LabelBadge';
import { useProductByBarcode } from '@/hooks/useProducts';

const placeholderImage = '/placeholder.svg';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProductByBarcode(id || '');

  const product = data?.product;
  const nutriScore = product?.nutriscore_grade || product?.nutrition_grades;
  const imageUrl = product?.image_front_url || product?.image_url;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded-lg" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-2xl" />
              <div className="space-y-6">
                <div className="h-10 bg-muted rounded-lg w-3/4" />
                <div className="h-6 bg-muted rounded-lg w-1/2" />
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Product Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find a product with barcode: {id}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to products
          </Link>
        </motion.div>

        {/* Product Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-square bg-card rounded-3xl overflow-hidden border border-border/50 p-8 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.product_name || 'Product image'}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholderImage;
                  }}
                />
              ) : (
                <Package className="w-32 h-32 text-muted-foreground/30" />
              )}
            </div>

            {/* Nutri-Score Badge */}
            {nutriScore && (
              <div className="absolute top-6 right-6">
                <NutriScoreBadge grade={nutriScore} size="lg" />
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title & Brand */}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {product.product_name || 'Unknown Product'}
              </h1>
              {product.brands && (
                <p className="text-lg text-muted-foreground">
                  by {product.brands}
                </p>
              )}
              {product.quantity && (
                <p className="text-sm text-muted-foreground mt-1">
                  {product.quantity}
                </p>
              )}
            </div>

            {/* Barcode */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm text-muted-foreground">
              <span className="font-mono">{product.code}</span>
            </div>

            {/* Labels */}
            {product.labels_tags && product.labels_tags.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                  Labels & Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.labels_tags.slice(0, 10).map((label) => (
                    <LabelBadge key={label} label={label} />
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {product.allergens_tags && product.allergens_tags.length > 0 && (
              <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                <h3 className="font-display font-semibold text-lg text-destructive mb-2">
                  ⚠️ Allergens
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.allergens_tags.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-3 py-1 bg-destructive/20 text-destructive rounded-full text-sm font-medium"
                    >
                      {allergen.replace(/^en:/, '').replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Link */}
            <a
              href={`https://world.openfoodfacts.org/product/${product.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              View on OpenFoodFacts
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Ingredients Section */}
        {product.ingredients_text && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Ingredients
            </h2>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <p className="text-foreground leading-relaxed">
                {product.ingredients_text}
              </p>
            </div>
          </motion.section>
        )}

        {/* Nutrition Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Nutritional Values
          </h2>
          <NutritionGrid nutriments={product.nutriments} />
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Data provided by{' '}
            <a 
              href="https://world.openfoodfacts.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open Food Facts
            </a>
            . Open Database License.
          </p>
        </div>
      </footer>
    </div>
  );
}
