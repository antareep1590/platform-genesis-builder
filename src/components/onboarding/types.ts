export interface BusinessInfo {
  businessName: string;
  businessType: string;
  platformPurpose: string[];
  supportEmail: string;
  supportPhone: string;
  phoneSupportHours: string;
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

export interface AdditionalDocument {
  id: string;
  title: string;
  file: File;
}

export interface Legal {
  termsConditions: File | null;
  privacyPolicy: File | null;
  hipaaCompliance: File | null;
  useTemplates: boolean;
  additionalDocuments: AdditionalDocument[];
  templateContent?: {
    termsConditions: string;
    privacyPolicy: string;
    hipaaCompliance: string;
  };
}

export interface Payment {
  completed: boolean;
  transactionId: string;
  acceptedTerms: boolean;
}

export interface OnboardingData {
  businessInfo: BusinessInfo;
  template: Template;
  branding: Branding;
  domain: Domain;
  legal: Legal;
  payment: Payment;
}
