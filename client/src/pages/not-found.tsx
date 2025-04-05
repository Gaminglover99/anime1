import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/layout/layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="container min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg text-center max-w-md w-full">
          <div className="flex flex-col items-center mb-6">
            <AlertCircle className="h-16 w-16 text-primary mb-4" />
            <h1 className="text-3xl font-bold mb-2">404</h1>
            <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
