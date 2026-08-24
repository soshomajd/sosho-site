export const d1Schema = {
  leads: {
    id: "TEXT PRIMARY KEY",
    source: "TEXT NOT NULL",
    locale: "TEXT NOT NULL",
    instagramUserId: "TEXT UNIQUE",
    status: "TEXT NOT NULL",
    projectType: "TEXT",
    tier: "TEXT",
    budget: "TEXT",
    requirementsJson: "TEXT NOT NULL",
  },
  conversations: {
    id: "TEXT PRIMARY KEY",
    leadId: "TEXT NOT NULL",
    channel: "TEXT NOT NULL",
    status: "TEXT NOT NULL",
  },
  messages: {
    id: "TEXT PRIMARY KEY",
    conversationId: "TEXT NOT NULL",
    role: "TEXT NOT NULL",
    content: "TEXT NOT NULL",
  },
  webhookEvents: {
    id: "TEXT PRIMARY KEY",
    externalEventId: "TEXT UNIQUE",
    channel: "TEXT NOT NULL",
    status: "TEXT NOT NULL",
  },
} as const;

export type LeadRequirements = {
  businessName: string | null;
  businessActivity: string | null;
  goal: string | null;
  pagesAndFeatures: string | null;
  designStyle: string | null;
  contentStatus: string | null;
  languages: string | null;
  budgetToman: string | null;
  deadline: string | null;
  contactName: string | null;
  phone: string | null;
  preferredChannel: string | null;
};
