import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BlogPostCard } from "@/components/BlogPostCard";
import { BlogFeaturedPost } from "@/components/BlogFeaturedPost";
import { BlogSearch } from "@/components/BlogSearch";
import { BlogFilters } from "@/components/BlogFilters";
import { BlogPagination } from "@/components/BlogPagination";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { BookOpen, AlertCircle, Home, ArrowLeft } from "lucide-react";
import {
  fetchPosts,
  fetchFeaturedPost,
  fetchCategories,
  fetchTags,
} from "@/lib/wordpress-api";
import type {
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressPagination,
} from "@/lib/wordpress-types";

export default function Blog() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<WordPressPost | null>(null);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [tags, setTags] = useState<WordPressTag[]>([]);
  const [pagination, setPagination] = useState<WordPressPagination | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load - fetch everything in parallel for faster loading
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load all data in parallel for maximum speed
        const [postsResponse, featured, categoriesData, tagsData] = await Promise.all([
          fetchPosts(1, 6), // Reduced to 6 for faster initial load
          fetchFeaturedPost(),
          fetchCategories(),
          fetchTags(),
        ]);
        
        setPosts(postsResponse.posts);
        setPagination(postsResponse.pagination);
        setFeaturedPost(featured);
        setCategories(categoriesData);
        setTags(tagsData);
        setIsInitialLoad(false);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fetch posts when filters or page changes (after initial load)
  useEffect(() => {
    if (isInitialLoad) return; // Skip on initial load
    
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchPosts(
          currentPage,
          6, // Reduced from 9 to 6 for faster loading
          selectedCategoryId,
          selectedTagId,
          searchQuery
        );
        setPosts(response.posts);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Error loading posts:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, selectedCategoryId, selectedTagId, searchQuery, isInitialLoad]);

  // Reset to page 1 when filters change
  const handleCategorySelect = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleTagSelect = (tagId: number | undefined) => {
    setSelectedTagId(tagId);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEOHead
        title="Blog - GrowFastWithUs | Automation Insights & Articles"
        description="Discover the latest automation tips, industry insights, and best practices to help your business grow faster with smart automation solutions."
        keywords="automation blog, business automation, workflow automation, AI insights, productivity tips, automation articles, business efficiency tips"
        canonical="https://growfastwithus.com/blog"
        ogType="website"
      />

      <AnimatedBackground className="absolute inset-0" />

      {/* Header */}
      <header className="relative z-10 py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 glass-card px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Blog & Insights</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Automation <span className="text-primary">Insights</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Explore the latest trends, tips, and strategies to supercharge your business with automation
            </p>

            {/* Back to Home Link */}
            <Link href="/">
              <a className="inline-flex items-center text-gray-400 hover:text-primary transition-colors text-sm sm:text-base min-h-[44px]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <section className="relative z-10 py-8 sm:py-12 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 sm:mb-12"
            >
              <BlogFeaturedPost post={featuredPost} />
            </motion.div>
          )}

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <BlogSearch
              onSearch={handleSearch}
              initialValue={searchQuery}
              placeholder="Search articles by keyword..."
            />
          </motion.div>

          {/* Filters */}
          {(categories.length > 0 || tags.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 sm:mb-12"
            >
              <Card className="glass-card p-4 sm:p-6">
                <CardContent className="p-0">
                  <BlogFilters
                    categories={categories}
                    tags={tags}
                    selectedCategoryId={selectedCategoryId}
                    selectedTagId={selectedTagId}
                    onCategorySelect={handleCategorySelect}
                    onTagSelect={handleTagSelect}
                    showTags={true}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="glass-card overflow-hidden">
                  <Skeleton className="h-40 sm:h-48 w-full" />
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 sm:h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {!isLoading && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {posts.map((post, index) => (
                  <BlogPostCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <BlogPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && posts.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12 sm:py-20"
            >
              <Card className="glass-card p-6 sm:p-12 max-w-lg mx-auto">
                <CardContent className="p-0">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">No Articles Found</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-2">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                      : "No articles are available at the moment. Check back soon!"}
                  </p>
                  {(selectedCategoryId || selectedTagId || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategoryId(undefined);
                        setSelectedTagId(undefined);
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="text-primary hover:underline text-sm sm:text-base min-h-[44px] px-4"
                    >
                      Clear all filters
                    </button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 sm:py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Card className="glass-card p-6 sm:p-12">
              <CardContent className="p-0">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  Ready to Automate Your Business?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                  Let's discuss how automation can transform your operations and drive growth
                </p>
                <Link href="/booking">
                  <a className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors min-h-[44px]">
                    Book a Free Consultation
                  </a>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

