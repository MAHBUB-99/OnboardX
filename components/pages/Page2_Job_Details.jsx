"use client";
import { Button } from "@/components/ui/button";
import { mockManagers } from "@/lib/data";
import { useMemo } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Page2_Job_Details({ formMethods }) {
  const { isSubmitting, isValid } = formMethods.formState;
  /**
   * Watch fields to reactively update UI
   */
  const { watch } = formMethods;
  const department = watch("department") || "";
  const jobType = watch("jobType") || "";
  /**
   * Extract unique list of departments from mockManagers
   */
  const departments = useMemo(() => {
    const deptSet = new Set();
    mockManagers.forEach((m) => deptSet.add(m.department));
    return Array.from(deptSet);
  }, []);
  /**
   * Filter managers based on currently selected department
   */
  const managersForDept = useMemo(() => {
    if (!department) return [];
    return mockManagers.filter((m) => m.department === department);
  }, [department]);

  return (
    <div className="space-y-4">
      <FormField
        control={formMethods.control}
        name="department"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <FormLabel>Department</FormLabel>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[450px] justify-between"
                  disabled={isSubmitting}
                >
                  {field.value ? field.value : "Select a department"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[450px]">
                <DropdownMenuItem
                  onSelect={() => field.onChange("Engineering")}
                >
                  Engineering
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => field.onChange("Marketing")}>
                  Marketing
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => field.onChange("Sales")}>
                  Sales
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => field.onChange("HR")}>
                  Human Resources
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => field.onChange("Finance")}>
                  Finance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formMethods.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position Title</FormLabel>
            <FormControl>
              <Input
                className="w-[450px]"
                disabled={isSubmitting}
                placeholder="e.g. Software Engineer"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formMethods.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
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
        name="jobType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Full-time"
                    id="full-time"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="full-time">Full-time</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Part-time"
                    id="part-time"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="part-time">Part-time</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Contract"
                    id="contract"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="contract">Contract</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formMethods.control}
        name="salary"
        render={({ field }) => {
          const jobType = watch("jobType");
          const placeholder =
            jobType === "Full-time"
              ? "Enter annual salary ($30,000 - $200,000)"
              : jobType === "Contract"
              ? "Enter hourly rate ($50 - $150)"
              : "Enter expected salary";

          return (
            <FormItem>
              <FormLabel>Salary Expectation</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-[450px]"
                  disabled={isSubmitting}
                  placeholder={placeholder}
                  min={0}
                  step="1000"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {department && (
        <FormField
          control={formMethods.control}
          name="manager"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Manager</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[450px] justify-between"
                      disabled={isSubmitting || managersForDept.length === 0}
                    >
                      {field.value ? field.value : "Select a manager"}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-[450px]">
                    {managersForDept.length === 0 ? (
                      <DropdownMenuItem disabled>
                        No manager found
                      </DropdownMenuItem>
                    ) : (
                      managersForDept.map((m) => (
                        <DropdownMenuItem
                          key={m.id}
                          onSelect={() => field.onChange(m.name)}
                        >
                          {m.name}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
