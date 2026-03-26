import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import "./globals.css"

export const metadata: Metadata = {
  title: "Visa Operations - Visa Application Management",
  description: "Manage visa applications with type-safe API integration",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider className="h-svh overflow-hidden">
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
