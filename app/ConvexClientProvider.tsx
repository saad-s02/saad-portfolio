"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";
import { ReactNode, useCallback, useMemo } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { accessToken, loading: tokenLoading, getAccessToken } = useAccessToken();

  const loading = (isLoading ?? false) || (tokenLoading ?? false);
  // Only authenticated when we have a user and not loading
  const authenticated = !!user && !loading;

  const fetchAccessToken = useCallback(async (): Promise<string | null> => {
    // First try to get a fresh token via getAccessToken() which handles refresh
    try {
      const freshToken = await getAccessToken();
      if (freshToken) {
        return freshToken;
      }
    } catch {
      // Fall through to use cached token
    }
    // Fall back to the current accessToken if getAccessToken fails
    return accessToken ?? null;
  }, [getAccessToken, accessToken]);

  return useMemo(() => ({
    isLoading: loading,
    isAuthenticated: authenticated,
    fetchAccessToken,
  }), [loading, authenticated, fetchAccessToken]);
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
