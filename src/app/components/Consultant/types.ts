export type Option = { id: string; label: string };

export type ConsultantConfig = {
  questions: {
    projectType: { label: string; options: Option[] };
    goal: { label: string; options: Option[] };
    features: { label: string; byType: Record<string, Option[]> };
    size: { byType: Record<string, { label: string; options: Option[] }> };
    style: { label: string; options: Option[] };
    budget: { label: string; options: Option[]; timeframes: Option[] };
    content: { label: string; options: Option[]; forTypes: string[] };
  };
  currencyLabel: string | null;
  pricingConfigured: boolean;
};

export type Answers = {
  projectType?: string;
  projectTypeNote?: string;
  goal?: string;
  goalNote?: string;
  features: string[];
  featuresNote?: string;
  size?: string;
  style?: string;
  referenceUrl?: string;
  styleNote?: string;
  budget?: string;
  timeframe?: string;
  timeframeNote?: string;
  content?: string;
  notes?: string;
};

type Range = { min: number; max: number };

export type TierEstimate = { oneTime: Range; weeks: Range; monthly: number };

export type PublicEstimate =
  | { status: "needs_review"; reason: "no_tariff" | "consultation"; confidence: string }
  | {
      status: "estimated" | "partial";
      confidence: "high" | "medium" | "low";
      architecture: string;
      currency: { code: string; label: { fa: string; en: string } };
      tiers: { economic?: TierEstimate; professional?: TierEstimate };
      recurring: { domainYearly: number; supportMonthly: number | null };
      budgetFit: "below" | "fits" | "professional" | "unknown";
      timelineFit: "tight" | "fits" | "flexible";
      missingFeatures: string[];
    };

type TierScope = {
  features: Option[];
  templates: string[];
  staticPages: number;
  added: Array<Option & { reason: string }>;
  deferred: Option[];
  designLevel: string;
};

export type ScopeView = {
  projectType: Option;
  goal: Option;
  architecture: { id: string | null; reason: string; alternative: { id: string; note: string } | null };
  complexity: "low" | "medium" | "high";
  confidence: "high" | "medium" | "low";
  consultationRecommended: boolean;
  twoTiers: boolean;
  staticPages: string[];
  tiers: { economic: TierScope; professional: TierScope };
  needsReview: string[];
  sizeAssumed: boolean;
};

export type EstimateResponse = {
  scope: ScopeView;
  estimate: PublicEstimate;
  summary: { text: string; ambiguities: string[]; source: "model" | "fallback" };
  stored: boolean;
  consultantId?: string;
  publicRef?: string;
  updateToken?: string;
};

export type Interpretation = {
  projectType: string | null;
  goal: string | null;
  features: string[];
  size: string | null;
  style: string | null;
  note: string | null;
};

export type StepId = "projectType" | "goal" | "features" | "size" | "style" | "content" | "budget" | "review" | "result" | "contact" | "done";
