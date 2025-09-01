import { useState, useCallback, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2 } from "lucide-react";
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
  {
    title: "Constitutional Rights in the Digital Age: Privacy vs. Security in Kenya",
    summary: "An in-depth analysis of how the 2010 Constitution addresses digital privacy rights and the challenges posed by modern surveillance technologies.",
    category: "Constitutional Law",
    tags: ["Privacy Rights", "Digital Law", "Constitutional Analysis"],
    publishDate: "March 15, 2024",
    readingTime: "8 min read",
    slug: "constitutional-rights-digital-age",
    featured: true,
  },
  {
    title: "Understanding Criminal Procedure: Recent Amendments to the CPC",
    summary: "A comprehensive review of the latest amendments to the Criminal Procedure Code and their implications for legal practice.",
    category: "Criminal Law",
    tags: ["Criminal Procedure", "Legal Updates", "Court Practice"],
    publishDate: "March 10, 2024",
    readingTime: "6 min read",
    slug: "criminal-procedure-amendments",
  },
  {
    title: "Land Rights and Succession Laws: A Practical Guide",
    summary: "Navigate the complexities of land inheritance and succession under Kenyan law with practical examples and case studies.",
    category: "Property Law",
    tags: ["Land Law", "Succession", "Property Rights"],
    publishDate: "March 5, 2024",
    readingTime: "10 min read",
    slug: "land-rights-succession-guide",
  },
  {
    title: "Employment Law Update: New Regulations on Remote Work",
    summary: "Recent changes in employment regulations addressing remote work arrangements and their legal implications for employers and employees.",
    category: "Employment Law",
    tags: ["Employment", "Remote Work", "Labor Law"],
    publishDate: "February 28, 2024",
    readingTime: "5 min read",
    slug: "employment-remote-work-regulations",
  },
  {
    title: "Corporate Governance in Kenya: New Compliance Requirements",
    summary: "Understanding the latest corporate governance guidelines and their impact on business operations in Kenya.",
    category: "Corporate Law",
    tags: ["Corporate Governance", "Compliance", "Business Law"],
    publishDate: "February 20, 2024",
    readingTime: "7 min read",
    slug: "corporate-governance-compliance",
  },
  {
    title: "Environmental Law and Climate Change Litigation",
    summary: "Exploring the growing field of environmental law and climate change litigation in the East African context.",
    category: "Environmental Law",
    tags: ["Environmental Law", "Climate Change", "Litigation"],
    publishDate: "February 15, 2024",
    readingTime: "9 min read",
    slug: "environmental-law-climate-litigation",
  },
  {
    title: "Banking Law Reforms: Impact on Financial Institutions",
    summary: "Analysis of recent banking law reforms and their implications for financial institutions operating in Kenya.",
    category: "Banking Law",
    tags: ["Banking", "Financial Regulation", "Reforms"],
    publishDate: "February 10, 2024",
    readingTime: "7 min read",
    slug: "banking-law-reforms-impact",
  },
  {
    title: "Intellectual Property Rights in the Digital Economy",
    summary: "Understanding copyright, trademark, and patent protections in Kenya's growing digital economy.",
    category: "Intellectual Property",
    tags: ["IP Rights", "Digital Economy", "Copyright"],
    publishDate: "February 5, 2024",
    readingTime: "6 min read",
    slug: "intellectual-property-digital-economy",
  },
  {
    title: "Family Law: Recent Developments in Matrimonial Property",
    summary: "Recent court decisions and legislative changes affecting matrimonial property rights in Kenya.",
    category: "Family Law",
    tags: ["Family Law", "Matrimonial Property", "Legal Updates"],
    publishDate: "January 30, 2024",
    readingTime: "8 min read",
    slug: "family-law-matrimonial-property",
  },
  {
    title: "Public Procurement Law: Compliance and Best Practices",
    summary: "A guide to navigating Kenya's public procurement regulations and ensuring compliance.",
    category: "Public Law",
    tags: ["Procurement", "Compliance", "Public Sector"],
    publishDate: "January 25, 2024",
    readingTime: "9 min read",
    slug: "public-procurement-compliance",
  },
  {
    title: "Tax Law Updates: Recent Changes and Implications",
    summary: "Overview of recent amendments to Kenya's tax laws and their impact on businesses and individuals.",
    category: "Tax Law",
    tags: ["Tax Law", "Legal Updates", "Business"],
    publishDate: "January 20, 2024",
    readingTime: "5 min read",
    slug: "tax-law-updates-changes",
  },
  {
    title: "International Trade Law: Kenya's Regional Agreements",
    summary: "Examining Kenya's participation in regional trade agreements and their legal implications.",
    category: "International Law",
    tags: ["Trade Law", "International", "Regional Agreements"],
    publishDate: "January 15, 2024",
    readingTime: "7 min read",
    slug: "international-trade-regional-agreements",
  }
];

const ARTICLES_PER_PAGE = 6;

const Articles = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<any[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
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

  const hasMoreArticles = displayedArticles.length < filteredArticles.length;
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

  // Filter articles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(tag.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
    // Reset pagination when search changes
    setCurrentPage(1);
    setDisplayedArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
  }, [searchQuery, articles, filteredArticles]);

  // Update displayed articles when filtered articles change
  useEffect(() => {
    setDisplayedArticles(filteredArticles.slice(0, currentPage * ARTICLES_PER_PAGE));
  }, [filteredArticles, currentPage]);

  const loadMoreArticles = useCallback(async () => {
    if (isLoading || !hasMoreArticles) return;

    setIsLoading(true);

    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'load_more_clicked', {
        event_category: 'engagement',
        event_label: 'articles_pagination',
        value: currentPage + 1,
      });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * ARTICLES_PER_PAGE;
    const newArticles = filteredArticles.slice(startIndex, endIndex);

    setDisplayedArticles(newArticles);
    setCurrentPage(nextPage);
    setIsLoading(false);

    // Maintain scroll position relative to the button
    setTimeout(() => {
      if (loadMoreButtonRef.current) {
        const rect = loadMoreButtonRef.current.getBoundingClientRect();
        const offset = window.pageYOffset + rect.top - 100; // 100px offset from top
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 100);

    toast({
      title: "Articles loaded",
      description: `Showing ${newArticles.length} of ${filteredArticles.length} articles`,
    });
  }, [isLoading, hasMoreArticles, currentPage, filteredArticles, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Legal Articles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In-depth legal analysis, case studies, and commentary on current legal developments 
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