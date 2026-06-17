import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { SectionHeader, Grid, Card, SectionPanel, EmptyState, QuickActionCard, StatusBadge } from "@/src/components/ui/LayoutBlocks";
import { AICoach } from "@/src/components/ui/AICoach";
import { Link, Fingerprint, Users, Banknote, Coins, Plus, ShieldCheck, Download, Search, CheckCircle } from "lucide-react";
import { BrowserProvider, formatEther } from "ethers";

export default function BlockchainIdentity() {
  const { user } = useAuth();
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [credentials, setCredentials] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setWalletConnected(true);
        const bal = await provider.getBalance(accounts[0].address);
        setBalance(formatEther(bal));
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setWalletConnected(true);
          const bal = await provider.getBalance(accounts[0]);
          setBalance(formatEther(bal));
        }
      } catch (err) {
        console.error("User rejected request");
      }
    } else {
      alert("No crypto wallet found. Please install MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setAccount(null);
    setBalance("0");
  };

  const issueCredential = () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    setCredentials(prev => [...prev, {
      id: Date.now(),
      type: "Course Completion",
      issuer: "BE-OS Academy",
      date: new Date().toLocaleDateString(),
      hash: `0x${Math.random().toString(16).slice(2, 42)}`
    }]);
  };

  const joinCircle = () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    setCircles(prev => [...prev, {
      id: Date.now(),
      name: "Community Fund Delta",
      poolSize: "5.0 ETH",
      status: "Active"
    }]);
  };

  const applyGrant = () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    setContracts(prev => [...prev, {
      id: Date.now(),
      name: "Minority Business Grant 2026",
      amount: "2.5 ETH",
      status: "Under Review"
    }]);
  };

  // Derive score from balance and verified credentials
  const score = walletConnected ? Math.min(850, 600 + (credentials.length * 20) + (parseFloat(balance) * 50)) : 0;

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10 max-w-7xl mx-auto">
      <SectionHeader 
        title="Blockchain & Identity" 
        description="Your decentralized infrastructure for verifiable credentials, trustless lending, and digital sovereignty." 
      >
        <button 
          onClick={walletConnected ? disconnectWallet : connectWallet}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${
            walletConnected 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          {walletConnected ? `${account?.slice(0,6)}...${account?.slice(-4)}` : 'Connect Wallet'}
        </button>
      </SectionHeader>

      {/* Identity Overview / Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Soulbound Score</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-slate-900">{Math.floor(score)}</span>
            {walletConnected ? <StatusBadge status={score > 700 ? "success" : "warning"} label={score > 700 ? "Excellent" : "Building"} /> : <StatusBadge status="error" label="Disconnected" />}
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
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Wallet Balance</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-slate-900">{parseFloat(balance).toFixed(2)}</span>
            <span className="text-sm font-bold text-slate-500">ETH</span>
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
                {credentials.map(c => (
                  <div key={c.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{c.type}</h4>
                      <p className="text-sm text-slate-500">Issued by {c.issuer} on {c.date}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono bg-slate-100 p-1 rounded text-slate-600">{c.hash}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 mt-1"><CheckCircle className="w-3 h-3"/> Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No credentials found" 
                description="Verify your course completions, business formation, or certifications to build your on-chain identity."
                icon={ShieldCheck}
                actionLabel={walletConnected ? "Verify a Credential" : "Connect Wallet First"}
                onAction={issueCredential}
              />
            )}
          </SectionPanel>

          <SectionPanel 
            title="Community Lending Circles (ROSCA)"
            action={<button className="text-sm font-bold text-amber-600 hover:text-amber-700">Browse Circles</button>}
          >
            {circles.length > 0 ? (
              <div className="space-y-4">
                {circles.map(c => (
                  <div key={c.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{c.name}</h4>
                      <p className="text-sm text-slate-500">Pool Size: {c.poolSize}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded">{c.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Not in any active circles" 
                description="Leverage trust-based financial pools. Join a community circle to accelerate savings through smart contracts."
                icon={Users}
                actionLabel={walletConnected ? "Join a Circle" : "Connect Wallet First"}
                onAction={joinCircle}
              />
            )}
          </SectionPanel>

          <SectionPanel 
            title="Grant Contracts"
          >
            {contracts.length > 0 ? (
              <div className="space-y-4">
                {contracts.map(c => (
                  <div key={c.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{c.name}</h4>
                      <p className="text-sm text-slate-500">Amount: {c.amount}</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase rounded">{c.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No active grant contracts" 
                description="Secure and transparent milestone-based funding. Apply for community grants to start building your ledger."
                icon={Banknote}
                actionLabel={walletConnected ? "Apply for Grants" : "Connect Wallet First"}
                onAction={applyGrant}
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
                onClick={issueCredential} 
              />
              <QuickActionCard 
                title="Verify External ID" 
                description="Connect government or institutional records." 
                icon={Search} 
                onClick={() => { alert("This would launch an identity verification provider (e.g., Plaid, Persona)."); }} 
              />
              <QuickActionCard 
                title="Export Wallet Data" 
                description="Download a backup of your on-chain resume." 
                icon={Download} 
                onClick={() => {
                  if(!walletConnected) {
                     alert("Please connect wallet");
                     return;
                  }
                  const blob = new Blob([JSON.stringify({ account, credentials, circles, score }, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `identity-${account}.json`;
                  a.click();
                }} 
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
