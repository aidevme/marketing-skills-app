export interface Skill {
  id: string;
  displayName: string;
  category: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'conversion',
    name: 'Conversion Optimization',
    color: '#0078d4',
    skills: [
      { id: 'page-cro', displayName: 'Page CRO', category: 'Conversion Optimization', description: 'Optimize any marketing page for conversions — homepage, landing pages, pricing.' },
      { id: 'signup-flow-cro', displayName: 'Signup Flow CRO', category: 'Conversion Optimization', description: 'Optimize signup, registration, account creation, and trial activation flows.' },
      { id: 'onboarding-cro', displayName: 'Onboarding CRO', category: 'Conversion Optimization', description: 'Improve post-signup onboarding, user activation, and time-to-value.' },
      { id: 'form-cro', displayName: 'Form CRO', category: 'Conversion Optimization', description: 'Optimize lead capture forms, contact forms, and non-signup forms.' },
      { id: 'popup-cro', displayName: 'Popup CRO', category: 'Conversion Optimization', description: 'Create or optimize popups, modals, overlays, slide-ins, and banners.' },
      { id: 'paywall-upgrade-cro', displayName: 'Paywall & Upgrade CRO', category: 'Conversion Optimization', description: 'Optimize in-app paywalls, upgrade screens, upsell modals, and feature gates.' },
    ],
  },
  {
    id: 'content',
    name: 'Content & Copy',
    color: '#8764b8',
    skills: [
      { id: 'copywriting', displayName: 'Copywriting', category: 'Content & Copy', description: 'Write or rewrite marketing copy for any page — homepage, landing pages, features.' },
      { id: 'copy-editing', displayName: 'Copy Editing', category: 'Content & Copy', description: 'Edit, review, and improve existing marketing copy or refresh outdated content.' },
      { id: 'cold-email', displayName: 'Cold Email', category: 'Content & Copy', description: 'Write B2B cold outreach emails and follow-up sequences that get replies.' },
      { id: 'email-sequence', displayName: 'Email Sequence', category: 'Content & Copy', description: 'Create or optimize drip campaigns, automated email flows, and lifecycle emails.' },
      { id: 'social-content', displayName: 'Social Content', category: 'Content & Copy', description: 'Create and optimize content for LinkedIn, Twitter/X, Instagram, and more.' },
      { id: 'content-strategy', displayName: 'Content Strategy', category: 'Content & Copy', description: 'Plan a content strategy, decide what to create, and figure out what topics to cover.' },
      { id: 'image', displayName: 'Image', category: 'Content & Copy', description: 'Create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product visuals.' },
      { id: 'video', displayName: 'Video', category: 'Content & Copy', description: 'Create, generate, or produce video content using AI tools or programmatic frameworks.' },
    ],
  },
  {
    id: 'seo',
    name: 'SEO & Discovery',
    color: '#107c10',
    skills: [
      { id: 'seo-audit', displayName: 'SEO Audit', category: 'SEO & Discovery', description: 'Audit, review, and diagnose technical and on-page SEO issues on your site.' },
      { id: 'ai-seo', displayName: 'AI SEO', category: 'SEO & Discovery', description: 'Optimize content for AI search engines, get cited by LLMs, appear in AI answers.' },
      { id: 'programmatic-seo', displayName: 'Programmatic SEO', category: 'SEO & Discovery', description: 'Create SEO-driven pages at scale using templates and structured data.' },
      { id: 'site-architecture', displayName: 'Site Architecture', category: 'SEO & Discovery', description: 'Plan page hierarchy, navigation, URL structure, and internal linking strategy.' },
      { id: 'competitor-alternatives', displayName: 'Competitor Alternatives', category: 'SEO & Discovery', description: 'Build competitor comparison and alternative pages for SEO and sales enablement.' },
      { id: 'competitor-profiling', displayName: 'Competitor Profiling', category: 'SEO & Discovery', description: 'Research, profile, and analyze competitors from their URLs to inform positioning and strategy.' },
      { id: 'schema-markup', displayName: 'Schema Markup', category: 'SEO & Discovery', description: 'Add, fix, and optimize schema markup and structured data on your site.' },
      { id: 'aso-audit', displayName: 'ASO Audit', category: 'SEO & Discovery', description: 'Audit or optimize your App Store or Google Play listing for more installs.' },
    ],
  },
  {
    id: 'paid',
    name: 'Paid & Distribution',
    color: '#ff8c00',
    skills: [
      { id: 'paid-ads', displayName: 'Paid Ads', category: 'Paid & Distribution', description: 'Run and optimize campaigns on Google Ads, Meta, LinkedIn, and Twitter/X.' },
      { id: 'ad-creative', displayName: 'Ad Creative', category: 'Paid & Distribution', description: 'Generate, iterate, and scale ad creative — headlines, descriptions, and primary text.' },
    ],
  },
  {
    id: 'measurement',
    name: 'Measurement & Testing',
    color: '#00b7c3',
    skills: [
      { id: 'analytics-tracking', displayName: 'Analytics Tracking', category: 'Measurement & Testing', description: 'Set up, improve, and audit analytics tracking and measurement systems.' },
      { id: 'ab-test-setup', displayName: 'A/B Test Setup', category: 'Measurement & Testing', description: 'Plan, design, and implement A/B tests and growth experimentation programs.' },
    ],
  },
  {
    id: 'retention',
    name: 'Retention',
    color: '#d13438',
    skills: [
      { id: 'churn-prevention', displayName: 'Churn Prevention', category: 'Retention', description: 'Build cancel flows, save offers, recover failed payments, and reduce churn.' },
    ],
  },
  {
    id: 'growth',
    name: 'Growth Engineering',
    color: '#ca8a04',
    skills: [
      { id: 'co-marketing', displayName: 'Co-Marketing', category: 'Growth Engineering', description: 'Find co-marketing partners, plan joint campaigns, and brainstorm partnership opportunities.' },
      { id: 'free-tool-strategy', displayName: 'Free Tool Strategy', category: 'Growth Engineering', description: 'Plan, evaluate, and build free tools for lead generation and SEO value.' },
      { id: 'referral-program', displayName: 'Referral Program', category: 'Growth Engineering', description: 'Create, optimize, and analyze referral programs and affiliate strategies.' },
      { id: 'community-marketing', displayName: 'Community Marketing', category: 'Growth Engineering', description: 'Build and leverage online communities to drive product growth and brand loyalty.' },
      { id: 'lead-magnets', displayName: 'Lead Magnets', category: 'Growth Engineering', description: 'Create, plan, and optimize lead magnets for email capture and lead generation.' },
    ],
  },
  {
    id: 'strategy',
    name: 'Strategy & Monetization',
    color: '#6264a7',
    skills: [
      { id: 'marketing-ideas', displayName: 'Marketing Ideas', category: 'Strategy & Monetization', description: '140+ SaaS marketing ideas and strategies to inspire your next campaign.' },
      { id: 'marketing-psychology', displayName: 'Marketing Psychology', category: 'Strategy & Monetization', description: 'Apply psychological principles and behavioral science to marketing decisions.' },
      { id: 'launch-strategy', displayName: 'Launch Strategy', category: 'Strategy & Monetization', description: 'Plan product launches, feature announcements, and release strategies.' },
      { id: 'pricing-strategy', displayName: 'Pricing Strategy', category: 'Strategy & Monetization', description: 'Get help with pricing decisions, packaging, and monetization strategy.' },
      { id: 'customer-research', displayName: 'Customer Research', category: 'Strategy & Monetization', description: 'Conduct, analyze, and synthesize customer research to guide strategy.' },
      { id: 'product-marketing-context', displayName: 'Product Marketing Context', category: 'Strategy & Monetization', description: 'Create the foundational context — audience, positioning, and messaging — used by all skills.' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales & RevOps',
    color: '#038387',
    skills: [
      { id: 'revops', displayName: 'RevOps', category: 'Sales & RevOps', description: 'Lead lifecycle management, lead scoring, routing, and pipeline management.' },
      { id: 'sales-enablement', displayName: 'Sales Enablement', category: 'Sales & RevOps', description: 'Create sales decks, one-pagers, objection handling docs, and demo scripts.' },
      { id: 'directory-submissions', displayName: 'Directory Submissions', category: 'Sales & RevOps', description: 'Submit your product to startup, SaaS, AI, agent, MCP, no-code, or review directories for visibility.' },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_CATEGORIES.flatMap((c) => c.skills);
