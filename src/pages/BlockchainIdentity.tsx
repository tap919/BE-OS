import React, { useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { SectionHeader, Grid, Card, SectionPanel, EmptyState, QuickActionCard, StatusBadge } from "@/src/components/ui/LayoutBlocks";
import { AICoach } from "@/src/components/ui/AICoach";
import { Link, Fingerprint, Users, Banknote, Coins, Plus, ShieldCheck, Download, Search } from "lucide-react";

export default function BlockchainIdentity() {
  const { user } = useAuth();
  
  // Mocks for UI states
  const [walletConnected, setWalletConnected] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10 max-w-7xl mx-auto">
      <SectionHeader 
        title="Blockchain & Identity" 
        description="Your decentralized infrastructure for verifiable credentials, trustless lending, and digital sovereignty." 
      >
        <button 
          onClick={() => setWalletConnected(!walletConnected)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${
            walletConnected 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
      </SectionHeader>

      {/* Identity Overview / Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Soulbound Score</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-slate-900">742</span>
            <StatusBadge status="success" label="Excellent" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Verifications</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-slate-900">{credentials.length}</span>
            <span className="text-sm font-bold text-slate-500">Active</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lending Circles</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-slate-900">{circles.length}</span>
            <span className="text-sm font-bold text-slate-500">Joined</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Grants Vault</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-slate-900">$0</span>
            <span className="text-sm font-bold text-slate-500">Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Task Modules */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <SectionPanel 
            title="Verifiable Credentials" 
            action={<button className="text-sm font-bold text-amber-600 hover:text-amber-700">View All</button>}
          >
            {credentials.length > 0 ? (
              <div className="space-y-4">
                {/* List goes here */}
              </div>
            ) : (
              <EmptyState 
                title="No credentials found" 
                description="Verify your course completions, business formation, or certifications to build your on-chain identity."
                icon={ShieldCheck}
                actionLabel="Verify a Credential"
                onAction={() => setCredentials([{ id: 1 }])}
              />
            )}
          </SectionPanel>

          <SectionPanel 
            title="Community Lending Circles (ROSCA)"
            action={<button className="text-sm font-bold text-amber-600 hover:text-amber-700">Browse Circles</button>}
          >
            {circles.length > 0 ? (
              <div className="space-y-4">
                {/* List goes here */}
              </div>
            ) : (
              <EmptyState 
                title="Not in any active circles" 
                description="Leverage trust-based financial pools. Join a community circle to accelerate savings through smart contracts."
                icon={Users}
                actionLabel="Join a Circle"
                onAction={() => setCircles([{ id: 1 }])}
              />
            )}
          </SectionPanel>

          <SectionPanel 
            title="Grant Contracts"
          >
            {contracts.length > 0 ? (
              <div className="space-y-4">
                {/* List goes here */}
              </div>
            ) : (
              <EmptyState 
                title="No active grant contracts" 
                description="Secure and transparent milestone-based funding. Apply for community grants to start building your ledger."
                icon={Banknote}
                actionLabel="Apply for Grants"
                onAction={() => setContracts([{ id: 1 }])}
              />
            )}
          </SectionPanel>

        </div>

        {/* Sidebar Actions & Coach */}
        <div className="flex flex-col gap-8">
          <SectionPanel title="Quick Actions">
            <div className="flex flex-col gap-3">
              <QuickActionCard 
                title="Issue Credential" 
                description="Create an attestation for a community member." 
                icon={Plus} 
                onClick={() => {}} 
              />
              <QuickActionCard 
                title="Verify External ID" 
                description="Connect government or institutional records." 
                icon={Search} 
                onClick={() => {}} 
              />
              <QuickActionCard 
                title="Export Wallet Data" 
                description="Download a backup of your on-chain resume." 
                icon={Download} 
                onClick={() => {}} 
              />
            </div>
          </SectionPanel>

          {/* AI Coach */}
          <div className="sticky top-6">
            <AICoach 
              title="Identity & Web3 Coach" 
              description="Ask about smart contracts, wallets, or how to leverage on-chain metrics." 
              context="web3, blockchain identity, decentralized finance, verifiable credentials, and smart contract security" 
              placeholder="How do lending circles work on-chain?" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
