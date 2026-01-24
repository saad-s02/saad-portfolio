"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";
import { ReactNode, useCallback } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { accessToken, loading: tokenLoading, getAccessToken } = useAccessToken();

  const loading = (isLoading ?? false) || (tokenLoading ?? false);
  // Must have both user AND valid accessToken to be authenticated
  const authenticated = !!user && !!accessToken && !loading;

  const fetchAccessToken = useCallback(async (): Promise<string | null> => {
    // Use getAccessToken() which automatically refreshes if needed
    // This ensures we always get a fresh token for Convex API calls
    const token = await getAccessToken();
    return token ?? null;
  }, [getAccessToken]);

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
