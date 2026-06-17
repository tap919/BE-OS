import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { Bot, FileTerminal, Scale, Home, LineChart, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function ToolsAgents() {
  return (
    <div className="p-6 lg:p-10">
      <SectionHeader 
        title="Tools & AI Agents" 
        description="A suite of intelligent assistants tailored for specialized domains and personal growth." 
      />

      <Grid>
        <Link to="/financial-literacy" className="block"><Card title="AI Financial Coach" description="Budgeting, credit building, and debt management." icon={LineChart} /></Link>
        <Link to="/fair-housing" className="block"><Card title="AI Housing Interpreter" description="Translate complex leases, mortgages, and zoning laws." icon={Home} /></Link>
        <Link to="/business" className="block"><Card title="AI Business Coach" description="Strategy and planning guidance." icon={Briefcase} /></Link>
        <Link to="/legal" className="block"><Card title="AI Legal Organizer" description="Argument structuring and evidence organization." icon={Scale} /></Link>
        <Link to="/wealth-capital" className="block"><Card title="Opportunity Matcher" description="Find perfectly matched grants and capital programs." icon={Bot} /></Link>
        <Link to="/legal" className="block"><Card title="Document Simplifier" description="Plain‑language rewriting for any document." icon={FileTerminal} /></Link>
      </Grid>
    </div>
  );
}
