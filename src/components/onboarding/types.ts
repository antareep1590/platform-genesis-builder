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

export interface BankVerification {
  // Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  ownershipPercentage: number;
  contactPhone: string;
  contactEmail: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  idDetails: {
    idType: string;
    idNumber: string;
    expirationDate: string;
  };
  hasOtherOwners: boolean;
  otherOwners: Array<{
    name: string;
    ownershipPercentage: number;
  }>;

  // Business Info
  ownershipType: string;
  legalBusinessName: string;
  dbaName: string;
  taxId: string;
  businessType: string;
  premiseType: string;
  yearsInBusiness: number;
  businessWebsite: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessPhone: string;
  businessEmail: string;

  // Bank Info
  bankName: string;
  routingNumber: string;
  accountNumber: string;

  // Processing Info
  currentlyProcessing: boolean;
  processingMethods: string[];
  maxMonthlySales: number;
  avgTransaction: number;
  highestTransaction: number;
  fraudProtection: boolean;
  acceptACH: boolean;
  businessFundingInterest: boolean;

  // Document Uploads
  driverLicense: File | null;
  bankStatements: File[];
  incorporationDocs: File | null;

  // LegitScript question
  wantsLegitScript: boolean;
}

export interface LegitScript {
  applyNow: boolean;
  businessName: string;
  npiNumber: string;
  documentsSignature: {
    document1: boolean;
    document2: boolean;
    document3: boolean;
  };
}

export interface BankUnderwriting {
  businessName: string;
  ein: string;
  authorizedRepName: string;
  dateOfBirth: string;
  businessAddress: string;
  idUpload: File | null;
  termsAccepted: boolean;
  eSignCompleted: boolean;
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
  bankVerification: BankVerification;
  legitScript: LegitScript;
  bankUnderwriting: BankUnderwriting;
  payment: Payment;
}
