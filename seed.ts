import { db } from './src/db/index';
import { resources } from './src/db/schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  const data = [
    // Financial Literacy
    { id: "f1", section: "financial", title: "Budgeting 101 Guide", description: "Templates, calculators, and step-by-step guides for effective cash flow management.", url: "/tools/budgeting", type: "internal", tags: ["budgeting", "basics"] },
    { id: "f2", section: "financial", title: "Credit Building Mastery", description: "How credit works, disputing errors, and building excellent credit scores.", url: "/financial-literacy", type: "internal", tags: ["credit", "education"] },
    { id: "f3", section: "financial", title: "Debt Payoff Strategist", description: "Avalanche and snowball methods, plus negotiation scripts for creditors.", url: "/financial-literacy", type: "internal", tags: ["debt", "tools"] },
    { id: "f4", section: "financial", title: "Greenwood Bank", description: "A digital banking platform for Black and Latino individuals and businesses.", url: "https://bankgreenwood.com", type: "external", tags: ["banking", "partner"] },
    { id: "f5", section: "financial", title: "Emergency Fund Generator", description: "Step-by-step frameworks for safely securing 3-6 months of capital.", url: "/financial-literacy", type: "internal", tags: ["savings", "tactics"] },
    
    // Housing / Real Estate
    { id: "h1", section: "housing", title: "Renter Rights & Protections Guide", description: "State-by-state guides detailing tenant protections.", url: "/fair-housing", type: "internal", tags: ["renter", "rights"] },
    { id: "h2", section: "housing", title: "Appraisal Bias Defense Tool", description: "Compare comps vs appraisal to audit property valuations for racial bias.", url: "/fair-housing", type: "internal", tags: ["tool", "appraisal"] },
    { id: "h3", section: "housing", title: "National Fair Housing Alliance", description: "Advocacy organization dedicated to ending housing discrimination.", url: "https://nationalfairhousing.org", type: "external", tags: ["partner", "advocacy"] },
    { id: "h4", section: "housing", title: "First-Time Homebuyer Grants", description: "Directory of down-payment assistance programs categorized by state.", url: "/fair-housing", type: "internal", tags: ["grants", "ownership"] },
    { id: "h5", section: "housing", title: "NACA Program", description: "Neighborhood Assistance Corporation of America: No down payment, no closing costs.", url: "https://www.naca.com/", type: "external", tags: ["mortgage", "partner"] },

    // Business Building
    { id: "b1", section: "business", title: "LLC Formation Wizard", description: "Step-by-step state registrations and operating agreements.", url: "/business-builder", type: "internal", tags: ["startup", "legal"] },
    { id: "b2", section: "business", title: "SAM.gov Contracting Guide", description: "Federal contracting prep and certification steps.", url: "/business-builder", type: "internal", tags: ["contracting", "federal"] },
    { id: "b3", section: "business", title: "Official Black Wall Street", description: "The largest app and directory connecting consumers to Black-owned businesses.", url: "https://officialblackwallstreet.com", type: "external", tags: ["directory", "partner"] },
    { id: "b4", section: "business", title: "Small Business Administration (SBA) 8(a)", description: "Business development program designed to help socially and economically disadvantaged firms.", url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program", type: "external", tags: ["sba", "contracting"] },
    { id: "b5", section: "business", title: "Business Plan Generator", description: "AI-assisted dynamic templates for pitching and securing business loans.", url: "/tools/business-plan", type: "internal", tags: ["planning", "tool"] },

    // Justice / Legal Empowerment
    { id: "j1", section: "justice", title: "Case Law Search Engine", description: "Semantic search of public cases for civil rights and defense.", url: "/legal-empowerment", type: "internal", tags: ["legal", "research"] },
    { id: "j2", section: "justice", title: "Expungement Navigator", description: "Eligibility checks and forms for record clearing and post-conviction relief.", url: "/tools/expungement", type: "internal", tags: ["expungement", "tool"] },
    { id: "j3", section: "justice", title: "NAACP LDF", description: "America's premier legal organization fighting for racial justice.", url: "https://www.naacpldf.org", type: "external", tags: ["partner", "advocacy"] },
    { id: "j4", section: "justice", title: "Know Your Rights Cards", description: "Pocket-sized guidelines for interacting with law enforcement.", url: "/legal-empowerment", type: "internal", tags: ["rights", "defense"] },
    { id: "j5", section: "justice", title: "Pro Bono Attorney Directory", description: "List of legal professionals offering pro bono services in civil rights cases.", url: "/tools", type: "internal", tags: ["directory", "lawyers"] },

    // Wealth Capital
    { id: "c1", section: "capital", title: "Grant Search Engine", description: "Filters by state, industry, identity for relevant funding.", url: "/tools/grant-search", type: "internal", tags: ["grants", "funding"] },
    { id: "c2", section: "capital", title: "Community Lending Circles", description: "Smart contract susu groups for collective saving.", url: "/blockchain-identity", type: "internal", tags: ["susu", "web3"] },
    { id: "c3", section: "capital", title: "Harlem Capital", description: "Venture capital firm on a mission to change the face of entrepreneurship.", url: "https://harlem.capital/", type: "external", tags: ["vc", "partner"] },
    { id: "c4", section: "capital", title: "Crowd-Invest Real Estate", description: "Fractional investing groups focused on gentrifying neighborhoods.", url: "/wealth-capital", type: "internal", tags: ["investing", "real estate"] },
    { id: "c5", section: "capital", title: "Access to Capital Directory", description: "Curated lists of Angel, Seed, and Series A investors for minority founders.", url: "/tools", type: "internal", tags: ["investors", "directory"] },

    // Community & Culture
    { id: "cm1", section: "community", title: "Local Events Directory", description: "Find networking events, cultural festivals, and community meetings.", url: "/community", type: "internal", tags: ["events", "networking"] },
    { id: "cm2", section: "community", title: "Black-Owned Business Finder", description: "Geolocator for supporting local Black-owned restaurants and shops.", url: "/community", type: "internal", tags: ["business", "support"] },
    { id: "cm3", section: "community", title: "Cultural Heritage Archives", description: "Museums, exhibits, and digital archives documenting Black history.", url: "/tools", type: "internal", tags: ["history", "culture"] },
    { id: "cm4", section: "community", title: "Volunteer Match", description: "Connect with local non-profits and mentorship programs.", url: "/tools", type: "internal", tags: ["volunteer", "give-back"] },
    { id: "cm5", section: "community", title: "AfroTech", description: "One of the largest multicultural tech conferences in the US.", url: "https://afrotech.com", type: "external", tags: ["tech", "partner"] }
  ];

  try {
    // Upsert logic for SQLite without explicit ON CONFLICT
    for (const r of data) {
      const existing = await db.select().from(resources).where(eq(resources.id, r.id)).all();
      if (existing.length === 0) {
        await db.insert(resources).values(r).run();
      } else {
        await db.update(resources).set(r).where(eq(resources.id, r.id)).run();
      }
    }
    console.log("Database seeded successfully with expanded resources!");
  } catch (err) {
    console.error("Failed to seed:", err);
  }
}

import { fileURLToPath } from 'url';
const isMain = process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  seedDatabase();
}
