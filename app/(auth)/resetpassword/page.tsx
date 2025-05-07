"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast("Password has been reset successfully");
    form.reset();
    router.push("/login");
  };

  return (
    <section className="max-w-md mx-auto mt-20">
      <h2 className="text-center text-lg font-bold mb-6">Reset Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="New password"
                      {...field}
                      className="py-6 px-5 pr-10 rounded-4xl shadow-md focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                      {...field}
                      className="py-6 px-5 pr-10 rounded-4xl shadow-md focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full py-6 bg-[#50C2C9] text-lg font-semibold hover:bg-[#50c3c9ba]"
          >
            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default ResetPassword;
