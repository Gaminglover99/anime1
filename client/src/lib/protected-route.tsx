import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import LoadingAnime from "@/components/ui/loading-anime";

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: {
  path: string;
  component: () => React.JSX.Element | null;
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();

  // This effect only runs when an admin-only route is accessed
  useEffect(() => {
    if (!isLoading && user && adminOnly && user.role !== "Admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
    }
  }, [user, isLoading, adminOnly]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-[#111]">
          <LoadingAnime text="Checking access..." />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check admin access
  const isAdmin = user.role === "Admin";
  const isManager = user.role === "Manager";
  const needsAdminAccess = path.startsWith("/admin") || adminOnly;
  
  // Allow manager access to anime management but not user management
  const isManagerAllowedPath = 
    path.startsWith("/admin/anime") || 
    path.startsWith("/admin/seasons") || 
    path.startsWith("/admin/episodes");
  
  if (needsAdminAccess && !isAdmin && !(isManager && isManagerAllowedPath)) {
    console.log("Access denied: User doesn't have sufficient permissions", user);
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
