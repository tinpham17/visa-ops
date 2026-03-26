"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AppTopbar } from "@/components/layout/app-topbar"

export default function SettingsPage() {
  return (
    <>
      <AppTopbar title="Settings" />
      <div className="p-4">
        <Card>
          <CardContent className="space-y-4">
            Added as a placeholder for the demo purpose.
          </CardContent>
        </Card>
      </div>
    </>
  )
}
