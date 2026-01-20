"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Wrapper to adapt WorkOS useAuth to Convex's expected signature
function useAuthAdapter() {
  const auth = useAuth();
  const { getAccessToken } = useAccessToken();

  return {
    isLoading: auth.loading,
    user: auth.user,
    getAccessToken: async () => {
      const token = await getAccessToken();
      return token ?? null;
    },
  };
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider>
      <ConvexProviderWithAuthKit client={convex} useAuth={useAuthAdapter}>
        {children}
      </ConvexProviderWithAuthKit>
    </AuthKitProvider>
  );
}
