import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { WordPressPost } from "@/lib/wordpress-types";
import {
  getFeaturedImageUrl,
  getAuthorName,
  getExcerpt,
  formatPostDate,
  getPostCategories,
} from "@/lib/wordpress-api";

interface BlogFeaturedPostProps {
  post: WordPressPost;
}

export function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  const featuredImage = getFeaturedImageUrl(post, 'large');
  const authorName = getAuthorName(post);
  const excerpt = getExcerpt(post, 200);
  const formattedDate = formatPostDate(post.date);
  const categories = getPostCategories(post);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <div className="relative overflow-hidden rounded-2xl glass-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          {featuredImage && (
            <div className="relative h-48 sm:h-64 lg:h-full min-h-[300px] sm:min-h-[400px] overflow-hidden">
              <img
                src={featuredImage}
                alt={post.title.rendered}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/80" />
            </div>
          )}

          {/* Content Section */}
          <div className="p-4 sm:p-6 lg:p-12 flex flex-col justify-center relative z-10">
            <Badge className="bg-primary text-white w-fit mb-3 sm:mb-4 text-xs sm:text-sm">
              Featured Post
            </Badge>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {categories.slice(0, 2).map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="border-primary/30 text-gray-300 text-xs sm:text-sm"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-1 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{authorName}</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base lg:text-lg">
              {excerpt}
            </p>

            {/* CTA Button */}
            <Link href={`/blog/${post.slug}`}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white w-full lg:w-auto min-h-[44px] text-sm sm:text-base"
              >
                Read Full Article
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

