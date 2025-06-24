import "@/styles/globals.css";

import { PropsWithChildren } from "react";

import { QueryClientWrapper } from "@/components/query-client-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"min-h-screen font-sans"}>
        <QueryClientWrapper>
          <ThemeProvider attribute="class">
            {children}
            <ThemeSwitcher className="absolute right-5 bottom-5 z-10" />
          </ThemeProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
