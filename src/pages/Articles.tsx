import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import type { Article } from "@/lib/types";

// Helper function to convert storage articles to display format
const convertStorageArticles = (storageArticles: Article[]) => {
  return storageArticles
    .filter(article => article.status === 'PUBLISHED' && !article.isArchived)
    .map(article => ({
      title: article.title,
      summary: article.summary || '',
      category: article.category,
      tags: article.tags,
      publishDate: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Draft',
      readingTime: article.readingTime || '5 min read',
      slug: article.slug,
      featured: false,
    }))
    .sort((a, b) => {
      // Sort by publish date, newest first
      const dateA = new Date(a.publishDate === 'Draft' ? '1970-01-01' : a.publishDate);
      const dateB = new Date(b.publishDate === 'Draft' ? '1970-01-01' : b.publishDate);
      return dateB.getTime() - dateA.getTime();
    });
};

const ARTICLES_PER_PAGE = 6;

const Articles = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<ReturnType<typeof convertStorageArticles>>([]);
  const [displayedArticles, setDisplayedArticles] = useState<ReturnType<typeof convertStorageArticles>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<ReturnType<typeof convertStorageArticles>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  // Load articles from storage
  useEffect(() => {
    const loadArticles = () => {
      try {
        const storageArticles = storage.getArticles();
        const convertedArticles = convertStorageArticles(storageArticles);
        setArticles(convertedArticles);
        setFilteredArticles(convertedArticles);
        setDisplayedArticles(convertedArticles.slice(0, ARTICLES_PER_PAGE));
      } catch (error) {
        console.error('Error loading articles:', error);
        toast({
          title: "Error",
          description: "Failed to load articles. Please try again.",
          variant: "destructive"
        });
      }
    };
    loadArticles();
  }, [toast]);

  // Handle category filter from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      const categoryArticles = storage.getArticlesByCategory(categoryFromUrl);
      const convertedCategoryArticles = convertStorageArticles(categoryArticles);
      setFilteredArticles(convertedCategoryArticles);
      setDisplayedArticles(convertedCategoryArticles.slice(0, ARTICLES_PER_PAGE));
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Calculate pagination
  const hasMoreArticles = displayedArticles.length < filteredArticles.length;
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
    setCurrentPage(1);
    setDisplayedArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
  }, [searchQuery, articles, filteredArticles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    setSearchParams({});
    setFilteredArticles(articles);
    setDisplayedArticles(articles.slice(0, ARTICLES_PER_PAGE));
    setCurrentPage(1);
  };

  const loadMoreArticles = () => {
    setIsLoading(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    
    setDisplayedArticles(prev => [
      ...prev,
      ...filteredArticles.slice(startIndex, endIndex)
    ]);
    setCurrentPage(nextPage);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Legal Insights & Analysis
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore comprehensive legal articles covering constitutional law, criminal procedure, 
              property rights, and more. Stay informed about the latest legal developments 
              affecting Kenya and East Africa.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search articles"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Results Summary */}
          {searchQuery && (
            <div className="mb-6 text-sm text-muted-foreground">
              {filteredArticles.length === 0 
                ? `No articles found for "${searchQuery}"`
                : `Showing ${displayedArticles.length} of ${filteredArticles.length} articles for "${searchQuery}"`
              }
            </div>
          )}

          {/* Category Filter Display */}
          {selectedCategory && (
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-lg">
                <span className="text-sm font-medium">Category:</span>
                <span className="text-sm">{selectedCategory}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCategoryFilter}
                  className="h-6 w-6 p-0 hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
              </span>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article, index) => (
              <ArticleCard
                key={article.slug}
                {...article}
                featured={index === 0 && currentPage === 1}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all articles.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}

          {/* Load More */}
          {hasMoreArticles && filteredArticles.length > 0 && (
            <div className="text-center mt-12">
              <Button
                ref={loadMoreButtonRef}
                variant="outline"
                size="lg"
                onClick={loadMoreArticles}
                disabled={isLoading}
                aria-label={`Load more articles (page ${currentPage + 1} of ${totalPages})`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Articles...
                  </>
                ) : (
                  `Load More Articles (${filteredArticles.length - displayedArticles.length} remaining)`
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Showing {displayedArticles.length} of {filteredArticles.length} articles
              </p>
            </div>
          )}

          {/* End Message */}
          {!hasMoreArticles && displayedArticles.length > ARTICLES_PER_PAGE && (
            <div className="text-center mt-12 py-8 border-t border-border">
              <p className="text-muted-foreground">
                You've reached the end! Showing all {displayedArticles.length} articles.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Articles;