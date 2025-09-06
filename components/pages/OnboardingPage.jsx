"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fullSchema } from "../../lib/schemas";

import Page1_Personal_info from "./Page1_Personal_Info";
import Page2_Job_Details from "./Page2_Job_Details";
import Page3_Skills from "./Page3_Skills";
import Page4_Emergency_Contact from "./Page4_Emergency_Contact";
import Page5_Review from "./Page5_Review";
import Success from "./Sucess";
/**
 * Mapping of form steps to their corresponding field names.
 * Each step validates only its relevant fields.
 */
const STEP_FIELDS = {
  1: ["fullName", "email", "phone", "dob", "profilePic"],
  2: ["department", "position", "startDate", "jobType", "salary", "manager"],
  3: [
    "primarySkills",
    "skillsExperience",
    "preferredStartTime",
    "preferredEndTime",
    "remotePreference",
  ],
  4: [
    "contactName",
    "relationship",
    "emergencyPhone",
    "guardianName",
    "guardianPhone",
  ],
  5: ["confirm"],
};
/**
 * OnboardingPage Component
 * ------------------------
 * A multi-step onboarding form built with React Hook Form, Zod validation,
 * and modular step components.
 *
 * Features:
 * - Step-by-step form navigation with validation at each stage
 * - Draft saving in local state while user progresses
 * - Confirmation guard when attempting to leave with unsaved changes
 * - File upload (profile picture)
 * - Final data submission to API as FormData
 */
export default function OnboardingPage() {
  // Initialize React Hook Form with Zod validation and default values
  const formMethods = useForm({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      profilePic: null,
      department: "",
      position: "",
      startDate: "",
      jobType: "Full-time",
      salary: null,
      manager: "",
      primarySkills: [],
      skillsExperience: {},
      preferredStartTime: "",
      preferredEndTime: "",
      remotePreference: 0,
      extraNotes: "",
      contactName: "",
      relationship: "",
      emergencyPhone: "",
      guardianName: "",
      guardianPhone: "",
      confirm: false,
    },
  });

  const [submitted, setSubmitted] = useState(false);

  const { handleSubmit, trigger, watch, getValues, formState, reset } =
    formMethods;
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(formMethods.getValues());
  /**
   * Watch form values to keep draft state updated.
   */
  useEffect(() => {
    const subscription = watch((value) => {
      setDraft(value);
    });
    return () => {
      if (subscription && subscription.unsubscribe) subscription.unsubscribe();
    };
  }, [watch]);
  /**
   * Add beforeunload listener to warn user about unsaved changes.
   */
  useEffect(() => {
    const handler = (e) => {
      if (formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formState.isDirty]);
  /**
   * Proceed to next step if current step’s fields are valid.
   */
  const next = async () => {
    const fields = STEP_FIELDS[step] || [];
    const ok = await trigger(fields);
    console.log(ok);
    if (ok) setStep((s) => Math.min(5, s + 1));
  };
  /**
   * Go back to the previous step.
   */
  const prev = () => {
    setStep((s) => Math.max(1, s - 1));
  };
  /**
   * Handle final form submission:
   * - Transform salary field into either hourlyRate or annualSalary
   * - Build FormData payload (supports file upload)
   * - POST data to /api endpoint
   */
  const onSubmit = async (data) => {
    const out = { ...data };
    if (out.jobType === "Contract") {
      out.hourlyRate = out.salary;
      delete out.salary;
    } else {
      out.annualSalary = out.salary;
      delete out.salary;
    }

    const fd = new FormData();
    for (const key of Object.keys(out)) {
      if (key === "profilePic" && out.profilePic && out.profilePic[0]) {
        fd.append("profilePic", out.profilePic[0]);
      } else {
        fd.append(
          key,
          typeof out[key] === "object"
            ? JSON.stringify(out[key])
            : String(out[key] ?? "")
        );
      }
    }

    try {
      const res = await fetch("/api", { method: "POST", body: fd });
      const json = await res.json();
      console.log("Submit response:", json);

      // Show success page
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed", err);
      alert("Submit failed (check console)");
    }
  };

  const { isSubmitting, isValid } = formMethods.formState;

  return (
    <Form {...formMethods}>
      <div className="border border-gray-300 rounded-xl p-8 w-full max-w-3xl mx-auto">
        {submitted ? (
          <Success
            onRestart={() => {
              setSubmitted(false);
              setStep(1);
              reset(); // reset form values
            }}
          />
        ) : (
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-8 my-2 flex flex-col items-center"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`
                px-5 py-2 rounded-full font-bold transition-colors
                ${
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground"
                }
              `}
                >
                  Step {i}
                </div>
              ))}
            </div>
            <div>
              {step === 1 && <Page1_Personal_info formMethods={formMethods} />}
              {step === 2 && <Page2_Job_Details formMethods={formMethods} />}
              {step === 3 && <Page3_Skills formMethods={formMethods} />}
              {step === 4 && (
                <Page4_Emergency_Contact formMethods={formMethods} />
              )}
              {step === 5 && <Page5_Review formMethods={formMethods} />}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 w-full max-w-md mt-6">
              <Button
                type="button"
                disabled={step === 1}
                onClick={prev}
                variant="outline"
              >
                Back
              </Button>

              {step < 5 ? (
                <Button type="button" onClick={next} variant="outline">
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={formState.isSubmitting || !formState.isValid}
                  variant="outline"
                >
                  Submit
                </Button>
              )}
            </div>

            {/* small debug: draft preview (remove in production) */}
            {/* <details className="mt-4 text-xs text-gray-600">
          <summary className="cursor-pointer">Draft preview (debug)</summary>
          <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded mt-2">
            {JSON.stringify(draft, null, 2)}
          </pre>
        </details> */}
          </form>
        )}
      </div>
    </Form>
  );
}
