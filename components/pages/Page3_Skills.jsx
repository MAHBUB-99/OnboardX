"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";
import { skillsByDepartment } from "../../lib/data"; // Adjust path if needed

export default function Page3_Skills({ formMethods }) {
  const { control, watch, formState } = formMethods;
  const isSubmitting = formState.isSubmitting;
  const department = watch("department") || "";
  const selectedSkills = watch("primarySkills") || [];
  const remotePreference = watch("remotePreference") ?? 0;
  const managerApproved = watch("managerApproved") ?? false;
  const extraNotes = watch("extraNotes") || "";

  // Get skills for selected department
  const skillsList = useMemo(() => {
    if (department && skillsByDepartment[department]) {
      return skillsByDepartment[department];
    }
    // fallback: show all skills if department not selected
    return Object.values(skillsByDepartment).flat();
  }, [department]);

  // Helper for skill selection
  const handleSkillChange = (skill, checked, onChange) => {
    let updated = Array.isArray(selectedSkills) ? [...selectedSkills] : [];
    if (checked) {
      if (!updated.includes(skill)) updated.push(skill);
    } else {
      updated = updated.filter((s) => s !== skill);
    }
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="primarySkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Skills (choose at least 3)</FormLabel>
            <div className="grid grid-cols-2 gap-2 w-[450px]">
              {skillsList.map((skill) => (
                <label key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value?.includes(skill) || false}
                    disabled={isSubmitting}
                    onCheckedChange={(checked) =>
                      handleSkillChange(skill, checked, field.onChange)
                    }
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
            {field.value?.length < 3 && (
              <div className="text-xs text-red-500 mt-1">
                Please select at least 3 skills.
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Experience for each selected skill */}
      {selectedSkills.length > 0 && (
        <div className="space-y-2">
          <FormLabel>Experience for Each Skill (years)</FormLabel>
          {selectedSkills.map((skill) => (
            <FormField
              key={skill}
              control={control}
              name={`skillsExperience.${skill}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{skill}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      step={0.5}
                      className="w-[200px]"
                      disabled={isSubmitting}
                      placeholder="Years of experience"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      )}

      {/* Preferred Working Hours */}
      <div className="flex gap-5 items-end">
        <FormField
          control={control}
          name="preferredStartTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Start Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="w-[150px]"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="mb-2">to</span>
        <FormField
          control={control}
          name="preferredEndTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred End Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="w-[150px]"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Remote Work Preference */}
      <FormField
        control={control}
        name="remotePreference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Remote Work Preference</FormLabel>
            <div className="flex items-center gap-4 w-[450px]">
              <Slider
                min={0}
                max={100}
                step={1}
                value={[field.value ?? 0]}
                onValueChange={(val) => field.onChange(val[0])}
                disabled={isSubmitting}
                className="w-[300px]"
              />
              <span>{field.value ?? 0}%</span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Manager Approved checkbox if remotePreference > 50 */}
      {remotePreference > 50 && (
        <FormField
          control={control}
          name="managerApproved"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  checked={field.value || false}
                  disabled={isSubmitting}
                  onCheckedChange={field.onChange}
                />
                <FormLabel>Manager Approved</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Extra Notes */}
      <FormField
        control={control}
        name="extraNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Extra Notes (optional, max 500 chars)</FormLabel>
            <FormControl>
              <Textarea
                className="w-[450px]"
                disabled={isSubmitting}
                maxLength={500}
                placeholder="Any additional notes..."
                {...field}
              />
            </FormControl>
            <div className="text-xs text-gray-500 mt-1">
              {extraNotes.length}/500 characters
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      </div>
  );
}