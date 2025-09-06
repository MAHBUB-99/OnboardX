"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";
import { getAge } from "@/lib/utils";

const relationships = [
  "Parent",
  "Sibling",
  "Spouse",
  "Friend",
  "Other",
];

export default function Page4_Emergency_Contact({ formMethods }) {
  const { watch, formState, control } = formMethods;
  const dob = watch("dob");
  const age = useMemo(() => getAge(dob), [dob]);
  const isSubmitting = formState.isSubmitting;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name</FormLabel>
            <FormControl>
              <Input
                className="w-[450px]"
                disabled={isSubmitting}
                placeholder="Enter contact name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="relationship"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relationship</FormLabel>
            <FormControl>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <SelectTrigger className="w-[450px]">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="emergencyPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
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

      {age !== null && age < 21 && (
        <>
          <h3 className="font-semibold mt-4">Guardian Contact</h3>
          <FormField
            control={control}
            name="guardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-[450px]"
                    disabled={isSubmitting}
                    placeholder="Enter guardian name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="guardianPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Phone</FormLabel>
                <FormControl>
                  <Input
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
        </>
      )}
    </div>
  )
}