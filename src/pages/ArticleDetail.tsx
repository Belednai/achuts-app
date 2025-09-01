import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Calendar, Clock, Share2, ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import type { Article as StorageArticle } from "@/lib/types";

interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  publishedAt?: string;
  readingTime?: string;
  slug: string;
  author: string;
  coverImage?: string;
  featured?: boolean;
}

// Helper function to convert storage article to display article
const convertStorageArticle = (storageArticle: StorageArticle): Article => {
  return {
    id: storageArticle.id,
    title: storageArticle.title,
    content: storageArticle.content,
    summary: storageArticle.summary,
    category: storageArticle.category,
    tags: storageArticle.tags,
    publishedAt: storageArticle.publishedAt,
    readingTime: storageArticle.readingTime,
    slug: storageArticle.slug,
    author: "Achut Abraham Panchol", // Default author
    coverImage: storageArticle.coverImage,
    featured: false, // Default to false
  };
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = () => {
      setLoading(true);
      
      // Track analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'read_article_clicked', {
          event_category: 'engagement',
          event_label: slug,
        });
      }
      
      try {
        // Get article from storage by slug
        const foundArticle = storage.getArticleBySlug(slug || '');
        
        if (foundArticle) {
          // Only show published articles that are not archived
          if (foundArticle.status === 'PUBLISHED' && !foundArticle.isArchived) {
            setArticle(convertStorageArticle(foundArticle));
          } else {
            setArticle(null);
            toast({
              title: "Article Not Available",
              description: "This article is not currently published or has been archived.",
              variant: "destructive"
            });
          }
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
        toast({
          title: "Error",
          description: "Failed to load article. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, toast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title || '',
        text: article?.summary || '',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Article link has been copied to clipboard.",
      });
    }
  };

  const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, the article you're looking for doesn't exist or may have been archived.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/articles')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
              <Button onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/articles">Articles</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              {article.featured && (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
              {article.title}
            </h1>
            
            {article.summary && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {article.summary}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime || calculateReadingTime(article.content)}</span>
              </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="mb-6">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
              <Button onClick={() => navigate('/articles')} variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="text-foreground leading-relaxed"
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Published by {article.author}
              </div>
              
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </footer>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
