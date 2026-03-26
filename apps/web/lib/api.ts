import { env } from "@/env"
import { z } from "zod"

const API_URL = env.NEXT_PUBLIC_API_URL

/**
 * Generic request function that works on both server and client
 * @param path API path
 * @param init Request init
 * @returns Response data
 */
async function request<T>(path: string, init?: RequestInit): Promise<{ data: T; error?: string }> {
  const url = `${API_URL}${path}`

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    })

    if (!res.ok) {
      let message = res.statusText || `Request failed: ${res.status}`
      try {
        const errJson = (await res.json()) as { error?: string; message?: string }
        message = errJson?.error || errJson?.message || message
      } catch {
        try {
          const errText = await res.text()
          message = errText || message
        } catch {
          // ignore
        }
      }
      return { data: null as T, error: message }
    }

    const data = (await res.json()) as T
    return { data }
  } catch (error) {
    return { data: null as T, error: error instanceof Error ? error.message : String(error) }
  }
}

async function httpGet<T>(path: string, query?: Record<string, unknown>) {
  const queryString = query
    ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
    : ""
  return request<T>(`${path}${queryString}`, { method: "GET" })
}

async function httpDelete<T>(path: string) {
  return request<T>(path, { method: "DELETE" })
}

async function httpPost<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  })
}

async function httpPatch<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  })
}

// ==================== TYPES ====================

export const VisaApplicationStatusSchema = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCS_REQUIRED",
  "APPROVED",
  "REJECTED",
])

export const VISA_APPLICATION_STATUSES = VisaApplicationStatusSchema.options

export const NoteSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
  createdAt: z.string(),
})

export const VisaApplicationSchema = z.object({
  id: z.string(),
  applicantName: z.string(),
  email: z.string(),
  nationality: z.string(),
  destinationCountry: z.string(),
  visaType: z.string(),
  travelDate: z.string(),
  status: VisaApplicationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.array(NoteSchema).optional(),
})

export const CreateVisaApplicationRequestBodySchema = z.object({
  applicantName: z.string(),
  email: z.string(),
  nationality: z.string(),
  destinationCountry: z.string(),
  visaType: z.string(),
  travelDate: z.string(),
})

export const CreateVisaApplicationResponseSchema = z.object({
  data: VisaApplicationSchema,
})

export const UpdateVisaApplicationStatusRequestBodySchema = z.object({
  status: VisaApplicationStatusSchema,
})

export const UpdateVisaApplicationStatusResponseSchema = z.object({
  data: VisaApplicationSchema,
})

export const AddVisaApplicationNoteRequestBodySchema = z.object({
  author: z.string(),
  content: z.string(),
})

export const AddVisaApplicationNoteResponseSchema = z.object({
  data: NoteSchema,
})

export const ListVisaApplicationsRequestQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  status: VisaApplicationStatusSchema.optional(),
})

export const ListVisaApplicationsResponseSchema = z.object({
  data: z.array(VisaApplicationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export const GetVisaApplicationResponseSchema = z.object({
  data: VisaApplicationSchema,
})

export const DeleteVisaApplicationResponseSchema = z.object({
  data: VisaApplicationSchema,
})

export type VisaApplicationStatus = z.infer<typeof VisaApplicationStatusSchema>
export type VisaApplication = z.infer<typeof VisaApplicationSchema>
export type Note = z.infer<typeof NoteSchema>

export type CreateVisaApplicationRequestBody = z.infer<
  typeof CreateVisaApplicationRequestBodySchema
>
export type CreateVisaApplicationResponse = z.infer<typeof CreateVisaApplicationResponseSchema>

export type GetVisaApplicationResponse = z.infer<typeof GetVisaApplicationResponseSchema>
export type DeleteVisaApplicationResponse = z.infer<typeof DeleteVisaApplicationResponseSchema>
export type ListVisaApplicationsRequestQuery = z.infer<
  typeof ListVisaApplicationsRequestQuerySchema
>
export type ListVisaApplicationsResponse = z.infer<typeof ListVisaApplicationsResponseSchema>
export type UpdateVisaApplicationStatusRequestBody = z.infer<
  typeof UpdateVisaApplicationStatusRequestBodySchema
>
export type UpdateVisaApplicationStatusResponse = z.infer<
  typeof UpdateVisaApplicationStatusResponseSchema
>
export type AddVisaApplicationNoteRequestBody = z.infer<
  typeof AddVisaApplicationNoteRequestBodySchema
>
export type AddVisaApplicationNoteResponse = z.infer<typeof AddVisaApplicationNoteResponseSchema>

// ==================== APIs ====================

export const visaApplicationsApi = {
  async getVisaApplications(query?: ListVisaApplicationsRequestQuery) {
    return httpGet<ListVisaApplicationsResponse>("/visa-applications", query)
  },
  async getVisaApplication(id: string) {
    return httpGet<GetVisaApplicationResponse>(`/visa-applications/${id}`)
  },
  async createVisaApplication(body: CreateVisaApplicationRequestBody) {
    return httpPost<CreateVisaApplicationResponse>("/visa-applications", body)
  },
  async updateVisaApplicationStatus(id: string, body: UpdateVisaApplicationStatusRequestBody) {
    return httpPatch<UpdateVisaApplicationStatusResponse>(`/visa-applications/${id}/status`, body)
  },
  async addVisaApplicationNote(id: string, body: AddVisaApplicationNoteRequestBody) {
    return httpPost<AddVisaApplicationNoteResponse>(`/visa-applications/${id}/notes`, body)
  },
  async deleteVisaApplication(id: string) {
    return httpDelete<DeleteVisaApplicationResponse>(`/visa-applications/${id}`)
  },
}
