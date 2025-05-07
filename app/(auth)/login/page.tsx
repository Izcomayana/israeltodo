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
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(/\d/, { message: "Password must contain at least one number." }),
});

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise((r) => setTimeout(r, 1000));
    form.reset();
    toast("Login Successfully");
    router.push("/dashboard");
  }

  return (
    <section>
      <div className="text-center mt-20 mx-auto max-w-2xs">
        <h2 className="font-bold text-lg">Welcome back</h2>
      </div>

      <div className="my-10 w-fit mx-auto">
        <Image src={"/login.png"} width={200} height={300} alt={"login"} />
      </div>

      <div className="mx-auto max-w-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mx-4"
          >
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

            <div className="my-5 mx-auto w-fit">
              <Link href="/forgotpassword">
              <p className="text-[#50C2C9]">Forgot password?</p>
              </Link>
              
            </div>

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
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mb-20 mx-auto w-fit">
          <p className="text-base">
            Don’t have an account ?{" "}
            <span className="text-[#50C2C9]">
              <Link href="/register">Sign Up</Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
