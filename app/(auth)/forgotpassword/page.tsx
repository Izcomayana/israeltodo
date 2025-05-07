"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { TextField } from "../components/AuthFormFields";

const forgotSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast.success(
        "If your email exists, a reset link was sent. kindly check your mail and close this tab",
      );
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <section className="max-w-md mx-auto mt-20">
      <h2 className="text-center text-lg font-bold mb-6">Forgot Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          <TextField
            control={form.control}
            name="email"
            placeholder="Enter your email"
            type="email"
          />

          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full py-6 bg-[#50C2C9] text-lg font-semibold cursor-pointer hover:bg-[#50c3c9ba]"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default ForgotPassword;
