import React from "react";

interface FeatureErrorStateProps {
  message: string;
}

export function FeatureErrorState({ message }: FeatureErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="font-semibold text-red-900">Couldn’t load resources</h3>
      <p className="mt-2 text-sm text-red-700">{message}</p>
    </div>
  );
}
