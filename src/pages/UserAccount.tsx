import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { LayoutDashboard, Bookmark, WalletCards, FolderClosed, Bell, Settings } from "lucide-react";

export default function UserAccount() {
  return (
    <div className="p-6 lg:p-10">
      <SectionHeader 
        title="User Account" 
        description="Manage your profile, secure your documents, and track your progress." 
      />

      <Grid>
        <Card title="Dashboard" description="Personalized recommendations and metrics overview." icon={LayoutDashboard} />
        <Card title="Saved Resources" description="Your bookmarks for articles, grants, and guides." icon={Bookmark} />
        <Card title="Wallet & Credentials" description="Identity credentials and achievements." icon={WalletCards} />
        <Card title="Document Vault" description="Encrypted storage for your important files." icon={FolderClosed} />
        <Card title="Notifications" description="Deadlines, alerts, and system updates." icon={Bell} />
        <Card title="Profile Settings" description="System preferences and security settings." icon={Settings} />
      </Grid>
    </div>
  );
}
