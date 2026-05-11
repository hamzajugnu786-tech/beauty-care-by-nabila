"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AnnouncerProvider } from "@/components/accessibility/Announcer";
import { SkipToContent } from "@/components/accessibility/SkipToContent";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        <AnnouncerProvider>
          <SkipToContent />
          {children}
        </AnnouncerProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
