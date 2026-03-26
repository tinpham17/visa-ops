import { Badge } from "@/components/ui/badge"
import type { VisaApplicationStatus } from "@/lib/api"

const statusColors: Record<VisaApplicationStatus, string> = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
  DOCS_REQUIRED: "bg-orange-100 text-orange-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
}

interface StatusBadgeProps {
  status: VisaApplicationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={`${statusColors[status]} ${className || ""}`}>
      {status.replace("_", " ")}
    </Badge>
  )
}
