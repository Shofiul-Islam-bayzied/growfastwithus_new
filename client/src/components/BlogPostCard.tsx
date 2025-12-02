import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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

interface BlogPostCardProps {
  post: WordPressPost;
  index?: number;
}

export function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  const featuredImage = getFeaturedImageUrl(post, 'medium');
  const authorName = getAuthorName(post);
  const excerpt = getExcerpt(post, 150);
  const formattedDate = formatPostDate(post.date);
  const categories = getPostCategories(post);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group h-full"
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="service-card h-full overflow-hidden cursor-pointer">
          {/* Featured Image */}
          {featuredImage && (
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img
                src={featuredImage}
                alt={post.title.rendered}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Categories Badge */}
              {categories.length > 0 && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <Badge className="bg-primary text-white text-xs sm:text-sm">
                    {categories[0].name}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <CardContent className="p-4 sm:p-6 relative z-10">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{authorName}</span>
              </div>
            </div>

            {/* Title */}
            <h3 
              className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Excerpt */}
            <p className="text-gray-400 mb-3 sm:mb-4 line-clamp-3 leading-relaxed text-sm sm:text-base">
              {excerpt}
            </p>

            {/* Read More Link */}
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all text-sm sm:text-base min-h-[44px]">
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

