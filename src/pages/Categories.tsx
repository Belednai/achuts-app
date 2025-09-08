import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";

const Categories = () => {
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

  const categories = [
    {
      name: "Constitutional Law",
      description: "Analysis of constitutional rights, principles, and landmark decisions",
      slug: "constitutional-law"
    },
    {
      name: "Criminal Law",
      description: "Criminal procedure, evidence, and recent court decisions",
      slug: "criminal-law"
    },
    {
      name: "Property Law",
      description: "Land rights, succession, and property-related legal matters",
      slug: "property-law"
    },
    {
      name: "Employment Law",
      description: "Workplace rights, labor relations, and employment regulations",
      slug: "employment-law"
    },
    {
      name: "Corporate Law",
      description: "Business law, corporate governance, and commercial transactions",
      slug: "corporate-law"
    },
    {
      name: "Environmental Law",
      description: "Environmental protection, climate change, and sustainability law",
      slug: "environmental-law"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Legal Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive collection of legal articles organized by practice area and specialty.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/articles?category=${encodeURIComponent(category.name)}`}
                className="group p-6 rounded-xl border border-border hover:shadow-card transition-all duration-300 cursor-pointer bg-card block"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {categoryCounts[category.name] || 0} articles
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category.description}
                </p>
                
                <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:text-primary/80 transition-colors">
                  Browse articles
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;