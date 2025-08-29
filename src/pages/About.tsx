import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Twitter, MapPin, GraduationCap, BookOpen, Scale, Award } from "lucide-react";


const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
                <img
                  src="/lovable-uploads/a7d0f256-c9c2-4552-8505-8736bd37b221.png"
                  alt="Achut Abraham Panchol - Legal Scholar and Practitioner"
                  className="w-40 h-40 rounded-full object-cover shadow-legal mx-auto"
                />
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              My Story
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Legal scholar, constitutional law enthusiast, and advocate for justice. 
              Bridging the gap between complex legal concepts and public understanding.
            </p>
          </div>

          {/* Education & Credentials */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card className="border-border/50 shadow-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <GraduationCap className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-foreground">Education & Credentials</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Bachelor of Laws (LL.B)
                    </h3>
                    <p className="text-muted-foreground mb-2">Mount Kenya University</p>
                    <p className="text-sm text-muted-foreground">
                      Specialized in Constitutional Law, Criminal Procedure, and Legal Policy Analysis
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Areas of Focus
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Constitutional Law",
                        "Criminal Procedure", 
                        "Human Rights",
                        "Legal Policy",
                        "Court Practice",
                        "Legal Research"
                      ].map((area) => (
                        <Badge key={area} variant="secondary" className="bg-primary/10 text-primary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <BookOpen className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-foreground">Professional Journey</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Legal Research & Analysis
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Extensive experience in legal research, case analysis, and constitutional interpretation 
                      with a focus on Kenyan jurisprudence.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Legal Writing & Commentary
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Regular contributor to legal discourse through detailed articles, case commentaries, 
                      and policy analysis pieces.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Community Engagement
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Committed to making legal knowledge accessible to students, practitioners, 
                      and the general public through educational content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-subtle rounded-2xl p-8 md:p-12 mb-16 border border-border/50">
            <div className="text-center max-w-4xl mx-auto">
              <Award className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Mission & Vision
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                To bridge the gap between complex legal concepts and public understanding, 
                fostering a more legally-aware society. Through rigorous analysis and clear 
                communication, I aim to contribute to the development of Kenyan jurisprudence 
                and promote the rule of law.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Education</h3>
                  <p className="text-sm text-muted-foreground">
                    Making legal knowledge accessible to all
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep, thoughtful examination of legal issues
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Advocacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Promoting justice and the rule of law
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Let's Connect
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="legal" size="lg" className="group">
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="lg">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn Profile
              </Button>
              <Button variant="outline" size="lg">
                <Twitter className="w-5 h-5 mr-2" />
                Follow on Twitter
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;