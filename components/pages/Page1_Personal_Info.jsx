"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Page1_Personal_Info({ formMethods }) {
  const { isSubmitting, isValid } = formMethods.formState;
  const { watch } = formMethods;
  const profilePic = watch("profilePic");

  return (
    <div className="space-y-4">
      <FormField
        control={formMethods.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                className="w-[450px]"
                disabled={isSubmitting}
                placeholder="Enter your Full Name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formMethods.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter your Email Adress</FormLabel>
            <FormControl>
              <Input
                type="email"
                className="w-[450px]"
                disabled={isSubmitting}
                placeholder="Enter Email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formMethods.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input
                type="phone"
                className="w-[450px]"
                disabled={isSubmitting}
                placeholder="+1-123-456-7890"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formMethods.control}
        name="dob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input
                type="date"
                className="w-[450px]"
                disabled={isSubmitting}
                placeholder=""
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formMethods.control}
        name="profilePic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Picture</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/png, image/jpeg"
                disabled={isSubmitting}
                className="w-[450px]"
                onChange={(e) => field.onChange(e.target.files)}
              />
            </FormControl>
            <FormMessage />
            {profilePic && profilePic[0] && (
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(profilePic[0])}
                  alt="preview"
                  width={100}
                  height={100}
                  className="h-24 rounded object-cover"
                />
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
