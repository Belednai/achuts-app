import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Calendar, Clock, Share2, ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  publishDate: string;
  readingTime: string;
  slug: string;
  author: string;
  coverImage?: string;
  featured?: boolean;
}

// Mock article data - in real app, this would come from an API or CMS
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Constitutional Rights in the Digital Age: Privacy vs. Security in Kenya",
    content: `
      <h2>Introduction</h2>
      <p>The digital revolution has fundamentally transformed how we interact, communicate, and conduct business. In Kenya, this transformation has been particularly pronounced since the adoption of the 2010 Constitution, which enshrined comprehensive rights and freedoms. However, the intersection of digital technology and constitutional rights presents complex challenges that require careful legal analysis.</p>
      
      <h2>Constitutional Framework</h2>
      <p>Article 31 of the Constitution of Kenya 2010 guarantees the right to privacy, stating that every person has the right to privacy, which includes the right not to have their person, home or property searched, their possessions seized, or the privacy of their communications infringed. This provision has profound implications in the digital age.</p>
      
      <h2>Digital Privacy Challenges</h2>
      <p>The rise of digital surveillance technologies, social media platforms, and data collection practices has created new frontiers for privacy rights. Courts must now grapple with questions such as:</p>
      <ul>
        <li>What constitutes reasonable expectation of privacy in digital communications?</li>
        <li>How do we balance national security interests with individual privacy rights?</li>
        <li>What are the limits of government surveillance in the digital sphere?</li>
      </ul>
      
      <h2>Case Law Analysis</h2>
      <p>Recent decisions by Kenyan courts have begun to address these issues. In <em>Nubian Rights Forum & 2 others v Attorney General & 6 others</em> [2020] eKLR, the High Court examined the constitutionality of certain provisions of the Security Laws (Amendment) Act, particularly those relating to digital surveillance.</p>
      
      <h2>International Perspectives</h2>
      <p>Kenya's approach to digital privacy rights can be informed by international jurisprudence. The European Court of Human Rights, for instance, has developed extensive case law on digital privacy, while the US Supreme Court has grappled with similar issues in cases like <em>Carpenter v. United States</em>.</p>
      
      <h2>Legislative Developments</h2>
      <p>The Data Protection Act, 2019 represents a significant step forward in protecting digital privacy rights in Kenya. The Act establishes comprehensive data protection principles and creates the Office of the Data Protection Commissioner. However, questions remain about its interaction with constitutional privacy rights and national security legislation.</p>
      
      <h2>Conclusion</h2>
      <p>As technology continues to evolve, so too must our understanding of constitutional rights in the digital age. The challenge for legal practitioners, policymakers, and courts is to strike an appropriate balance between individual privacy rights and legitimate state interests, while ensuring that constitutional protections remain meaningful in an increasingly digital world.</p>
    `,
    summary: "An in-depth analysis of how the 2010 Constitution addresses digital privacy rights and the challenges posed by modern surveillance technologies.",
    category: "Constitutional Law",
    tags: ["Privacy Rights", "Digital Law", "Constitutional Analysis"],
    publishDate: "March 15, 2024",
    readingTime: "8 min read",
    slug: "constitutional-rights-digital-age",
    author: "Achut Abraham Panchol",
    featured: true,
  },
  {
    id: "2",
    title: "Understanding Criminal Procedure: Recent Amendments to the CPC",
    content: `
      <h2>Overview of Recent Amendments</h2>
      <p>The Criminal Procedure Code has undergone significant amendments in recent years, reflecting the evolving nature of criminal justice in Kenya. These changes aim to enhance efficiency, protect rights, and align with constitutional requirements.</p>
      
      <h2>Key Changes</h2>
      <p>The most significant amendments include:</p>
      <ul>
        <li>Enhanced provisions for victim protection</li>
        <li>Streamlined pre-trial procedures</li>
        <li>Digital evidence handling protocols</li>
        <li>Alternative dispute resolution mechanisms</li>
      </ul>
      
      <h2>Practical Implications</h2>
      <p>These amendments have far-reaching implications for legal practice, particularly in how cases are prosecuted and defended. Practitioners must familiarize themselves with new procedures to ensure effective representation.</p>
      
      <h2>Case Study Analysis</h2>
      <p>Recent cases have demonstrated the practical application of these amendments, showing both their benefits and potential challenges in implementation.</p>
      
      <h2>Conclusion</h2>
      <p>The amendments represent a positive step toward modernizing Kenya's criminal justice system while maintaining respect for constitutional rights and due process.</p>
    `,
    summary: "A comprehensive review of the latest amendments to the Criminal Procedure Code and their implications for legal practice.",
    category: "Criminal Law",
    tags: ["Criminal Procedure", "Legal Updates", "Court Practice"],
    publishDate: "March 10, 2024",
    readingTime: "6 min read",
    slug: "criminal-procedure-amendments",
    author: "Achut Abraham Panchol",
  },
  // Add more mock articles as needed...
];

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchArticle = () => {
      setLoading(true);
      
      // Track analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'read_article_clicked', {
          event_category: 'engagement',
          event_label: slug,
        });
      }
      
      setTimeout(() => {
        const foundArticle = mockArticles.find(a => a.slug === slug);
        setArticle(foundArticle || null);
        setLoading(false);
      }, 500);
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || 'Legal Article';
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        toast({
          title: "Shared successfully",
          description: "Article shared via device sharing options",
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Could not copy link",
          description: "Please copy the URL manually",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded-lg mb-4"></div>
                <div className="h-12 bg-muted rounded-lg mb-6"></div>
                <div className="h-64 bg-muted rounded-lg mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Sorry, the article you're looking for doesn't exist or may have been archived.
              </p>
              <Button onClick={() => navigate('/articles')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Set document title and meta tags for SEO
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Achut's Law Notebook`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', article.summary);
      }
      
      // Add Open Graph meta tags
      const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', article.title);
      if (!document.querySelector('meta[property="og:title"]')) {
        document.head.appendChild(ogTitle);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', article.summary);
      if (!document.querySelector('meta[property="og:description"]')) {
        document.head.appendChild(ogDescription);
      }
      
      const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', window.location.href);
      if (!document.querySelector('meta[property="og:url"]')) {
        document.head.appendChild(ogUrl);
      }
      
      // Add canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.href;
    }
  }, [article]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-8">
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
            <header className="mb-8">
              <div className="mb-4">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {article.category}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="mb-8">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-card"
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:text-muted-foreground prose-li:mb-2
                  prose-strong:text-foreground prose-em:text-foreground
                  prose-a:text-primary hover:prose-a:text-primary-hover"
              />
            </article>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => navigate('/articles')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Articles
                </Button>
                <Button variant="ghost" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
