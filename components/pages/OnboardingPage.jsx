"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fullSchema } from "../../lib/schemas";
import Page1_Personal_info from "./Page1_Personal_info";

import { Form } from "@/components/ui/form";

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

export default function OnboardingPage() {
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

  const { handleSubmit, trigger, watch, getValues, formState, reset } =
    formMethods;
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(formMethods.getValues());

  // autosave into component state (draft)
  useEffect(() => {
    const subscription = watch((value) => {
      setDraft(value);
    });
    return () => {
      if (subscription && subscription.unsubscribe) subscription.unsubscribe();
    };
  }, [watch]);

  // Prevent tab close if dirty
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

  const next = async () => {
    const fields = STEP_FIELDS[step] || [];
    const ok = await trigger(fields);
    if (ok) setStep((s) => Math.min(5, s + 1));
  };

  const prev = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = async (data) => {
    // transform salary field
    const out = { ...data };
    if (out.jobType === "Contract") {
      out.hourlyRate = out.salary;
      delete out.salary;
    } else {
      out.annualSalary = out.salary;
      delete out.salary;
    }

    // build FormData for file upload
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
      const res = await fetch("/api/submit", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      console.log("Submit response:", json);
      alert("Form submitted — check console for response");
      reset(); // clear form
      setStep(1);
    } catch (err) {
      console.error("Submit failed", err);
      alert("Submit failed (check console)");
    }
  };

  const { isSubmitting, isValid } = formMethods.formState;

  return (
    <Form {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="space-y-8 my-4 flex flex-col items-center"
      >
        <div>
          {step === 1 && <Page1_Personal_info formMethods={formMethods} />}
          {/* {step === 2 && <Step2Job />}
          {step === 3 && <Step3Skills />}
          {step === 4 && <Step4Emergency />}
          {step === 5 && <Step5Review />} */}
        </div>


         {/* Navigation Buttons */}
        <div className="flex justify-between w-full mt-6">
          
            <Button type="button" disabled= {step === 1} onClick={prev} variant="outline">
              Back
            </Button>

          {step < 5 ? (
            <Button type="button" onClick={next} variant="outline">
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={formState.isSubmitting || !formState.isValid} variant="outline">
              Submit
            </Button>
          )}
        </div>

        {/* small debug: draft preview (remove in production) */}
        <details className="mt-4 text-xs text-gray-600">
          <summary className="cursor-pointer">Draft preview (debug)</summary>
          <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded mt-2">
            {JSON.stringify(draft, null, 2)}
          </pre>
        </details>
      </form>
    </Form>
  );
}
