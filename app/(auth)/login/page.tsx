"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TextField, PasswordField } from "../components/AuthFormFields";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .regex(/\d/, "Password must contain at least one number."),
});

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const token = await userCredential.user.getIdToken();
      document.cookie = `__session=${token}; path=/`;

      toast.success("Login Successful");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error); // <-- Debug output

      const errorMessages: Record<string, string> = {
        "auth/user-not-found": "No user found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-email": "Email format is invalid.",
        "auth/user-disabled": "User account has been disabled.",
        "auth/too-many-requests":
          "Too many login attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Check your connection.",
      };

      const code = error?.code;
      const message =
        errorMessages[code] || `Login failed. (${code ?? "Unknown error"})`;
      toast.error(message);
    }
  };

  return (
    <section>
      <div className="text-center mt-20 mx-auto max-w-2xs">
        <h2 className="font-bold text-lg">Welcome back</h2>
      </div>

      <div className="my-10 w-fit mx-auto">
        <Image src="/login.png" width={200} height={300} alt="login" />
      </div>

      <div className="mx-auto max-w-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mx-4"
          >
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
                className="py-6 bg-[#50C2C9] w-full text-lg font-semibold cursor-pointer disabled:opacity-60 hover:bg-[#50c3c9ba]"
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
            Don’t have an account?{" "}
            <span className="text-[#50C2C9]">
              <Link href="/register">Sign Up</Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
