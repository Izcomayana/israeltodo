"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export const AuthInput = ({
  form,
  name,
  placeholder,
  type = "text",
  showToggle = false,
  showValue,
  toggleShow,
}: {
  form: any;
  name: string;
  placeholder: string;
  type?: string;
  showToggle?: boolean;
  showValue?: boolean;
  toggleShow?: () => void;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <div className="relative">
            <Input
              type={showToggle ? (showValue ? "text" : "password") : type}
              placeholder={placeholder}
              {...field}
              className="border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-md pl-5 py-6 text-sm font-normal rounded-4xl bg-white pr-10"
            />
            {showToggle && toggleShow && (
              <button
                type="button"
                onClick={toggleShow}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
