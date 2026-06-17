import React from "react";
import { SectionHeader } from "@/src/components/ui/LayoutBlocks";
import { AICoach } from "@/src/components/ui/AICoach";
import { useAuthedResources } from "../shared/hooks/useAuthedResources";
import { BusinessQuickActions } from "./components/BusinessQuickActions";
import { BusinessChecklist } from "./components/BusinessChecklist";
import { BusinessOpportunities } from "./components/BusinessOpportunities";
import { FeatureResourceSection } from "../shared/components/FeatureResourceSection";

export default function BusinessBuilderPage() {
  const { resources, state, error } = useAuthedResources("business");

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10">
      <SectionHeader
        title="Business Builder & Entrepreneurship Hub"
        description="Launch, scale, and protect your business with standardized compliance, mentorship, and contracting tools."
      />

      <BusinessQuickActions />

      <section>
        <AICoach
          title="AI Business Coach"
          description="Get instant advice on strategy, marketing, operations, and pricing."
          context="business strategy, LLC formation, entrepreneurship, and federal contracting"
          placeholder="What are the steps to register an LLC in Georgia?"
        />
      </section>

      <BusinessChecklist />
      <BusinessOpportunities />

      <FeatureResourceSection
        resources={resources}
        state={state}
        error={error}
        emptyTitle="No business resources found"
        emptyDescription="Check back later or ask the coach for assistance finding specific business guides and templates."
      />
    </div>
  );
}
