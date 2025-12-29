import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { config, getThemeCSSVariables } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${config.appName} - ${config.organizationFullName}`,
  description: `${config.appDescription} para ${config.organizationFullName}`,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeVars = getThemeCSSVariables();

  return (
    <html lang="es-AR" className={inter.variable} suppressHydrationWarning>
      <head>
        <style>
          {`:root {
            ${Object.entries(themeVars)
              .map(([key, value]) => `${key}: ${value};`)
              .join("\n            ")}
          }`}
        </style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (darkModePreference) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: config.theme.secondary[800],
              color: config.theme.secondary[50],
              borderRadius: "0.75rem",
            },
            success: {
              iconTheme: {
                primary: config.theme.primary[500],
                secondary: config.theme.secondary[50],
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: config.theme.secondary[50],
              },
            },
          }}
        />
      </body>
    </html>
  );
}
