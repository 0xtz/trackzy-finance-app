"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/client"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormSchema = z.infer<typeof formSchema>

// signin -> sign in to your account
export function SigninForm() {
  const [generalError, setGeneralError] = useState<string>("")

  // 1. Define your form.
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: FormSchema) {
    console.log(values)
    setGeneralError("") // Clear any previous general errors

    toast.promise(
      async () => {
        const { data, error } = await authClient.signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: "/app",
        })

        console.log("🚀 ~ onSubmit ~ error:", error)

        if (error) {
          if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
            // Set a general error instead of field-specific errors
            setGeneralError(
              "Invalid email or password. Please check your credentials and try again."
            )
            throw new Error("Invalid credentials")
          }

          throw error
        }

        return data
      },
      {
        loading: "Signing in...",
        success: "Signed in successfully",
        error: "Failed to sign in",
      }
    )
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {generalError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
            {generalError}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  placeholder="Email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  placeholder="Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>
    </Form>
  )
}
