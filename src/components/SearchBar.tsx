import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ScanBarcode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onBarcodeSearch: (barcode: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, onBarcodeSearch, className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'name' | 'barcode'>('name');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeQuery.trim()) {
      onBarcodeSearch(barcodeQuery.trim());
    }
  };

  const clearSearch = () => {
    if (activeTab === 'name') {
      setSearchQuery('');
      onSearch('');
    } else {
      setBarcodeQuery('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className={cn(
        'glass rounded-2xl p-2 shadow-lg transition-shadow duration-300',
        isFocused && 'shadow-glow ring-2 ring-primary/20',
        className
      )}
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-3 px-2">
        <button
          onClick={() => setActiveTab('name')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            activeTab === 'name'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Search className="w-4 h-4" />
          Search by Name
        </button>
        <button
          onClick={() => setActiveTab('barcode')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            activeTab === 'barcode'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <ScanBarcode className="w-4 h-4" />
          Barcode
        </button>
      </div>

      {/* Search Input */}
      {activeTab === 'name' ? (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for products, brands..."
            className="w-full pl-12 pr-12 py-4 bg-background/50 rounded-xl border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-base"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleBarcodeSubmit} className="relative">
          <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={barcodeQuery}
            onChange={(e) => setBarcodeQuery(e.target.value.replace(/\D/g, ''))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter barcode number..."
            className="w-full pl-12 pr-24 py-4 bg-background/50 rounded-xl border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-base"
          />
          <button
            type="submit"
            disabled={!barcodeQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </form>
      )}
    </motion.div>
  );
}
