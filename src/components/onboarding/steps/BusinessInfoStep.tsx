
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BusinessInfo } from '../types';

interface BusinessInfoStepProps {
  data: BusinessInfo;
  onUpdate: (data: BusinessInfo) => void;
  onNext: () => void;
}

const businessTypes = [
  'Gym',
  'Wellness Center',
  'Medical Clinic',
  'Peptide Therapy',
  'Anti-Aging'
];

const platformPurposes = [
  'Weight Loss',
  'Peptides', 
  'Hormone Therapy',
  'Wellness',
  'Anti-Aging'
];

export const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const handlePurposeToggle = (purpose: string, checked: boolean) => {
    const updatedPurposes = checked
      ? [...data.platformPurpose, purpose]
      : data.platformPurpose.filter(p => p !== purpose);
    
    onUpdate({ ...data, platformPurpose: updatedPurposes });
  };

  const isValid = data.businessName && data.businessType && data.platformPurpose.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Tell us about your business</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Let's start by understanding your business so we can create the perfect platform for you.
        </p>
      </div>

      <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <div className="space-y-6">
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
            <Label className="text-sm font-medium text-slate-700">
              Business Type *
            </Label>
            <Select
              value={data.businessType}
              onValueChange={(value) => onUpdate({ ...data, businessType: value })}
            >
              <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-slate-700">
              Platform Purpose * (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {platformPurposes.map((purpose) => (
                <div key={purpose} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <Checkbox
                    id={purpose}
                    checked={data.platformPurpose.includes(purpose)}
                    onCheckedChange={(checked) => handlePurposeToggle(purpose, checked as boolean)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={purpose}
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    {purpose}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
