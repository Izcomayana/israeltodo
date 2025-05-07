"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const forgotSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

const ForgotPassword = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast("Password reset link sent");
    form.reset();
    router.push("/reset-password");
  };

  return (
    <section className="max-w-md mx-auto mt-20">
      <h2 className="text-center text-lg font-bold mb-6">Forgot Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                    className="py-6 px-5 rounded-4xl shadow-md focus:ring-2 focus:ring-sky-500"
                  />
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
            {form.formState.isSubmitting ? (
              <span>Sending...</span>
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
