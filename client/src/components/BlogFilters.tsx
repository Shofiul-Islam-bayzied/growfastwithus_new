import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { WordPressCategory, WordPressTag } from "@/lib/wordpress-types";

interface BlogFiltersProps {
  categories: WordPressCategory[];
  tags: WordPressTag[];
  selectedCategoryId?: number;
  selectedTagId?: number;
  onCategorySelect: (categoryId: number | undefined) => void;
  onTagSelect: (tagId: number | undefined) => void;
  showTags?: boolean;
}

export function BlogFilters({
  categories,
  tags,
  selectedCategoryId,
  selectedTagId,
  onCategorySelect,
  onTagSelect,
  showTags = true,
}: BlogFiltersProps) {
  const hasActiveFilters = selectedCategoryId !== undefined || selectedTagId !== undefined;

  const handleClearFilters = () => {
    onCategorySelect(undefined);
    onTagSelect(undefined);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-white">Categories</h3>
            {selectedCategoryId !== undefined && (
              <button
                onClick={() => onCategorySelect(undefined)}
                className="text-sm text-gray-400 hover:text-primary transition-colors min-h-[44px] px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2">
            <Button
              variant={selectedCategoryId === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect(undefined)}
              className={
                selectedCategoryId === undefined
                  ? "bg-primary text-white min-h-[44px] text-sm sm:text-base px-3 sm:px-4"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] text-sm sm:text-base px-3 sm:px-4"
              }
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategorySelect(category.id)}
                className={
                  selectedCategoryId === category.id
                    ? "bg-primary text-white min-h-[44px] text-sm sm:text-base px-3 sm:px-4"
                    : "border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] text-sm sm:text-base px-3 sm:px-4"
                }
              >
                {category.name}
                <Badge
                  variant="secondary"
                  className="ml-2 bg-gray-700 text-gray-300 text-xs"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {showTags && tags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-white">Tags</h3>
            {selectedTagId !== undefined && (
              <button
                onClick={() => onTagSelect(undefined)}
                className="text-sm text-gray-400 hover:text-primary transition-colors min-h-[44px] px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2">
            {tags.slice(0, 10).map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTagId === tag.id ? "default" : "outline"}
                size="sm"
                onClick={() => onTagSelect(tag.id)}
                className={
                  selectedTagId === tag.id
                    ? "bg-primary text-white min-h-[44px] text-sm sm:text-base px-3 sm:px-4"
                    : "border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] text-sm sm:text-base px-3 sm:px-4"
                }
              >
                #{tag.name}
                <Badge
                  variant="secondary"
                  className="ml-2 bg-gray-700 text-gray-300 text-xs"
                >
                  {tag.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] text-sm sm:text-base"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

