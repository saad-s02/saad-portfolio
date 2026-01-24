"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";
import { ReactNode, useCallback, useRef, useEffect } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { accessToken, loading: tokenLoading, error: tokenError } = useAccessToken();

  const loading = (isLoading ?? false) || (tokenLoading ?? false);
  // Must have both user AND valid accessToken to be authenticated
  const authenticated = !!user && !!accessToken && !loading;

  // Use a ref to store the token for stable access across renders
  const stableAccessToken = useRef<string | null>(null);

  // Update the ref when we have a valid token and no error
  useEffect(() => {
    if (accessToken && !tokenError) {
      stableAccessToken.current = accessToken;
    }
  }, [accessToken, tokenError]);

  const fetchAccessToken = useCallback(async (): Promise<string | null> => {
    // Return the stable token if available and no error
    if (stableAccessToken.current && !tokenError) {
      return stableAccessToken.current;
    }
    return null;
  }, [tokenError]);

  return {
    isLoading: loading,
    isAuthenticated: authenticated,
    fetchAccessToken,
  };
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
        {children}
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  );
}
