"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/feature/shared/date-picker"
import { toast } from "sonner"
import {
  visaApplicationsApi,
  CreateVisaApplicationRequestBodySchema,
  CreateVisaApplicationRequestBody,
} from "@/lib/api"
import { useRouter } from "next/navigation"
import { AppTopbar } from "@/components/layout/app-topbar"
import { AppContent } from "@/components/layout/app-content"

const formSchema = CreateVisaApplicationRequestBodySchema.extend({
  applicantName: z.string().min(2, "Applicant name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  nationality: z.string().min(2, "Nationality is required"),
  destinationCountry: z.string().min(2, "Destination country is required"),
  visaType: z.string().min(2, "Visa type is required"),
  travelDate: z.date({ required_error: "Travel date is required" }),
})

type FormDataValues = z.infer<typeof formSchema>

export default function NewVisaApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormDataValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantName: "",
      email: "",
      nationality: "",
      destinationCountry: "",
      visaType: "",
      travelDate: undefined,
    },
  })

  const onSubmit = async (values: FormDataValues) => {
    try {
      setLoading(true)

      // Convert Date to string for API
      const submitData = {
        ...values,
        travelDate: values.travelDate.toISOString().split("T")[0],
      } as CreateVisaApplicationRequestBody

      const { error } = await visaApplicationsApi.createVisaApplication(submitData)

      if (error) {
        toast.error(`Failed to create application: ${error}`)
      } else {
        toast.success("Visa application created successfully!")
        router.push("/")
      }
    } catch {
      toast.error("Failed to create visa application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <AppTopbar
        title="New Visa Application"
        extraSlot={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        }
      />
      <AppContent>
        <Card>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel htmlFor="applicantName">Applicant Name</FieldLabel>
              <FieldContent>
                <Input
                  id="applicantName"
                  placeholder="John Doe"
                  {...form.register("applicantName")}
                />
                <FieldError
                  errors={
                    form.formState.errors.applicantName
                      ? [{ message: form.formState.errors.applicantName.message }]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...form.register("email")}
                />
                <FieldError
                  errors={
                    form.formState.errors.email
                      ? [{ message: form.formState.errors.email.message }]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
              <FieldContent>
                <Input
                  id="nationality"
                  placeholder="Vietnam"
                  {...form.register("nationality")}
                />
                <FieldError
                  errors={
                    form.formState.errors.nationality
                      ? [{ message: form.formState.errors.nationality.message }]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="destinationCountry">Destination Country</FieldLabel>
              <FieldContent>
                <Input
                  id="destinationCountry"
                  placeholder="United States"
                  {...form.register("destinationCountry")}
                />
                <FieldError
                  errors={
                    form.formState.errors.destinationCountry
                      ? [{ message: form.formState.errors.destinationCountry.message }]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="visaType">Visa Type</FieldLabel>
              <FieldContent>
                <Input
                  id="visaType"
                  placeholder="Tourist Visa"
                  {...form.register("visaType")}
                />
                <FieldError
                  errors={
                    form.formState.errors.visaType
                      ? [{ message: form.formState.errors.visaType.message }]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Travel Date</FieldLabel>
              <FieldContent>
                <DatePicker
                  value={form.watch("travelDate")}
                  onChange={(date) => {
                    form.setValue("travelDate", date as z.infer<typeof formSchema>["travelDate"], {
                      shouldValidate: true,
                    })
                  }}
                  className="w-full"
                />
                <FieldError
                  errors={
                    form.formState.errors.travelDate
                      ? [{ message: form.formState.errors.travelDate.message }]
                      : []
                  }
                />
              </FieldContent>
            </Field>
          </CardContent>
        </Card>
      </AppContent>
    </form>
  )
}
