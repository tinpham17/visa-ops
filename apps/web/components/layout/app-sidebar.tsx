"use client"

import { useRouter, usePathname } from "next/navigation"
import { Earth, FileUser, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { state } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Applications",
      icon: FileUser,
      url: "/",
      isActive: pathname === "/",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/settings",
      isActive: pathname === "/settings",
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        <div className="border-b">
          {state === "expanded" ? (
            <div className="h-16 flex items-center gap-2 px-3">
              <Earth />
              <span className="truncate font-semibold uppercase leading-tight">Visa Ops</span>
            </div>
          ) : (
            <div className="h-16 flex items-center justify-center">
              <Earth />
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    onClick={() => router.push(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
