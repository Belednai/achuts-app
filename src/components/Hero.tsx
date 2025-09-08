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
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
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
        <div className="max-w-4xl mx-auto">
          <section id="hero-animated" className="hero-banner">
            <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              <span className="hero-line" data-delay="0">My Legal</span>
              <span className="hero-line text-primary-foreground/90" data-delay="120">Notebook</span>
            </h1>
            <p className="hero-tagline hero-line text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed" data-delay="240">
              Legal insights, constitutional commentary, and case analyses from a Kenyan perspective. Exploring the intersection of law, justice, and society.
            </p>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/articles">
              <Button variant="hero" size="lg" className="group">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Articles
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary hover:text-primary-foreground">
                <PenTool className="w-5 h-5 mr-2" />
                My Story
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-2">15+</div>
              <div className="text-primary-foreground/80">Articles Publiesed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-2">5</div>
              <div className="text-primary-foreground/80">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-2">LL.B</div>
              <div className="text-primary-foreground/80">Mount Kenya University</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;