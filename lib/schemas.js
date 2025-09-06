// lib/schemas.js
import { z } from "zod";
import { getAge, isValidWorkTime } from "./utils";

// Regex for phone numbers like +1-123-456-7890
const phoneRegex = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/;

export const fullSchema = z
  .object({
    // Step 1 - Personal
    fullName: z
      .string()
      .min(1, "Full name required")
      .refine((val) => val.trim().split(/\s+/).length >= 2, {
        message: "Enter at least first and last name",
      }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(phoneRegex, {
      message: "Format: +1-123-456-7890",
    }),
    dob: z.string().refine((val) => getAge(val) >= 18, {
      message: "Must be at least 18 years old",
    }),
    profilePic: z
      .any()
      .optional()
      .refine(
        (fileList) => {
          if (!fileList) return true;
          const f = fileList[0];
          if (!f) return true;
          const okType = ["image/jpeg", "image/png"].includes(f.type);
          const okSize = f.size <= 2 * 1024 * 1024;
          return okType && okSize;
        },
        { message: "Only JPG/PNG up to 2MB" }
      ),

    // Step 2 - Job
    department: z.string().min(1, "Select a department"),
    position: z.string().min(3, "Position must be at least 3 characters"),
    startDate: z.string().refine((val) => {
      const d = new Date(val);
      const today = new Date();
      if (d < new Date(today.toDateString())) return false; // no past dates
      const max = new Date();
      max.setDate(max.getDate() + 90); // max 90 days
      return d <= max;
    }, "Start date must be within 90 days and not in the past"),
    jobType: z.enum(["Full-time", "Part-time", "Contract"]),
salary: z
  .preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null; // empty input
    return Number(val); // convert string to number
  }, z.number().nullable())
  .refine((val, ctx) => {
    const jobType = ctx?.parent?.jobType;
    if (val === null || val === undefined) return true; // optional
    if (jobType === "Full-time") return val >= 30000 && val <= 200000;
    if (jobType === "Contract") return val >= 50 && val <= 150;
    return true;
  }, (val, ctx) => {
    const jobType = ctx?.parent?.jobType;
    if (jobType === "Full-time")
      return { message: "Full-time salary must be between $30,000 and $200,000" };
    if (jobType === "Contract")
      return { message: "Contract hourly rate must be between $50 and $150" };
    return { message: "Input salary in valid range" };
  }),


    manager: z.string().optional(),

    // Step 3 - Skills
    primarySkills: z.array(z.string()).min(3, "Pick at least 3 skills"),
    skillsExperience: z.record(z.string(), z.number().min(0)),
    preferredStartTime: z.string().optional(),
    preferredEndTime: z.string().optional(),
    remotePreference: z.number().min(0).max(100).optional(),
    extraNotes: z.string().max(500).optional(),

    // Step 4 - Emergency
    contactName: z.string().min(1, "Required"),
    relationship: z.string().min(1, "Required"),
    emergencyPhone: z.string().regex(phoneRegex, "Invalid phone"),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),

    // Step 5
    confirm: z
      .boolean()
      .refine((val) => val === true, { message: "Must confirm details" }),
  })
  .superRefine((data, ctx) => {
    // Salary rules
    if (data.jobType === "Contract") {
      if (
        typeof data.salary !== "number" ||
        data.salary < 50 ||
        data.salary > 150
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["salary"],
          message: "Contract hourly rate $50–$150",
        });
      }
    }
    if (data.jobType === "Full-time") {
      if (
        typeof data.salary !== "number" ||
        data.salary < 30000 ||
        data.salary > 200000
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["salary"],
          message: "Full-time salary $30k–$200k",
        });
      }
    }

    // Start date not Fri/Sat for HR/Finance
    if (["HR", "Finance"].includes(data.department)) {
      if (data.startDate) {
        const d = new Date(data.startDate);
        const day = d.getDay(); // 0=Sun ... 6=Sat
        if (day === 5 || day === 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["startDate"],
            message: "HR/Finance cannot start on Friday or Saturday",
          });
        }
      }
    }

    // Guardian if <21
    if (data.dob && getAge(data.dob) < 21) {
      if (!data.guardianName || !data.guardianPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardianName"],
          message: "Guardian required if under 21",
        });
      }
    }

    // Work hours valid if provided
    if (data.preferredStartTime && data.preferredEndTime) {
      if (!isValidWorkTime(data.preferredStartTime, data.preferredEndTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["preferredEndTime"],
          message: "Work hours must be within 6AM–10PM and start < end",
        });
      }
    }
  });
