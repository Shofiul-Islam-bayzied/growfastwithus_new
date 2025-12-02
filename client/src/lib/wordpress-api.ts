/**
 * WordPress REST API Service Layer with Demo Fallback
 */

import type {
  WordPressPost,
  WordPressPostsResponse,
  WordPressCategory,
  WordPressTag,
  WordPressApiError,
} from './wordpress-types';

import {
  DEMO_POSTS,
  DEMO_CATEGORIES,
  DEMO_TAGS,
  getDemoPosts,
  getDemoPostBySlug,
  getFeaturedDemoPost,
  getRelatedDemoPosts,
} from './demo-blog-posts';

// WordPress API URL - will be fetched from backend settings or environment variable
let WORDPRESS_API_URL = import.meta.env.VITE_WORDPRESS_API_URL;
let API_URL_LOADED = false;
let USE_DEMO_MODE = false;

// Enhanced cache implementation with request deduplication
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

function setCachedData<T>(key: string, data: T, ttl: number = 10 * 60 * 1000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

// Prevent duplicate requests for the same data
async function deduplicatedFetch<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
  // Check cache first
  const cached = getCachedData<T>(key);
  if (cached) {
    return cached;
  }
  
  // Check if there's already a pending request
  const pending = pendingRequests.get(key);
  if (pending) {
    return pending as Promise<T>;
  }
  
  // Create new request
  const promise = fetcher().then(data => {
    setCachedData(key, data, ttl);
    pendingRequests.delete(key);
    return data;
  }).catch(error => {
    pendingRequests.delete(key);
    throw error;
  });
  
  pendingRequests.set(key, promise);
  return promise;
}

// Clear cache function (exported for admin use)
export function clearWordPressCache(): void {
  cache.clear();
  console.log('WordPress cache cleared');
}

// Fetch WordPress API URL from backend settings
async function getWordPressApiUrl(): Promise<string | null> {
  if (API_URL_LOADED && WORDPRESS_API_URL) {
    return WORDPRESS_API_URL;
  }

  try {
    // Use public endpoint (no authentication required)
    const response = await fetch('/api/wordpress/config');
    if (response.ok) {
      const settings = await response.json();
      if (settings && settings.apiUrl) {
        WORDPRESS_API_URL = settings.apiUrl;
        API_URL_LOADED = true;
        USE_DEMO_MODE = false;
        return WORDPRESS_API_URL;
      }
    }
  } catch (error) {
    console.warn('Could not fetch WordPress settings from backend:', error);
  }

  // Fallback to environment variable
  API_URL_LOADED = true;
  
  if (!WORDPRESS_API_URL) {
    USE_DEMO_MODE = true;
    console.info('📝 WordPress not configured - using demo blog posts. Configure WordPress in the admin panel to use real content.');
  }
  
  return WORDPRESS_API_URL || null;
}

// Check if WordPress is configured
export async function isWordPressConfigured(): Promise<boolean> {
  const apiUrl = await getWordPressApiUrl();
  return !!apiUrl && !USE_DEMO_MODE;
}

// Export demo mode status
export function isInDemoMode(): boolean {
  return USE_DEMO_MODE;
}

/**
 * Generic fetch wrapper for WordPress API with retry logic
 */
async function wpFetch<T>(endpoint: string, params: Record<string, string | number> = {}, retries = 2): Promise<T> {
  const apiUrl = await getWordPressApiUrl();
  
  if (!apiUrl || USE_DEMO_MODE) {
    throw new Error('DEMO_MODE');
  }

  const url = new URL(endpoint, apiUrl);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NOT_FOUND');
        }
        if (response.status >= 500 && attempt < retries) {
          // Retry on server errors
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        const error: WordPressApiError = await response.json().catch(() => ({ 
          message: `HTTP error! status: ${response.status}` 
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries || (error as Error).message === 'NOT_FOUND') {
        console.error('WordPress API Error:', error);
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  throw new Error('Failed to fetch from WordPress after retries');
}

/**
 * Fetch paginated posts with embedded data (uses backend proxy to avoid CORS)
 */
export async function fetchPosts(
  page: number = 1,
  perPage: number = 6,
  categoryId?: number,
  tagId?: number,
  search?: string
): Promise<WordPressPostsResponse> {
  // Create cache key
  const cacheKey = `posts_${page}_${perPage}_${categoryId || 'all'}_${tagId || 'all'}_${search || 'none'}`;
  
  return deduplicatedFetch(cacheKey, async () => {
    const params: Record<string, string | number> = {
      page,
      per_page: perPage,
      _embed: '1',
      orderby: 'date',
      order: 'desc',
    };

    if (categoryId) {
      params.categories = categoryId;
    }

    if (tagId) {
      params.tags = tagId;
    }

    if (search) {
      params.search = search;
    }

    try {
      // Check if WordPress is configured
      const apiUrl = await getWordPressApiUrl();
      
      if (!apiUrl || USE_DEMO_MODE) {
        console.log('📝 Using demo posts - WordPress not configured');
        // Use demo mode
        const demoResult = getDemoPosts({ page, perPage, categoryId, tagId, search });
        return {
          posts: demoResult.posts,
          pagination: {
            total: demoResult.total,
            totalPages: demoResult.totalPages,
            currentPage: page,
            perPage,
            hasNextPage: page < demoResult.totalPages,
            hasPrevPage: page > 1,
          },
        };
      }

      // Use backend proxy to avoid CORS issues
      const proxyUrl = `/api/wordpress/posts?${new URLSearchParams(params as Record<string, string>).toString()}`;
      console.log('🔄 Fetching WordPress posts via proxy');
      
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        console.error(`❌ WordPress API error! Status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts: WordPressPost[] = await response.json();
      console.log(`✅ Successfully fetched ${posts.length} WordPress posts`);
      
      // Extract pagination info from headers
      const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

      return {
        posts,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          perPage,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error('❌ Error fetching WordPress posts:', error);
      console.log('📝 Falling back to demo posts');
      // Fall back to demo posts on any error
      const demoResult = getDemoPosts({ page, perPage, categoryId, tagId, search });
      return {
        posts: demoResult.posts,
        pagination: {
          total: demoResult.total,
          totalPages: demoResult.totalPages,
          currentPage: page,
          perPage,
          hasNextPage: page < demoResult.totalPages,
          hasPrevPage: page > 1,
        },
      };
    }
  }, 10 * 60 * 1000); // Cache for 10 minutes
}

/**
 * Fetch a single post by slug (with demo fallback)
 */
export async function fetchPostBySlug(slug: string): Promise<WordPressPost | null> {
  const cacheKey = `post_${slug}`;
  
  return deduplicatedFetch(cacheKey, async () => {
    try {
      // Check if WordPress is configured
      const apiUrl = await getWordPressApiUrl();
      
      if (!apiUrl || USE_DEMO_MODE) {
        return getDemoPostBySlug(slug);
      }

      // Use backend proxy
      const response = await fetch(`/api/wordpress/posts/${slug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const post = await response.json();
      return post;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      // Fall back to demo posts
      return getDemoPostBySlug(slug);
    }
  }, 15 * 60 * 1000); // Cache individual posts for 15 minutes
}

/**
 * Fetch featured post (sticky post - with demo fallback)
 */
export async function fetchFeaturedPost(): Promise<WordPressPost | null> {
  try {
    // Check if WordPress is configured
    const apiUrl = await getWordPressApiUrl();
    
    if (!apiUrl || USE_DEMO_MODE) {
      return getFeaturedDemoPost();
    }

    // Use backend proxy
    const response = await fetch('/api/wordpress/posts?sticky=true&per_page=1&_embed=1');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching featured post:', error);
    // Fall back to demo featured post
    return getFeaturedDemoPost();
  }
}

/**
 * Fetch all categories (with demo fallback)
 */
export async function fetchCategories(): Promise<WordPressCategory[]> {
  const cacheKey = 'categories_all';
  
  return deduplicatedFetch(cacheKey, async () => {
    try {
      // Check if WordPress is configured
      const apiUrl = await getWordPressApiUrl();
      
      if (!apiUrl || USE_DEMO_MODE) {
        return DEMO_CATEGORIES;
      }

      // Use backend proxy
      const response = await fetch('/api/wordpress/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fall back to demo categories
      return DEMO_CATEGORIES;
    }
  }, 30 * 60 * 1000); // Cache categories for 30 minutes
}

/**
 * Fetch all tags (with demo fallback)
 */
export async function fetchTags(): Promise<WordPressTag[]> {
  const cacheKey = 'tags_all';
  
  return deduplicatedFetch(cacheKey, async () => {
    try {
      // Check if WordPress is configured
      const apiUrl = await getWordPressApiUrl();
      
      if (!apiUrl || USE_DEMO_MODE) {
        return DEMO_TAGS;
      }

      // Use backend proxy
      const response = await fetch('/api/wordpress/tags');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tags = await response.json();
      return tags;
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Fall back to demo tags
      return DEMO_TAGS;
    }
  }, 30 * 60 * 1000); // Cache tags for 30 minutes
}

/**
 * Search posts by keyword
 */
export async function searchPosts(
  keyword: string,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressPostsResponse> {
  return fetchPosts(page, perPage, undefined, undefined, keyword);
}

/**
 * Fetch related posts based on categories (with demo fallback)
 */
export async function fetchRelatedPosts(
  currentPostId: number,
  categoryIds: number[],
  limit: number = 3
): Promise<WordPressPost[]> {
  if (categoryIds.length === 0) {
    return [];
  }

  try {
    // Check if WordPress is configured
    const apiUrl = await getWordPressApiUrl();
    
    if (!apiUrl || USE_DEMO_MODE) {
      return getRelatedDemoPosts(currentPostId, categoryIds, limit);
    }

    // Use backend proxy
    const response = await fetch(
      `/api/wordpress/posts?categories=${categoryIds[0]}&per_page=${limit + 1}&_embed=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();

    // Filter out the current post
    return posts.filter((post: WordPressPost) => post.id !== currentPostId).slice(0, limit);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    // Fall back to demo related posts
    return getRelatedDemoPosts(currentPostId, categoryIds, limit);
  }
}

/**
 * Get excerpt from post content
 */
export function getExcerpt(post: WordPressPost, maxLength: number = 160): string {
  // Use excerpt if available
  if (post.excerpt?.rendered) {
    const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
    if (excerpt.length <= maxLength) {
      return excerpt;
    }
    return excerpt.substring(0, maxLength) + '...';
  }

  // Fallback to content
  const content = post.content.rendered.replace(/<[^>]*>/g, '').trim();
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}

/**
 * Get full content from post (mirror of getExcerpt - returns complete content)
 */
export function getFullContent(post: WordPressPost, stripHtml: boolean = false): string {
  // Use content if available
  if (post.content?.rendered) {
    const content = post.content.rendered;
    if (stripHtml) {
      return content.replace(/<[^>]*>/g, '').trim();
    }
    return content.trim();
  }

  // Fallback to excerpt if content is not available
  if (post.excerpt?.rendered) {
    const excerpt = post.excerpt.rendered;
    if (stripHtml) {
      return excerpt.replace(/<[^>]*>/g, '').trim();
    }
    return excerpt.trim();
  }

  return '';
}

/**
 * Get featured image URL from post
 */
export function getFeaturedImageUrl(post: WordPressPost, size: 'thumbnail' | 'medium' | 'large' | 'full' = 'medium'): string | null {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  
  if (!featuredMedia) {
    return null;
  }

  // Try to get the specific size
  if (size !== 'full' && featuredMedia.media_details?.sizes?.[size]) {
    return featuredMedia.media_details.sizes[size].source_url;
  }

  // Fallback to full size
  return featuredMedia.source_url;
}

/**
 * Get author name from post
 */
export function getAuthorName(post: WordPressPost): string {
  const author = post._embedded?.author?.[0];
  return author?.name || 'Unknown Author';
}

/**
 * Get categories from post
 */
export function getPostCategories(post: WordPressPost): WordPressCategory[] {
  const terms = post._embedded?.['wp:term'];
  if (!terms || terms.length === 0) {
    return [];
  }
  // Categories are typically the first array in wp:term
  return (terms[0] || []) as WordPressCategory[];
}

/**
 * Get tags from post
 */
export function getPostTags(post: WordPressPost): WordPressTag[] {
  const terms = post._embedded?.['wp:term'];
  if (!terms || terms.length < 2) {
    return [];
  }
  // Tags are typically the second array in wp:term
  return (terms[1] || []) as WordPressTag[];
}

/**
 * Format date for display
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

