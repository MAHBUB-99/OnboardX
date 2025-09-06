"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Success({ onRestart }) {
  return (
    <div className="border border-gray-300 rounded-xl p-8 w-full max-w-3xl mx-auto text-center flex flex-col items-center space-y-6 bg-white shadow-md">
      <CheckCircle2 className="text-green-600 w-16 h-16" />

      <h1 className="text-2xl font-bold text-gray-800">Success!</h1>

      <p className="text-gray-600">
        Your onboarding form has been submitted successfully. 🎉
      </p>

      {onRestart && (
        <Button onClick={onRestart} variant="outline">
          Fill Another Form
        </Button>
      )}
    </div>
  );
}
