"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import type { VisaApplication, VisaApplicationStatus } from "@/lib/api"
import { visaApplicationsApi, VISA_APPLICATION_STATUSES } from "@/lib/api"
import { StatusBadge } from "@/components/feature/visa-application/status-badge"
import { AppTopbar } from "@/components/layout/app-topbar"
import { AppContent } from "@/components/layout/app-content"

export default function VisaApplicationsPage() {
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<VisaApplicationStatus | "">("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)

        const { data, error } = await visaApplicationsApi.getVisaApplications({
          page,
          limit: 10,
          ...(search && { search }),
          ...(statusFilter && { status: statusFilter }),
        })
        if (error) {
          toast.error(`Failed to fetch visa applications: ${error}`)
          setApplications([])
        } else {
          setApplications(data.data)
          setTotalPages(data.totalPages)
        }
      } catch (error) {
        console.error("Failed to fetch visa applications:", error)
        toast.error("Failed to fetch visa applications")
        setApplications([])
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [search, statusFilter, page])

  return (
    <>
      <AppTopbar
        title="Visa Applications"
        extraSlot={<Button onClick={() => (window.location.href = "/new")}>New Application</Button>}
      />
      <AppContent>
        <Card>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as VisaApplicationStatus | "")}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  {VISA_APPLICATION_STATUSES.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : !Array.isArray(applications) || applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No visa applications found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => (window.location.href = `/${application.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{application.applicantName}</div>
                          <div className="text-xs text-gray-500">{application.email}</div>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Nationality:</span>
                          <span className="ml-1 font-medium">{application.nationality}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Destination:</span>
                          <span className="ml-1 font-medium">{application.destinationCountry}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-1 font-medium">{application.visaType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Travel:</span>
                          <span className="ml-1 font-medium">
                            {new Date(application.travelDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={page === pageNum}
                        onClick={() => setPage(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className={
                        page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </AppContent>
    </>
  )
}
