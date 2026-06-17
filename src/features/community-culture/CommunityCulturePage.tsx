import React from "react";
import { SectionHeader } from "@/src/components/ui/LayoutBlocks";
import { useAuthedResources } from "../shared/hooks/useAuthedResources";
import { CommunityQuickActions } from "./components/CommunityQuickActions";
import { CommunityDirectoryHighlights } from "./components/CommunityDirectoryHighlights";
import { CommunityEventsPanel } from "./components/CommunityEventsPanel";
import { CommunityStoriesPanel } from "./components/CommunityStoriesPanel";
import { FeatureResourceSection } from "../shared/components/FeatureResourceSection";

export default function CommunityCulturePage() {
  const { resources, state, error } = useAuthedResources("community");

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10">
      <SectionHeader
        title="Community & Culture"
        description="Amplify voices, celebrate success, and connect with the broader ecosystem."
      />

      <CommunityQuickActions />
      <CommunityDirectoryHighlights />
      <CommunityEventsPanel />
      <CommunityStoriesPanel />

      <FeatureResourceSection
        resources={resources}
        state={state}
        error={error}
        emptyTitle="No community resources found"
        emptyDescription="Discover Black-owned businesses, partner banks, and community organizations by keyword or category."
      />
    </div>
  );
}
