# BE-OS (Black Empowerment Operating System)

## Overview
BE-OS is a comprehensive full-stack application designed to empower communities by providing accessible tools for financial literacy, housing rights, business building, and legal defense. It integrates real-time progress tracking, verifiable mock-blockchain credentials, and deep AI coaching to guide users through crucial empowerment workflows.

## Key Features
- **Financial Literacy:** 50/30/20 budget calculators, debt payoff strategies.
- **Business Builder:** LLC formation checklists, grant finders, and CDFI locators.
- **Fair Housing:** Tenant rights guides and appraisal bias reporting tools.
- **Legal Defense:** Expungement navigators and civil rights information.
- **AI Coach:** Context-aware AI coaching powered by Google's Gemini models.
- **Vault:** A secure, local repository for saving helpful resources and AI-generated snippets.

## Architecture
- **Frontend:** React, Vite, Tailwind CSS, Recharts.
- **Backend:** Node.js, Express, Better-SQLite3 via Drizzle ORM.
- **Authentication:** Firebase Auth (JWT verification).
- **Deployment:** Container-ready (e.g. Cloud Run/Render) with a single `server.ts` entry point running the API alongside the compiled Vite SPA.

## Getting Started

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Copy \`.env.example\` to \`.env\` and configure the required values (e.g., \`GEMINI_API_KEY\`).
   You must also supply a valid \`firebase-applet-config.json\` containing your Firebase project setup if testing locally.

3. **Development**
   \`\`\`bash
   npm run dev
   \`\`\`
   This boots the backend server on port 3000, which also serves Vite in development middleware mode.

4. **Production Build**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Note on Database
By default, BE-OS uses a local \`sqlite.db\` for storage. For production environments (like Cloud Run or Render), ensure you attach a persistent volume and set \`DATA_DIR=/data\` to avoid data loss upon container restart.
