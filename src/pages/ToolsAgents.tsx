import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { Bot, FileTerminal, Scale, Home, LineChart, Briefcase } from "lucide-react";

export default function ToolsAgents() {
  return (
    <div className="p-6 lg:p-10">
      <SectionHeader 
        title="Tools & AI Agents" 
        description="A suite of intelligent assistants tailored for specialized domains and personal growth." 
      />

      <Grid>
        <Card title="AI Financial Coach" description="Budgeting, credit building, and debt management." icon={LineChart} />
        <Card title="AI Housing Interpreter" description="Translate complex leases, mortgages, and zoning laws." icon={Home} />
        <Card title="AI Business Coach" description="Strategy and planning guidance." icon={Briefcase} />
        <Card title="AI Legal Organizer" description="Argument structuring and evidence organization." icon={Scale} />
        <Card title="Opportunity Matcher" description="Find perfectly matched grants and capital programs." icon={Bot} />
        <Card title="Document Simplifier" description="Plain‑language rewriting for any document." icon={FileTerminal} />
      </Grid>
    </div>
  );
}
