import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Scale, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";

const Index = () => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Get actual article counts for each category
  useEffect(() => {
    const articles = storage.getPublishedArticles();
    const counts: Record<string, number> = {};
    
    articles.forEach(article => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    
    setCategoryCounts(counts);
  }, []);

  // Sample articles data
  const featuredArticles = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* About Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  My Story
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  A passionate legal scholar and practitioner with an LL.B from Mount Kenya University. 
                  Specializing in constitutional law, criminal procedure, and legal policy analysis from 
                  a distinctly Kenyan perspective.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Through this notebook, I share insights on legal developments, case analyses, 
                  and commentary on how law shapes our society. Every piece is crafted with 
                  precision and backed by thorough research.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/articles">
                    <Button variant="legal" size="lg">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Read My Work
                    </Button>
                  </Link>
                  <a href="https://www.linkedin.com/in/abraham-achut-panchol-b18829264/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      <Users className="w-5 h-5 mr-2" />
                      Connect on LinkedIn
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-legal">
                  <img
                    src="/lovable-uploads/a7d0f256-c9c2-4552-8505-8736bd37b221.png"
                    alt="Achut Abraham Panchol - Legal Scholar and Practitioner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-elegant">
                  <Scale className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                In-depth legal analysis, case studies, and commentary on current legal developments 
                affecting Kenya and East Africa.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredArticles.map((article, index) => (
                <ArticleCard
                  key={article.slug}
                  {...article}
                  featured={index === 0}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/articles">
                <Button variant="outline" size="lg">
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explore by Category
              </h2>
              <p className="text-lg text-muted-foreground">
                Dive deeper into specific areas of law
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Constitutional Law", count: categoryCounts["Constitutional Law"] || 0, color: "bg-primary" },
                { name: "Criminal Law", count: categoryCounts["Criminal Law"] || 0, color: "bg-destructive" },
                { name: "Property Law", count: categoryCounts["Property Law"] || 0, color: "bg-accent" },
                { name: "Employment Law", count: categoryCounts["Employment Law"] || 0, color: "bg-secondary" },
                              ].map((category) => (
                  <Link
                    key={category.name}
                    to={`/articles?category=${encodeURIComponent(category.name)}`}
                    className="group p-6 rounded-xl border border-border hover:shadow-card transition-all duration-300 cursor-pointer block"
                  >
                    <div className={`w-12 h-12 ${category.color} rounded-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity`} />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.count} articles
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
