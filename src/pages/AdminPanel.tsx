import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { Database, BrainCircuit, CheckCircle, ShieldAlert, BarChart3 } from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="p-6 lg:p-10">
      <SectionHeader 
        title="Admin Panel" 
        description="System management, content moderation, and operational oversight." 
      />

      <Grid>
        <Card title="Resource Management" description="Add, edit, or delete platform resources." icon={Database} />
        <Card title="AI Model Updates" description="Upload new documents to update AI knowledge." icon={BrainCircuit} />
        <Card title="Partner Approvals" description="Vetting workflow for new partners." icon={CheckCircle} />
        <Card title="Content Moderation" description="Review user submissions and community posts." icon={ShieldAlert} />
        <Card title="Analytics Dashboard" description="Usage, engagement, and outcomes metrics." icon={BarChart3} />
      </Grid>
    </div>
  );
}
