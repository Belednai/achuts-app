import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-legal.jpg";
import { useEffect } from "react";
import "./HeroAnimation.css";

const Hero = () => {
  useEffect(() => {
    const root = document.getElementById('hero-animated');
    if (!root) return;

    // Set per-element stagger from data-delay
    root.querySelectorAll('.hero-line').forEach((el) => {
      const d = parseInt(el.getAttribute('data-delay') || '0', 10);
      (el as HTMLElement).style.setProperty('--d', d + 'ms');
    });

    // Reveal once when hero enters viewport
    let io: IntersectionObserver;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            root.classList.add('is-visible');
            io.disconnect();
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 });
      io.observe(root);
    } else {
      root.classList.add('is-visible');
    }

    return () => {
      if (io) io.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden py-8 sm:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Legal books and scales of justice"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <section id="hero-animated" className="hero-banner space-y-4 sm:space-y-6">
            <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              <span className="hero-line block" data-delay="0">My Legal</span>
              <span className="hero-line block text-primary-foreground/90" data-delay="120">Notebook</span>
            </h1>
            <p className="hero-tagline hero-line text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed px-2" data-delay="240">
              Legal insights, constitutional commentary, and case analyses from a Kenyan perspective. Exploring the intersection of law, justice, and society.
            </p>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link to="/articles" className="w-full sm:w-auto">
              <Button variant="hero" size="lg" className="group w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Articles
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
                <PenTool className="w-5 h-5 mr-2" />
                My Story
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto pt-4 sm:pt-8">
            <div className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary-foreground">15+</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Articles Published</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary-foreground">5</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Years Experience</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary-foreground">LL.B</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Mount Kenya University</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;