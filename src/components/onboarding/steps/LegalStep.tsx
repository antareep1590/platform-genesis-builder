
import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Upload, FileText, Shield, Scale, Edit, Save, X } from 'lucide-react';
import { Legal } from '../types';

interface LegalStepProps {
  data: Legal;
  onUpdate: (data: Legal) => void;
  onNext: () => void;
  onPrev: () => void;
}

const defaultTemplates = {
  termsConditions: `TERMS AND CONDITIONS

Last updated: [DATE]

1. ACCEPTANCE OF TERMS
By accessing and using this telehealth platform, you accept and agree to be bound by the terms and provision of this agreement.

2. MEDICAL SERVICES
This platform provides telehealth consultation services. All medical advice should be confirmed with your healthcare provider.

3. PRIVACY AND CONFIDENTIALITY
We are committed to protecting your privacy and maintaining the confidentiality of your health information in accordance with HIPAA regulations.

4. USER RESPONSIBILITIES
You agree to provide accurate and complete information during consultations and follow all prescribed treatments.

5. LIMITATION OF LIABILITY
The platform and its providers shall not be liable for any indirect, incidental, or consequential damages.

6. TERMINATION
We reserve the right to terminate access to the platform for violation of these terms.

For questions about these terms, please contact us at [CONTACT_EMAIL].`,

  privacyPolicy: `PRIVACY POLICY

Last updated: [DATE]

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, schedule appointments, or communicate with healthcare providers.

2. HOW WE USE YOUR INFORMATION
- To provide telehealth services
- To communicate with you about appointments
- To improve our platform and services
- To comply with legal obligations

3. INFORMATION SHARING
We do not sell, trade, or rent your personal information. We may share information with:
- Healthcare providers for treatment purposes
- Service providers who assist in platform operations
- As required by law or legal process

4. DATA SECURITY
We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. YOUR RIGHTS
You have the right to access, update, or delete your personal information. Contact us at [CONTACT_EMAIL] to exercise these rights.

6. HIPAA COMPLIANCE
This platform complies with the Health Insurance Portability and Accountability Act (HIPAA) and protects your health information accordingly.

Contact us at [CONTACT_EMAIL] for privacy-related questions.`,

  hipaaCompliance: `HIPAA COMPLIANCE NOTICE

This Notice describes how medical information about you may be used and disclosed and how you can get access to this information.

PROTECTED HEALTH INFORMATION (PHI)
We are required by law to maintain the privacy of your health information and to provide you with notice of our legal duties and privacy practices.

USES AND DISCLOSURES
We may use and disclose your PHI for:
- Treatment purposes
- Payment activities
- Healthcare operations
- As required by law

YOUR RIGHTS
You have the right to:
- Request restrictions on uses and disclosures
- Request to receive communications in a certain manner
- Inspect and copy your PHI
- Request amendments to your PHI
- Receive an accounting of disclosures

COMPLAINTS
If you believe your privacy rights have been violated, you may file a complaint with us at [CONTACT_EMAIL] or with the U.S. Department of Health and Human Services.

CHANGES TO THIS NOTICE
We reserve the right to change this notice and make the new notice apply to PHI we already have as well as any PHI we receive in the future.

For questions about this notice, contact us at [CONTACT_EMAIL].`
};

export const LegalStep: React.FC<LegalStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const termsRef = useRef<HTMLInputElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);
  const hipaaRef = useRef<HTMLInputElement>(null);
  
  const [editingTemplates, setEditingTemplates] = useState(false);
  const [templateContent, setTemplateContent] = useState({
    termsConditions: data.templateContent?.termsConditions || defaultTemplates.termsConditions,
    privacyPolicy: data.templateContent?.privacyPolicy || defaultTemplates.privacyPolicy,
    hipaaCompliance: data.templateContent?.hipaaCompliance || defaultTemplates.hipaaCompliance,
  });

  const handleFileUpload = (type: 'termsConditions' | 'privacyPolicy' | 'hipaaCompliance', file: File) => {
    onUpdate({ ...data, [type]: file });
  };

  const handleSaveTemplates = () => {
    onUpdate({ 
      ...data, 
      templateContent: templateContent 
    });
    setEditingTemplates(false);
  };

  const handleTemplateChange = (type: keyof typeof templateContent, content: string) => {
    setTemplateContent(prev => ({
      ...prev,
      [type]: content
    }));
  };

  const FileUploadCard = ({ 
    title, 
    description, 
    icon: Icon, 
    file, 
    onUpload, 
    inputRef 
  }: {
    title: string;
    description: string;
    icon: any;
    file: File | null;
    onUpload: (file: File) => void;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <Card className="p-6 border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
      <div className="text-center">
        <Icon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{description}</p>
        
        {file ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <FileText size={16} />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Replace File
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="mb-2"
          >
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="hidden"
        />
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Legal Documents</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your legal documents or use our compliant templates to ensure your platform meets all regulatory requirements.
        </p>
      </div>

      <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">Use Template Documents</h3>
              <p className="text-sm text-slate-600">
                Start with our pre-approved, compliant legal templates
              </p>
            </div>
          </div>
          <Switch
            checked={data.useTemplates}
            onCheckedChange={(checked) => onUpdate({ ...data, useTemplates: checked })}
          />
        </div>
      </Card>

      {data.useTemplates ? (
        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-green-50/50 backdrop-blur-sm border-green-200">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Templates Selected</h3>
              <p className="text-green-700 mb-4">
                We'll automatically include our compliant legal templates for your platform:
              </p>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">HIPAA-compliant Terms & Conditions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">Healthcare Privacy Policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">HIPAA Compliance Notice</span>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-4 mb-4">
                These templates are regularly updated to maintain compliance with current regulations.
              </p>
              
              <Button
                onClick={() => setEditingTemplates(true)}
                variant="outline"
                className="mt-4"
              >
                <Edit size={16} className="mr-2" />
                Edit Templates
              </Button>
            </div>
          </Card>

          {editingTemplates && (
            <Card className="p-6 shadow-lg border-0 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Edit Template Documents</h3>
                <Button
                  onClick={() => setEditingTemplates(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="terms-template" className="text-base font-medium text-slate-700 mb-2 block">
                    Terms & Conditions Template
                  </Label>
                  <Textarea
                    id="terms-template"
                    value={templateContent.termsConditions}
                    onChange={(e) => handleTemplateChange('termsConditions', e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                    placeholder="Enter your terms and conditions..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="privacy-template" className="text-base font-medium text-slate-700 mb-2 block">
                    Privacy Policy Template
                  </Label>
                  <Textarea
                    id="privacy-template"
                    value={templateContent.privacyPolicy}
                    onChange={(e) => handleTemplateChange('privacyPolicy', e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                    placeholder="Enter your privacy policy..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="hipaa-template" className="text-base font-medium text-slate-700 mb-2 block">
                    HIPAA Compliance Notice Template
                  </Label>
                  <Textarea
                    id="hipaa-template"
                    value={templateContent.hipaaCompliance}
                    onChange={(e) => handleTemplateChange('hipaaCompliance', e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                    placeholder="Enter your HIPAA compliance notice..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setEditingTemplates(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTemplates}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save size={16} className="mr-2" />
                    Save Templates
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FileUploadCard
            title="Terms & Conditions"
            description="Your platform's terms of service and user agreement"
            icon={Scale}
            file={data.termsConditions}
            onUpload={(file) => handleFileUpload('termsConditions', file)}
            inputRef={termsRef}
          />
          
          <FileUploadCard
            title="Privacy Policy"
            description="How you collect, use, and protect user data"
            icon={Shield}
            file={data.privacyPolicy}
            onUpload={(file) => handleFileUpload('privacyPolicy', file)}
            inputRef={privacyRef}
          />
          
          <FileUploadCard
            title="HIPAA Compliance"
            description="Healthcare data protection and compliance notice"
            icon={FileText}
            file={data.hipaaCompliance}
            onUpload={(file) => handleFileUpload('hipaaCompliance', file)}
            inputRef={hipaaRef}
          />
        </div>
      )}

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Legal Compliance Notice</p>
            <p>
              Healthcare platforms must comply with HIPAA, state regulations, and other applicable laws. 
              Our templates are designed to meet standard requirements, but we recommend having them 
              reviewed by legal counsel for your specific use case.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          className="h-12 px-6"
        >
          <ChevronLeft size={16} className="mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};
