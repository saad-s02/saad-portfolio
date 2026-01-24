"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";
import { ReactNode, useCallback, useMemo } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { getAccessToken, accessToken, loading: tokenLoading } = useAccessToken();

  const loading = (isLoading ?? false) || (tokenLoading ?? false);
  const authenticated = !!user && !loading;

  const fetchAccessToken = useCallback(async ({ forceRefreshToken }: { forceRefreshToken: boolean }): Promise<string | null> => {
    // With eagerAuth enabled, getAccessToken() returns the token synchronously
    // If available, use synchronous access; otherwise fall back to the async token
    const syncToken = getAccessToken?.();
    if (typeof syncToken === 'string') {
      return syncToken;
    }
    // Fall back to async token if available
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
