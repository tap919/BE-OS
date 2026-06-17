import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/lib/AuthContext";
import {
  Home,
  PiggyBank,
  Landmark,
  Home as HomeIcon,
  Briefcase,
  Scale,
  BrainCircuit,
  Link as LinkIcon,
  Users,
  User,
  Settings,
  Menu,
  Cloud,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Financial Literacy", href: "/financial-literacy", icon: PiggyBank },
  { name: "Wealth & Capital", href: "/wealth-capital", icon: Landmark },
  { name: "Fair Housing", href: "/fair-housing", icon: HomeIcon },
  { name: "Business Builder", href: "/business", icon: Briefcase },
  { name: "Legal Empowerment", href: "/legal", icon: Scale },
  { name: "Tools & AI Agents", href: "/tools", icon: BrainCircuit },
  { name: "Workspace Hub", href: "/workspace", icon: Cloud },
  { name: "Blockchain & Identity", href: "/blockchain", icon: LinkIcon },
  { name: "Community & Culture", href: "/community", icon: Users },
  { name: "User Account", href: "/account", icon: User },
  { name: "Admin Panel", href: "/admin", icon: Settings },
];

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const location = useLocation();
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-800 bg-slate-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-y-auto lg:h-screen lg:flex lg:flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500 font-bold text-slate-900">
            BE
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            EmpowerOS
          </span>
        </div>
        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex gap-x-3 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      location.pathname === item.href
                        ? "text-amber-500"
                        : "text-slate-400 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800 mt-auto">
          {user ? (
            <div className="bg-slate-800 rounded-lg p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-600" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs text-white">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-white font-medium truncate">{user.displayName || user.email}</p>
                  <button onClick={logout} className="text-slate-400 hover:text-white text-left uppercase tracking-tighter w-full">Sign Out</button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-600"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-slate-500 hover:text-slate-900 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm text-slate-500">System Status:</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span> Blockchain Synchronized
              </span>
            </div>
            
            {/* Mobile logo when sidebar is closed */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500 text-xs font-bold text-slate-900">
                BE
              </div>
              <span className="font-bold text-slate-900">EmpowerOS</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-bold uppercase text-slate-400">Digital Wallet</p>
              <p className="font-mono text-sm font-bold text-slate-900">4,290.45 E-OS</p>
            </div>
            <button className="hidden rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 sm:block">Search Platform</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
