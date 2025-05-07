"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import { TextField, PasswordField } from "../components/AuthFormFields";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/\d/, "Password must include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ResetPassword = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");
  const [validCode, setValidCode] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (mode !== "resetPassword" || !oobCode) {
      toast.error("Invalid or expired password reset link");
      router.push("/login");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then(() => setValidCode(true))
      .catch(() => {
        toast.error("Invalid or expired reset code.");
        router.push("/login");
      });
  }, [oobCode, mode, router]);

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    if (!oobCode) return;
    try {
      await confirmPasswordReset(auth, oobCode, values.password);
      toast.success("Password has been reset!");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  if (!validCode) return null;

  return (
    <Suspense>
      <section className="max-w-md mx-auto mt-20">
        <h2 className="text-center text-lg font-bold mb-6">Reset Password</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-4"
          >
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

            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="w-full py-6 bg-[#50C2C9] text-lg font-semibold hover:bg-[#50c3c9ba]"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </section>
    </Suspense>
  );
};

export default ResetPassword;
