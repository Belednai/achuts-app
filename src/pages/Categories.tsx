import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Categories = () => {
  const categories = [
    {
      name: "Constitutional Law",
      description: "Analysis of constitutional rights, principles, and landmark decisions",
      articleCount: 12,
      slug: "constitutional-law"
    },
    {
      name: "Criminal Law",
      description: "Criminal procedure, evidence, and recent court decisions",
      articleCount: 8,
      slug: "criminal-law"
    },
    {
      name: "Property Law",
      description: "Land rights, succession, and property-related legal matters",
      articleCount: 6,
      slug: "property-law"
    },
    {
      name: "Employment Law",
      description: "Workplace rights, labor relations, and employment regulations",
      articleCount: 4,
      slug: "employment-law"
    },
    {
      name: "Corporate Law",
      description: "Business law, corporate governance, and commercial transactions",
      articleCount: 5,
      slug: "corporate-law"
    },
    {
      name: "Environmental Law",
      description: "Environmental protection, climate change, and sustainability law",
      articleCount: 3,
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
              <div
                key={category.slug}
                className="group p-6 rounded-xl border border-border hover:shadow-card transition-all duration-300 cursor-pointer bg-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {category.articleCount} articles
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category.description}
                </p>
                
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                  Browse articles
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;