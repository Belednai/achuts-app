import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Admin = () => {
  useEffect(() => {
    document.title = "Admin - Achut's Legal Notebook";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
          <div className="bg-card rounded-lg border p-8 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Welcome to the admin dashboard. This area is under development.
            </p>
            <p className="text-sm text-muted-foreground">
              Admin functionality will be available soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;