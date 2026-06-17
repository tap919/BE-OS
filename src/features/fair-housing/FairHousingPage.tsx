import React from "react";
import { SectionHeader } from "@/src/components/ui/LayoutBlocks";
import { AICoach } from "@/src/components/ui/AICoach";
import { useAuthedResources } from "../shared/hooks/useAuthedResources";
import { HousingQuickActions } from "./components/HousingQuickActions";
import { HousingRightsChecklist } from "./components/HousingRightsChecklist";
import { FeatureResourceSection } from "../shared/components/FeatureResourceSection";

export default function FairHousingPage() {
  const { resources, state, error } = useAuthedResources("housing");

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10">
      <SectionHeader
        title="Fair Housing & Homeownership Center"
        description="Tools to protect your rights as a renter, navigate the homebuying process, and combat systemic housing bias."
      />

      <HousingQuickActions />

      <section>
        <AICoach
          title="AI Housing Interpreter"
          description="Translate complex lease agreements, mortgages, and zoning laws into plain English."
          context="housing rights, rental leases, homeownership, and appraisal bias"
          placeholder="Can a landlord legally evict me without notice?"
        />
      </section>

      <HousingRightsChecklist />

      <FeatureResourceSection
        resources={resources}
        state={state}
        error={error}
        emptyTitle="No housing resources yet"
        emptyDescription="This area will show guides, tenant-rights explainers, homeownership tools, and advocacy links. Start with the AI interpreter or add starter resources for renters and first-time buyers."
      />
    </div>
  );
}
