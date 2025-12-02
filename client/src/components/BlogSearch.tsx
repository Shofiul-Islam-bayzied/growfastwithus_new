import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export function BlogSearch({
  onSearch,
  initialValue = "",
  placeholder = "Search articles...",
}: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  // Debounced search for instant search (optional - triggers after 500ms of no typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== initialValue) {
        // Only trigger auto-search if query is empty (to clear results) or has 3+ chars
        if (searchQuery.trim().length === 0 || searchQuery.trim().length >= 3) {
          onSearch(searchQuery.trim());
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, initialValue, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 sm:pl-12 pr-20 sm:pr-24 py-4 sm:py-6 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-primary rounded-xl text-sm sm:text-base min-h-[44px]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 sm:right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-white min-h-[44px] px-3 sm:px-4"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="w-4 h-4 sm:hidden" />
        </Button>
      </div>
    </form>
  );
}

