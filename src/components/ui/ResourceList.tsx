import React from "react";
import { ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";

export type Resource = {
  id: string;
  section: string;
  title: string;
  description: string;
  url: string;
  type: string;
  tags: string[];
};

export function ResourceList({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return <p className="text-slate-500 text-sm">No resources available for this section yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {resources.map((resource) => (
        <a
          key={resource.id}
          href={resource.url}
          target={resource.type === "external" ? "_blank" : undefined}
          rel={resource.type === "external" ? "noopener noreferrer" : undefined}
          className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start gap-4 mb-4 sm:mb-0">
            <div className="mt-1 p-2 bg-slate-50 rounded-lg group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors text-slate-400">
              {resource.type === "external" ? <ExternalLink className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{resource.title}</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">{resource.description}</p>
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-amber-600 transition-colors sm:self-center">
            View Resource <ArrowUpRight className="ml-1 w-4 h-4" />
          </div>
        </a>
      ))}
    </div>
  );
}
