import React from "react";
import { cn } from "@/src/lib/utils";
import { ChevronRight, PlusCircle, ArrowRight } from "lucide-react";

export function SectionHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{title}</h1>
        <p className="text-lg text-slate-500 max-w-3xl">{description}</p>
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
}

export function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {children}
    </div>
  );
}

export function Card({
  title,
  description,
  icon: Icon,
  onClick,
  isExternal,
}: {
  title: string;
  description?: string;
  icon?: any;
  onClick?: () => void;
  isExternal?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-amber-200",
      )}
    >
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-amber-50 transition-colors text-slate-900 group-hover:text-amber-600">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      
      <div className="mt-6 flex items-center justify-end text-xs font-bold text-amber-600 opacity-0 transition-opacity group-hover:opacity-100">
        {isExternal ? "Visit external resource" : "Explore module"}
        <ChevronRight className="ml-1 h-4 w-4" />
      </div>
    </div>
  );
}

export function StatusBadge({ status, label }: { status: "success" | "warning" | "error" | "info" | "neutral", label: string }) {
  const styles = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-slate-100 text-slate-800 border-slate-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
      {label}
    </span>
  );
}

export function SectionPanel({ title, children, action }: { title: string, children: React.ReactNode, action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex text-left items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors w-full group"
    >
      <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 group-hover:text-amber-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
      </div>
      <div className="self-center flex-shrink-0 text-slate-400 group-hover:text-amber-600">
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  icon: any;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-slate-200 border-dashed bg-slate-50 flex-1">
      <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-amber-500" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
