"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { visaApplicationsApi, VISA_APPLICATION_STATUSES } from "@/lib/api"
import type {
  VisaApplication,
  VisaApplicationStatus,
  Note,
  AddVisaApplicationNoteRequestBody,
} from "@/lib/api"
import { StatusBadge } from "@/components/feature/visa-application/status-badge"
import { ConfirmDialog } from "@/components/feature/shared/confirm-dialog"
import { AppTopbar } from "@/components/layout/app-topbar"
import { AppContent } from "@/components/layout/app-content"
import { ChevronLeft, Trash2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function VisaApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [application, setApplication] = useState<VisaApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState<AddVisaApplicationNoteRequestBody>({
    author: "",
    content: "",
  })
  const [addingNote, setAddingNote] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await visaApplicationsApi.getVisaApplication(applicationId)

      if (error) {
        toast.error(`Failed to fetch application: ${error}`)
        setApplication(null)
      } else if (data) {
        setApplication(data.data)
        setNotes(data.data?.notes || [])
      } else {
        setApplication(null)
        setNotes([])
      }
    } catch {
      toast.error("Failed to fetch visa application")
      setApplication(null)
    } finally {
      setLoading(false)
    }
  }, [applicationId])

  useEffect(() => {
    if (applicationId) {
      fetchApplication()
    }
  }, [applicationId, fetchApplication])

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newNote.author || !newNote.content) {
      toast.error("Please fill in all note fields")
      return
    }

    try {
      setAddingNote(true)

      const { error } = await visaApplicationsApi.addVisaApplicationNote(applicationId, newNote)

      if (error) {
        toast.error(`Failed to add note: ${error}`)
      } else {
        toast.success("Note added successfully")
        setNewNote({ author: "", content: "" })
        setShowNoteForm(false)
        fetchApplication()
      }
    } catch {
      toast.error("Failed to add note")
    } finally {
      setAddingNote(false)
    }
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<VisaApplicationStatus>("SUBMITTED")
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const { error } = await visaApplicationsApi.deleteVisaApplication(applicationId)

      if (error) {
        toast.error(`Failed to delete application: ${error}`)
      } else {
        toast.success("Application deleted successfully")
        router.push("/")
      }
    } catch {
      toast.error("Failed to delete application")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!application || selectedStatus === application.status) {
      toast.error("Please select a different status")
      return
    }

    try {
      setUpdatingStatus(true)
      const { error } = await visaApplicationsApi.updateVisaApplicationStatus(applicationId, {
        status: selectedStatus,
      })

      if (error) {
        toast.error(`Failed to update status: ${error}`)
      } else {
        toast.success("Status updated successfully")
        setShowEditForm(false)
        fetchApplication()
      }
    } catch {
      toast.error("Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>
  }

  if (!application) {
    return <div className="container mx-auto p-6 text-center">Application not found</div>
  }

  return (
    <>
      <AppTopbar
        title="Visa Application"
        extraSlot={
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 />
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              <ChevronLeft />
              Back
            </Button>
          </div>
        }
      />
      <AppContent className="space-y-4">
        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardAction>
              {showEditForm ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowEditForm(false)
                      if (application) {
                        setSelectedStatus(application.status)
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || selectedStatus === application.status}
                  >
                    {updatingStatus ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setShowEditForm(true)
                    if (application) {
                      setSelectedStatus(application.status)
                    }
                  }}
                >
                  Edit
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{application.applicantName}</h1>
                <p className="text-gray-600">{application.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {showEditForm ? (
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value as VisaApplicationStatus)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISA_APPLICATION_STATUSES.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                        >
                          {status.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge status={application.status} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Nationality</Label>
                <p className="font-medium">{application.nationality}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Destination Country</Label>
                <p className="font-medium">{application.destinationCountry}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Visa Type</Label>
                <p className="font-medium">{application.visaType}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Travel Date</Label>
                <p className="font-medium">
                  {new Date(application.travelDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardAction>
              {showNoteForm ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNoteForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    form="note-form"
                    type="submit"
                    disabled={addingNote || !newNote.author.trim() || !newNote.content.trim()}
                  >
                    {addingNote ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowNoteForm(true)}
                >
                  Add Note
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="border rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{note.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No notes yet</p>
            )}

            {/* Add Note Form */}
            {showNoteForm && (
              <form
                id="note-form"
                onSubmit={handleAddNote}
                className="space-y-4 border-t pt-4"
              >
                <h4 className="font-medium">Add New Note</h4>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={newNote.author}
                    onChange={(e) =>
                      setNewNote((prev: AddVisaApplicationNoteRequestBody) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Note</Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote((prev: AddVisaApplicationNoteRequestBody) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Enter your note..."
                    rows={3}
                  />
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </AppContent>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Application"
        description="Are you sure you want to delete this visa application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </>
  )
}
