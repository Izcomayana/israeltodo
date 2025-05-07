"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AuthFormWrapper = ({
  form,
  onSubmit,
  children,
  buttonLabel,
}: {
  form: any;
  onSubmit: (values: any) => void;
  children: React.ReactNode;
  buttonLabel: string;
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-4">
      {children}
      <div className="flex justify-center mx-auto max-w-md mt-10 mb-5">
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="py-6 bg-[#50C2C9] w-full text-lg font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#50c3c9ba]"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            buttonLabel
          )}
        </Button>
      </div>
    </form>
  </Form>
);
