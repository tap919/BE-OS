import React, { useEffect, useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { SectionHeader } from "@/src/components/ui/LayoutBlocks";
import { ResourceList, type Resource } from "@/src/components/ui/ResourceList";
import { AICoach } from "@/src/components/ui/AICoach";

export default function WealthCapital() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, getToken } = useAuth();

  useEffect(() => {
    const loadResources = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const token = await getToken();
        const res = await fetch("/api/capital/resources", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadResources();
  }, [user]);

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10">
      <SectionHeader 
        title="Wealth & Capital Access Center" 
        description="Connect with funding opportunities, Black-owned banks, CDFIs, and venture capital designed to close the wealth gap." 
      />

      <section>
        <AICoach 
          title="Opportunity Matcher (AI)"
          description="Automated fund matching based on your profile for grants, VC, and loan programs."
          context="matching individuals and businesses with capital, grants, loans, and venture networks"
          placeholder="I run a minority-owned tech startup in Atlanta. What grants should I look for?"
        />
      </section>

      <section>
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Core Modules & Guides</h2>
            <p className="text-sm text-slate-500 mt-1">Tools to find money and access trusted institutions.</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-2 bg-slate-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <ResourceList resources={resources} />
        )}
      </section>
    </div>
  );
}
