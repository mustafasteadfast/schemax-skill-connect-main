import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/MockAuthContext";
import ClientHome from "./ClientHome";
import FreelancerHome from "./FreelancerHome";
import Index from "./Index";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show the public landing page
  if (!user) {
    return <Index />;
  }

  // If authenticated, show role-specific home
  if (user.role === 'freelancer') {
    return <FreelancerHome />;
  } else {
    return <ClientHome />;
  }
}