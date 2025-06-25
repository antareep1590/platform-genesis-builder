
export interface BusinessInfo {
  businessName: string;
  businessType: string;
  platformPurpose: string[];
}

export interface Template {
  selectedTemplate: string;
  templateData: {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    tags: string[];
  } | null;
}

export interface Branding {
  logo: File | null;
  brandColor: string;
  accentColor: string;
  font: string;
  displayName: string;
  tagline: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    youtube: string;
  };
}

export interface Domain {
  subdomain: string;
  customDomain: string;
  domainOption: 'subdomain' | 'custom' | 'purchase';
}

export interface Legal {
  termsConditions: File | null;
  privacyPolicy: File | null;
  hipaaCompliance: File | null;
  useTemplates: boolean;
}

export interface Payment {
  completed: boolean;
  transactionId: string;
}

export interface OnboardingData {
  businessInfo: BusinessInfo;
  template: Template;
  branding: Branding;
  domain: Domain;
  legal: Legal;
  payment: Payment;
}
