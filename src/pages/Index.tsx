import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';

export default function Index() {
  const navigate = useNavigate();
  const { user, isLoading, error } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // If there's an authentication error, stay on the index page
      if (error) {
        console.error("Authentication error:", error);
        // We don't redirect, user stays on this page
      } else if (user) {
        // User is authenticated, redirect to dashboard
        navigate('/dashboard');
      } else {
        // No user, redirect to auth
        navigate('/auth');
      }
    }
  }, [navigate, user, isLoading, error]);

  // Show error message if authentication fails
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Authentication Error</h1>
        <p className="text-lg text-muted-foreground mb-4">There was a problem connecting to the authentication service.</p>
        <p className="text-sm text-gray-500 mb-8">{error.message}</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Default view while determining where to navigate
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome</h1>
      <p className="text-lg text-muted-foreground">Redirecting you to the right place...</p>
    </div>
  );
}
