"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

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
    await new Promise((r) => setTimeout(r, 1000));
    form.reset();
    toast("Registered Successfully")
    router.push("/dashboard");
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
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-md pl-5 py-6 text-sm font-normal rounded-4xl bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-md pl-5 py-6 text-sm font-normal rounded-4xl bg-white"
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
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-md pl-5 py-6 text-sm font-normal rounded-4xl bg-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        className="border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-md pl-5 py-6 text-sm font-normal rounded-4xl bg-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center mx-auto max-w-md mt-10 mb-5">
              <Button
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
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