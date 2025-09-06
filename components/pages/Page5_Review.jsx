"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function Page5_Review({ formMethods }) {
  const { watch, control, formState } = formMethods;
  const data = watch();

  // Helper to format phone numbers and arrays
  const formatValue = (val) => {
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object" && val !== null) return JSON.stringify(val, null, 2);
    return val ?? "";
  };

  return (
    <div className="space-y-6 w-full max-w-xl">
      <h2 className="text-xl font-bold mb-2">Review Your Information</h2>
      <div className="space-y-2">
        {/* Personal Info */}
        <div className="border-b pb-2 mb-2">
          <h3 className="font-semibold">Personal Info</h3>
          <div>Full Name: <span className="font-mono">{data.fullName}</span></div>
          <div>Email: <span className="font-mono">{data.email}</span></div>
          <div>Phone: <span className="font-mono">{data.phone}</span></div>
          <div>Date of Birth: <span className="font-mono">{data.dob}</span></div>
          {data.profilePic && data.profilePic[0] && (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(data.profilePic[0])}
                alt="Profile"
                width={80}
                height={80}
                className="rounded object-cover"
              />
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="border-b pb-2 mb-2">
          <h3 className="font-semibold">Job Details</h3>
          <div>Department: <span className="font-mono">{data.department}</span></div>
          <div>Position: <span className="font-mono">{data.position}</span></div>
          <div>Start Date: <span className="font-mono">{data.startDate}</span></div>
          <div>Job Type: <span className="font-mono">{data.jobType}</span></div>
          <div>
            {data.jobType === "Contract"
              ? <>Hourly Rate: <span className="font-mono">{data.salary}</span></>
              : <>Annual Salary: <span className="font-mono">{data.salary}</span></>
            }
          </div>
          <div>Manager: <span className="font-mono">{data.manager}</span></div>
        </div>

        {/* Skills */}
        <div className="border-b pb-2 mb-2">
          <h3 className="font-semibold">Skills</h3>
          <div>Primary Skills: <span className="font-mono">{formatValue(data.primarySkills)}</span></div>
          <div>
            <div>Experience:</div>
            <ul className="ml-4 list-disc">
              {data.primarySkills?.map((skill) => (
                <li key={skill}>
                  {skill}: {data.skillsExperience?.[skill] ?? "0"} years
                </li>
              ))}
            </ul>
          </div>
          <div>
            Preferred Working Hours:{" "}
            <span className="font-mono">
              {data.preferredStartTime} - {data.preferredEndTime}
            </span>
          </div>
          <div>
            Remote Preference: <span className="font-mono">{data.remotePreference}%</span>
            {data.remotePreference > 50 && (
              <span className="ml-2">
                {data.managerApproved ? "✅ Manager Approved" : "❌ Not Approved"}
              </span>
            )}
          </div>
          <div>
            Extra Notes: <span className="font-mono">{data.extraNotes}</span>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-b pb-2 mb-2">
          <h3 className="font-semibold">Emergency Contact</h3>
          <div>Contact Name: <span className="font-mono">{data.contactName}</span></div>
          <div>Relationship: <span className="font-mono">{data.relationship}</span></div>
          <div>Phone Number: <span className="font-mono">{data.emergencyPhone}</span></div>
          {data.guardianName && (
            <>
              <div>Guardian Name: <span className="font-mono">{data.guardianName}</span></div>
              <div>Guardian Phone: <span className="font-mono">{data.guardianPhone}</span></div>
            </>
          )}
        </div>
      </div>

      {/* Confirm Checkbox */}
      <FormField
        control={control}
        name="confirm"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                checked={field.value || false}
                disabled={formState.isSubmitting}
                onCheckedChange={field.onChange}
              />
              <FormLabel>I confirm all information is correct</FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      </div>
  );
}