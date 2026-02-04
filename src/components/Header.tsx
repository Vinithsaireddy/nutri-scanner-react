import { motion } from 'framer-motion';
import { Leaf, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="p-2 rounded-xl bg-primary/10"
          >
            <Leaf className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              NutriScan
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
              Food Product Explorer
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <a
            href="https://world.openfoodfacts.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Powered by OpenFoodFacts
          </a>
          <a
            href="https://github.com/openfoodfacts"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Github className="w-5 h-5 text-muted-foreground" />
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
