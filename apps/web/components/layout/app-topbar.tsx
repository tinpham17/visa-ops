"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { TypographyH1 } from "../ui/typography"

interface AppTopbarProps {
  title: string
  extraSlot?: React.ReactNode
}

export function AppTopbar({ title, extraSlot }: AppTopbarProps) {
  return (
    <header className="flex h-[65px] shrink-0 items-center justify-between gap-2 px-4 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <TypographyH1 className="text-lg">{title}</TypographyH1>
      </div>
      {extraSlot}
    </header>
  )
}
