import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Legal Disclaimer
            </h1>
            <p className="text-lg text-muted-foreground">
              Important information about the content and use of this website
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-destructive mb-3">Important Notice</h2>
              <p className="text-foreground mb-0">
                The content on this website is for educational and informational purposes only and does not constitute legal advice. 
                No attorney-client relationship is formed by reading or using the information provided.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Not Legal Advice</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The information provided on Achut's Law Notebook is intended for general educational purposes only. 
                  It should not be considered as legal advice for any specific situation. Legal advice can only be 
                  provided by a qualified attorney who is familiar with the specific facts and circumstances of your case.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">No Attorney-Client Relationship</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reading the content on this website, subscribing to the newsletter, or contacting Achut through 
                  the website does not create an attorney-client relationship. Such a relationship can only be 
                  established through a formal engagement agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Jurisdiction and Applicable Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The content on this website primarily focuses on Kenyan law and legal developments within the 
                  East African region. Laws vary significantly between jurisdictions, and information that applies 
                  in Kenya may not be applicable in other countries or regions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Accuracy and Currency</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While every effort is made to ensure the accuracy and currency of the information provided, 
                  laws change frequently, and legal interpretations evolve. The information on this website 
                  may not reflect the most recent legal developments. Always consult with a qualified attorney 
                  for the most current and applicable legal advice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Achut and Achut's Law Notebook disclaim all liability for any loss or damage arising from 
                  reliance on the information provided on this website. Users are advised to seek professional 
                  legal counsel for their specific legal matters.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">External Links</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This website may contain links to external websites. These links are provided for convenience 
                  only, and their inclusion does not imply endorsement of the content or accuracy of those external sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Professional Consultation Required</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any legal matter, it is strongly recommended that you consult with a qualified attorney 
                  who can provide advice tailored to your specific circumstances and jurisdiction. Do not rely 
                  solely on the information provided on this website for making legal decisions.
                </p>
              </section>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mt-8">
              <p className="text-sm text-muted-foreground text-center mb-0">
                Last updated: March 2024. This disclaimer may be updated from time to time to reflect changes 
                in our practices or applicable law.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;