
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

  const isValid = data.businessName && data.businessType && data.platformPurpose.length > 0 && 
                   data.supportEmail && data.supportPhone && data.phoneSupportHours &&
                   data.personalAddress?.street && data.personalAddress?.city && 
                   data.personalAddress?.state && data.personalAddress?.zipCode &&
                   (data.businessAddressSameAsPersonal || 
                    (data.businessAddress?.street && data.businessAddress?.city && 
                     data.businessAddress?.state && data.businessAddress?.zipCode));

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

          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Support Contact Information</h3>
              <p className="text-sm text-slate-600 mb-6">
                This information will be displayed to your customers for support inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supportEmail" className="text-sm font-medium text-slate-700">
                  Support Email *
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="support@yourbusiness.com"
                  value={data.supportEmail}
                  onChange={(e) => onUpdate({ ...data, supportEmail: e.target.value })}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportPhone" className="text-sm font-medium text-slate-700">
                  Support Phone *
                </Label>
                <Input
                  id="supportPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={data.supportPhone}
                  onChange={(e) => onUpdate({ ...data, supportPhone: e.target.value })}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneSupportHours" className="text-sm font-medium text-slate-700">
                Phone Support Hours *
              </Label>
              <Input
                id="phoneSupportHours"
                placeholder="Monday - Friday, 9:00 AM - 5:00 PM EST"
                value={data.phoneSupportHours}
                onChange={(e) => onUpdate({ ...data, phoneSupportHours: e.target.value })}
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Example: "Monday - Friday, 9:00 AM - 6:00 PM EST" or "24/7 Support Available"
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Address Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-slate-700 mb-4">Personal Address *</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="personalStreet" className="text-sm font-medium text-slate-700">
                      Street Address
                    </Label>
                    <Input
                      id="personalStreet"
                      placeholder="123 Main Street"
                      value={data.personalAddress?.street || ''}
                      onChange={(e) => onUpdate({ 
                        ...data, 
                        personalAddress: { ...data.personalAddress, street: e.target.value }
                      })}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personalCity" className="text-sm font-medium text-slate-700">
                      City
                    </Label>
                    <Input
                      id="personalCity"
                      placeholder="New York"
                      value={data.personalAddress?.city || ''}
                      onChange={(e) => onUpdate({ 
                        ...data, 
                        personalAddress: { ...data.personalAddress, city: e.target.value }
                      })}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personalState" className="text-sm font-medium text-slate-700">
                      State
                    </Label>
                    <Input
                      id="personalState"
                      placeholder="NY"
                      value={data.personalAddress?.state || ''}
                      onChange={(e) => onUpdate({ 
                        ...data, 
                        personalAddress: { ...data.personalAddress, state: e.target.value }
                      })}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personalZip" className="text-sm font-medium text-slate-700">
                      ZIP Code
                    </Label>
                    <Input
                      id="personalZip"
                      placeholder="10001"
                      value={data.personalAddress?.zipCode || ''}
                      onChange={(e) => onUpdate({ 
                        ...data, 
                        personalAddress: { ...data.personalAddress, zipCode: e.target.value }
                      })}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-700">
                  Is Business Address same as Personal Address? *
                </Label>
                <RadioGroup
                  value={data.businessAddressSameAsPersonal ? "yes" : "no"}
                  onValueChange={(value) => onUpdate({ 
                    ...data, 
                    businessAddressSameAsPersonal: value === "yes"
                  })}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="address-same-yes" />
                    <Label htmlFor="address-same-yes" className="text-sm font-medium text-slate-700">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="address-same-no" />
                    <Label htmlFor="address-same-no" className="text-sm font-medium text-slate-700">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {!data.businessAddressSameAsPersonal && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-slate-700 mb-4">Business Address *</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="businessStreet" className="text-sm font-medium text-slate-700">
                        Street Address
                      </Label>
                      <Input
                        id="businessStreet"
                        placeholder="456 Business Avenue"
                        value={data.businessAddress?.street || ''}
                        onChange={(e) => onUpdate({ 
                          ...data, 
                          businessAddress: { ...data.businessAddress, street: e.target.value }
                        })}
                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessCity" className="text-sm font-medium text-slate-700">
                        City
                      </Label>
                      <Input
                        id="businessCity"
                        placeholder="New York"
                        value={data.businessAddress?.city || ''}
                        onChange={(e) => onUpdate({ 
                          ...data, 
                          businessAddress: { ...data.businessAddress, city: e.target.value }
                        })}
                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessState" className="text-sm font-medium text-slate-700">
                        State
                      </Label>
                      <Input
                        id="businessState"
                        placeholder="NY"
                        value={data.businessAddress?.state || ''}
                        onChange={(e) => onUpdate({ 
                          ...data, 
                          businessAddress: { ...data.businessAddress, state: e.target.value }
                        })}
                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessZip" className="text-sm font-medium text-slate-700">
                        ZIP Code
                      </Label>
                      <Input
                        id="businessZip"
                        placeholder="10001"
                        value={data.businessAddress?.zipCode || ''}
                        onChange={(e) => onUpdate({ 
                          ...data, 
                          businessAddress: { ...data.businessAddress, zipCode: e.target.value }
                        })}
                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
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
