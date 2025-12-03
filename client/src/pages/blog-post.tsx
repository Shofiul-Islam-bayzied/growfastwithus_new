import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BlogPostCard } from "@/components/BlogPostCard";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  fetchPostBySlug,
  fetchRelatedPosts,
  getFeaturedImageUrl,
  getAuthorName,
  formatPostDate,
  getPostCategories,
  getPostTags,
} from "@/lib/wordpress-api";
import type { WordPressPost } from "@/lib/wordpress-types";
import { useToast } from "@/hooks/use-toast";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const { toast } = useToast();
  
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!params?.slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const postData = await fetchPostBySlug(params.slug);
        
        if (!postData) {
          setError("Post not found");
          setIsLoading(false);
          return;
        }

        setPost(postData);

        // Load related posts
        if (postData.categories.length > 0) {
          const related = await fetchRelatedPosts(
            postData.id,
            postData.categories,
            3
          );
          setRelatedPosts(related);
        }
      } catch (err) {
        console.error("Error loading post:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params?.slug]);

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title.rendered;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The post URL has been copied to your clipboard.",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  // Calculate reading time (rough estimate: 200 words per minute)
  const getReadingTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <AnimatedBackground className="absolute inset-0" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
          <Card className="glass-card max-w-4xl mx-auto">
            <Skeleton className="h-96 w-full" />
            <CardContent className="p-8 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    // Determine error type for better messaging
    const isWordPressNotConfigured = error === "Post not found" && !post;
    const errorTitle = isWordPressNotConfigured 
      ? "Blog Post Not Found" 
      : error || "Post Not Found";
    const errorMessage = isWordPressNotConfigured
      ? "The blog post you're looking for doesn't exist. This might be because WordPress isn't configured yet, or the post was removed."
      : "The blog post you're looking for doesn't exist or has been removed.";
    
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <AnimatedBackground className="absolute inset-0" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
          <Card className="glass-card max-w-2xl mx-auto p-8">
            <CardContent className="p-0 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                {errorTitle}
              </h1>
              <p className="text-gray-400 mb-4">
                {errorMessage}
              </p>
              
              {isWordPressNotConfigured && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-300 mb-2">
                    <strong>Note:</strong> WordPress blog integration is not configured yet.
                  </p>
                  <p className="text-xs text-gray-400">
                    Configure WordPress in the admin panel to display real blog posts,
                    or check out our demo content on the blog page.
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/blog">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
                
                {isWordPressNotConfigured && (
                  <Link href="/admin-login">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      Configure WordPress
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const featuredImage = getFeaturedImageUrl(post, "large");
  const authorName = getAuthorName(post);
  const formattedDate = formatPostDate(post.date);
  const categories = getPostCategories(post);
  const tags = getPostTags(post);
  const readingTime = getReadingTime(post.content.rendered);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEOHead
        title={`${post.title.rendered} - GrowFastWithUs Blog`}
        description={post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160)}
        keywords={`${tags.map((tag) => tag.name).join(", ")}, automation blog, business automation, workflow automation`}
        canonical={`https://growfastwithus.com/blog/${post.slug}`}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title.rendered,
          "description": post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160),
          "author": {
            "@type": "Organization",
            "name": "GrowFastWithUs"
          },
          "publisher": {
            "@type": "Organization",
            "name": "GrowFastWithUs",
            "logo": {
              "@type": "ImageObject",
              "url": "https://growfastwithus.com/logo.png"
            }
          },
          "datePublished": post.date,
          "dateModified": post.modified || post.date,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://growfastwithus.com/blog/${post.slug}`
          }
        }}
      />

      <AnimatedBackground className="absolute inset-0" />

      {/* Back to Blog Navigation */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-8">
        <Link href="/blog">
          <a className="inline-flex items-center text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </a>
        </Link>
      </div>

      {/* Article Content */}
      <article className="relative z-10 container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass-card overflow-hidden">
            {/* Featured Image */}
            {featuredImage && (
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
                <img
                  src={featuredImage}
                  alt={post.title.rendered}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            )}

            <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      className="bg-primary text-white text-xs sm:text-sm"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-400 pb-6 sm:pb-8 border-b border-gray-700">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-700">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-1 sm:mr-2" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] min-w-[44px] p-2 sm:px-3"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] min-w-[44px] p-2 sm:px-3"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("linkedin")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] min-w-[44px] p-2 sm:px-3"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("copy")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 min-h-[44px] min-w-[44px] p-2 sm:px-3"
                >
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div
                className="prose prose-invert prose-lg max-w-none mb-8
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:text-gray-300
                  prose-blockquote:border-l-primary prose-blockquote:text-gray-400
                  prose-code:text-primary prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                  prose-img:rounded-lg prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-8 border-t border-gray-700">
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <BlogPostCard key={relatedPost.id} post={relatedPost} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <Card className="glass-card p-8 lg:p-12 text-center">
            <CardContent className="p-0">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Let's discuss how automation can help you achieve your goals
              </p>
              <Link href="/booking">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Schedule a Free Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
}

