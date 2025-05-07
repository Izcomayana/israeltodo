"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { registerWithEmail } from "@/lib/auth";
import { TextField, PasswordField } from "../components/AuthFormFields";

const formSchema = z
  .object({
    fullname: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .regex(/\d/, { message: "Password must contain at least one number." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await registerWithEmail({
        email: values.email,
        password: values.password,
        fullname: values.fullname,
      });

      toast.success("Registered Successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    }
  }

  return (
    <section>
      <div className="text-center my-20 mx-auto max-w-2xs">
        <h2 className="font-bold text-lg">Welcome Onboard!</h2>
        <p className="my-5">Let’s help to meet up your tasks.</p>
      </div>

      <div className="mx-auto max-w-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mx-4"
          >
            <TextField
              control={form.control}
              name="fullname"
              placeholder="Enter your full name"
            />

            <TextField
              control={form.control}
              name="email"
              placeholder="Enter your email"
              type="email"
            />

            <PasswordField
              control={form.control}
              name="password"
              placeholder="Enter your password"
              show={showPassword}
              toggle={() => setShowPassword((prev) => !prev)}
            />

            <PasswordField
              control={form.control}
              name="confirmPassword"
              placeholder="Confirm your password"
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword((prev) => !prev)}
            />

            <div className="flex justify-center mx-auto max-w-md mt-10 mb-5">
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="py-6 bg-[#50C2C9] w-full text-lg font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#50c3c9ba]"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mb-20 mx-auto w-fit">
          <p className="text-base">
            Already have an account?{" "}
            <span className="text-[#50C2C9]">
              <Link href="/login">Sign In</Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
