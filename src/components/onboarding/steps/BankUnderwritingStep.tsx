import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, CreditCard, Upload, AlertCircle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BankUnderwriting } from '../types';

interface BankUnderwritingStepProps {
  data: BankUnderwriting;
  onUpdate: (data: BankUnderwriting) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const BankUnderwritingStep: React.FC<BankUnderwritingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdate({ ...data, idUpload: file });
    }
  };

  const isValid = data.businessName && data.authorizedRepName && data.dateOfBirth && 
                   data.businessAddress && data.termsAccepted;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">💳 Bank Verification for Payments</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We need to verify your business details to enable payments and payouts.
        </p>
      </div>

      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-medium text-slate-700">
                Business Name *
              </Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={data.businessName}
                onChange={(e) => onUpdate({ ...data, businessName: e.target.value })}
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="ein" className="text-sm font-medium text-slate-700">
                  EIN (Optional)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Employer Identification Number - Federal tax ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="ein"
                placeholder="12-3456789"
                value={data.ein}
                onChange={(e) => onUpdate({ ...data, ein: e.target.value })}
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="authorizedRepName" className="text-sm font-medium text-slate-700">
                Authorized Representative Name *
              </Label>
              <Input
                id="authorizedRepName"
                placeholder="Full legal name"
                value={data.authorizedRepName}
                onChange={(e) => onUpdate({ ...data, authorizedRepName: e.target.value })}
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => onUpdate({ ...data, dateOfBirth: e.target.value })}
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress" className="text-sm font-medium text-slate-700">
              Business Address *
            </Label>
            <Textarea
              id="businessAddress"
              placeholder="Enter your complete business address"
              value={data.businessAddress}
              onChange={(e) => onUpdate({ ...data, businessAddress: e.target.value })}
              className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              ID Upload (if required)
            </Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  Upload a government-issued ID if required for verification
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="idUpload"
                />
                <label
                  htmlFor="idUpload"
                  className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Choose File
                </label>
                {data.idUpload && (
                  <p className="text-sm text-green-600">✅ {data.idUpload.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="termsAccepted"
                checked={data.termsAccepted}
                onCheckedChange={(checked) => onUpdate({ ...data, termsAccepted: !!checked })}
              />
              <div className="space-y-1">
                <label htmlFor="termsAccepted" className="text-sm font-medium text-slate-700 cursor-pointer">
                  I accept the Terms and Conditions *
                </label>
                <p className="text-xs text-slate-500">
                  By checking this box, you agree to our payment processing terms and bank verification requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="eSignCompleted"
                checked={data.eSignCompleted}
                onCheckedChange={(checked) => onUpdate({ ...data, eSignCompleted: !!checked })}
              />
              <label htmlFor="eSignCompleted" className="text-sm font-medium text-slate-700 cursor-pointer">
                Complete E-Signature Process
              </label>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Verification Process</h4>
                <p className="text-sm text-blue-700">
                  We'll now process your verification in the background. You'll get a demo site preview 
                  while we complete setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between max-w-2xl mx-auto">
        <Button variant="outline" onClick={onPrev} className="flex items-center space-x-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!isValid}
          className="flex items-center space-x-2"
        >
          <span>Complete Setup</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};