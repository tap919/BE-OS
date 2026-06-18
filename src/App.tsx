/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/src/components/layout/Layout";
import { AuthProvider } from "@/src/lib/AuthContext";
import Home from "@/src/pages/Home";
import FinancialLiteracy from "@/src/pages/FinancialLiteracy";
import WealthCapital from "@/src/pages/WealthCapital";
import FairHousingPage from "@/src/features/fair-housing/FairHousingPage";
import BusinessBuilderPage from "@/src/features/business-builder/BusinessBuilderPage";
import LegalEmpowerment from "@/src/pages/LegalEmpowerment";
import ToolsAgents from "@/src/pages/ToolsAgents";
import BlockchainIdentity from "@/src/pages/BlockchainIdentity";
import CommunityCulturePage from "@/src/features/community-culture/CommunityCulturePage";
import UserAccount from "@/src/pages/UserAccount";
import AdminPanel from "@/src/pages/AdminPanel";
import ToolView from "@/src/pages/ToolView";

import WorkspaceHub from "@/src/pages/Workspace";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/financial-literacy" element={<FinancialLiteracy />} />
            <Route path="/wealth-capital" element={<WealthCapital />} />
            <Route path="/fair-housing" element={<FairHousingPage />} />
            <Route path="/business" element={<BusinessBuilderPage />} />
            <Route path="/legal" element={<LegalEmpowerment />} />
            <Route path="/tools" element={<ToolsAgents />} />
            <Route path="/tools/:toolId" element={<ToolView />} />
            <Route path="/workspace" element={<WorkspaceHub />} />
            <Route path="/blockchain" element={<BlockchainIdentity />} />
            <Route path="/community" element={<CommunityCulturePage />} />
            <Route path="/account" element={<UserAccount />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
