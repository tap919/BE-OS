import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wrench } from "lucide-react";

export default function ToolView() {
  const { toolId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 fade-in animate-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to previous page
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center sm:p-16">
        <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4 capitalize">
          {toolId?.replace("-", " ")} Tool
        </h1>
        <p className="text-lg text-slate-600 max-w-lg mx-auto">
          This digital empowerment tool is currently locked or under active development. Keep securing your foundation in the vault to unlock advanced modules.
        </p>
      </div>
    </div>
  );
}
