"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

interface SharedFieldProps<T extends FieldValues> {
  name: Path<T>;
  placeholder: string;
  control: Control<T>;
}

interface PasswordFieldProps<T extends FieldValues>
  extends SharedFieldProps<T> {
  show: boolean;
  toggle: () => void;
}

interface TextFieldProps<T extends FieldValues> extends SharedFieldProps<T> {
  type?: string;
}

const inputBaseClasses =
  "border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-md pl-5 py-6 text-sm font-normal rounded-4xl bg-white";

export const PasswordField = <T extends FieldValues>({
  name,
  placeholder,
  control,
  show,
  toggle,
}: PasswordFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <div className="relative">
            <Input
              id={name}
              type={show ? "text" : "password"}
              placeholder={placeholder}
              aria-label={placeholder}
              aria-describedby={`${name}-error`}
              className={`${inputBaseClasses} pr-10`}
              {...field}
            />
            <button
              type="button"
              onClick={toggle}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormControl>
        <FormMessage id={`${name}-error`} />
      </FormItem>
    )}
  />
);

export const TextField = <T extends FieldValues>({
  name,
  placeholder,
  control,
  type = "text",
}: TextFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby={`${name}-error`}
            className={inputBaseClasses}
            {...field}
          />
        </FormControl>
        <FormMessage id={`${name}-error`} />
      </FormItem>
    )}
  />
);
