import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, Plus, Minus, Building, User, CreditCard, Settings, CheckCircle, FileText } from 'lucide-react';
import { BankVerification } from '../types';

interface BankVerificationStepProps {
  data: BankVerification;
  onUpdate: (data: BankVerification) => void;
  onNext: () => void;
  onPrev: () => void;
  prefillData?: {
    firstName: string;
    lastName: string;
    businessName: string;
    businessPhone: string;
    businessEmail: string;
  };
}

export const BankVerificationStep: React.FC<BankVerificationStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  prefillData
}) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    const parentData = data[parent as keyof BankVerification] as any;
    onUpdate({
      ...data,
      [parent]: { ...parentData, [field]: value }
    });
  };

  const handleArrayChange = (field: string, index: number, value: any) => {
    const array = [...(data[field as keyof BankVerification] as any[])];
    array[index] = value;
    onUpdate({ ...data, [field]: array });
  };

  const addOtherOwner = () => {
    const newOwners = [...data.otherOwners, { name: '', ownershipPercentage: 0 }];
    onUpdate({ ...data, otherOwners: newOwners });
  };

  const removeOtherOwner = (index: number) => {
    const newOwners = data.otherOwners.filter((_, i) => i !== index);
    onUpdate({ ...data, otherOwners: newOwners });
  };

  const handleFileUpload = (field: string, file: File | File[]) => {
    onUpdate({ ...data, [field]: file });
  };

  const calculateProgress = () => {
    let completed = 0;
    let total = 0;

    // Personal Info
    total += 8;
    if (data.firstName) completed++;
    if (data.lastName) completed++;
    if (data.dateOfBirth) completed++;
    if (data.ssn) completed++;
    if (data.ownershipPercentage) completed++;
    if (data.contactPhone) completed++;
    if (data.contactEmail) completed++;
    if (data.address.street) completed++;

    // Business Info
    total += 8;
    if (data.ownershipType) completed++;
    if (data.legalBusinessName) completed++;
    if (data.taxId) completed++;
    if (data.businessType) completed++;
    if (data.premiseType) completed++;
    if (data.yearsInBusiness) completed++;
    if (data.businessWebsite) completed++;
    if (data.businessAddress.street) completed++;

    // Bank Info
    total += 3;
    if (data.bankName) completed++;
    if (data.routingNumber) completed++;
    if (data.accountNumber) completed++;

    // Processing Info
    total += 6;
    if (data.maxMonthlySales) completed++;
    if (data.avgTransaction) completed++;
    if (data.highestTransaction) completed++;
    if (data.processingMethods.length) completed++;
    completed += 2; // boolean fields count as complete

    // Documents
    total += 3;
    if (data.driverLicense) completed++;
    if (data.bankStatements.length >= 3) completed++;
    if (data.incorporationDocs) completed++;

    return Math.round((completed / total) * 100);
  };

  const isValid = () => {
    return data.firstName && data.lastName && data.dateOfBirth && data.ssn &&
           data.legalBusinessName && data.taxId && data.bankName && 
           data.routingNumber && data.accountNumber && data.driverLicense &&
           data.bankStatements.length >= 3 && data.incorporationDocs;
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">RevitPay Pre-Application</h1>
        <p className="text-slate-600 text-lg">Complete your bank verification to enable payment processing</p>
        
        <div className="mt-6">
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-slate-500 mt-2">{progress}% Complete</p>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</Label>
              <Input
                id="firstName"
                value={prefillData?.firstName || data.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!!prefillData?.firstName}
                className={`mt-1 ${prefillData?.firstName ? 'bg-slate-50 text-slate-500' : ''}`}
              />
              {prefillData?.firstName && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Pre-filled from business info
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</Label>
              <Input
                id="lastName"
                value={prefillData?.lastName || data.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!!prefillData?.lastName}
                className={`mt-1 ${prefillData?.lastName ? 'bg-slate-50 text-slate-500' : ''}`}
              />
              {prefillData?.lastName && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Pre-filled from business info
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ssn" className="text-sm font-medium text-slate-700">Social Security Number</Label>
              <Input
                id="ssn"
                type="password"
                value={data.ssn}
                onChange={(e) => handleInputChange('ssn', e.target.value)}
                placeholder="XXX-XX-XXXX"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownershipPercentage" className="text-sm font-medium text-slate-700">Ownership Percentage</Label>
              <Input
                id="ownershipPercentage"
                type="number"
                min="0"
                max="100"
                value={data.ownershipPercentage}
                onChange={(e) => handleInputChange('ownershipPercentage', parseInt(e.target.value))}
                placeholder="25"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="text-sm font-medium text-slate-700">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={prefillData?.businessPhone || data.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                disabled={!!prefillData?.businessPhone}
                className={`mt-1 ${prefillData?.businessPhone ? 'bg-slate-50 text-slate-500' : ''}`}
              />
              {prefillData?.businessPhone && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Pre-filled from business info
                </p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="contactEmail" className="text-sm font-medium text-slate-700">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={prefillData?.businessEmail || data.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              disabled={!!prefillData?.businessEmail}
              className={`mt-1 ${prefillData?.businessEmail ? 'bg-slate-50 text-slate-500' : ''}`}
            />
            {prefillData?.businessEmail && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Pre-filled from business info
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">Address</h3>
          <div>
            <Label htmlFor="street" className="text-sm font-medium text-slate-700">Street Address</Label>
            <Input
              id="street"
              value={data.address.street}
              onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-slate-700">City</Label>
              <Input
                id="city"
                value={data.address.city}
                onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-slate-700">State</Label>
              <Input
                id="state"
                value={data.address.state}
                onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">ZIP Code</Label>
              <Input
                id="zipCode"
                value={data.address.zipCode}
                onChange={(e) => handleNestedChange('address', 'zipCode', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* ID Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">ID Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="idType" className="text-sm font-medium text-slate-700">ID Type</Label>
              <Select value={data.idDetails.idType} onValueChange={(value) => handleNestedChange('idDetails', 'idType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drivers-license">Driver's License</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="state-id">State ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="idNumber" className="text-sm font-medium text-slate-700">ID Number</Label>
              <Input
                id="idNumber"
                value={data.idDetails.idNumber}
                onChange={(e) => handleNestedChange('idDetails', 'idNumber', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expirationDate" className="text-sm font-medium text-slate-700">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={data.idDetails.expirationDate}
                onChange={(e) => handleNestedChange('idDetails', 'expirationDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Other Owners */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="hasOtherOwners"
              checked={data.hasOtherOwners}
              onCheckedChange={(checked) => handleInputChange('hasOtherOwners', checked)}
            />
            <Label htmlFor="hasOtherOwners" className="text-sm font-medium text-slate-700">Does the business have other owners?</Label>
          </div>

          {data.hasOtherOwners && (
            <div className="space-y-3 pl-4 border-l-2 border-slate-200">
              {data.otherOwners.map((owner, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Owner name"
                    value={owner.name}
                    onChange={(e) => handleArrayChange('otherOwners', index, { ...owner, name: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Ownership %"
                    min="0"
                    max="100"
                    value={owner.ownershipPercentage}
                    onChange={(e) => handleArrayChange('otherOwners', index, { ...owner, ownershipPercentage: parseInt(e.target.value) })}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOtherOwner(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addOtherOwner}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Owner
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Business Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Business Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownershipType" className="text-sm font-medium text-slate-700">Type of Ownership</Label>
              <Select value={data.ownershipType} onValueChange={(value) => handleInputChange('ownershipType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="s-corp">S-Corporation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="legalBusinessName" className="text-sm font-medium text-slate-700">Legal Business Name</Label>
              <Input
                id="legalBusinessName"
                value={prefillData?.businessName || data.legalBusinessName}
                onChange={(e) => handleInputChange('legalBusinessName', e.target.value)}
                disabled={!!prefillData?.businessName}
                className={`mt-1 ${prefillData?.businessName ? 'bg-slate-50 text-slate-500' : ''}`}
              />
              {prefillData?.businessName && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Pre-filled from business info
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dbaName" className="text-sm font-medium text-slate-700">DBA Name (if different)</Label>
              <Input
                id="dbaName"
                value={data.dbaName}
                onChange={(e) => handleInputChange('dbaName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="taxId" className="text-sm font-medium text-slate-700">Tax ID (EIN)</Label>
              <Input
                id="taxId"
                value={data.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="XX-XXXXXXX"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessType" className="text-sm font-medium text-slate-700">Business Type</Label>
              <Select value={data.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="telehealth">Telehealth</SelectItem>
                  <SelectItem value="medical-devices">Medical Devices</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="premiseType" className="text-sm font-medium text-slate-700">Premise Type</Label>
              <Select value={data.premiseType} onValueChange={(value) => handleInputChange('premiseType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select premise type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical-location">Physical Location</SelectItem>
                  <SelectItem value="online-only">Online Only</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="home-based">Home-Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearsInBusiness" className="text-sm font-medium text-slate-700">Years in Business</Label>
              <Input
                id="yearsInBusiness"
                type="number"
                min="0"
                value={data.yearsInBusiness}
                onChange={(e) => handleInputChange('yearsInBusiness', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="businessWebsite" className="text-sm font-medium text-slate-700">Business Website</Label>
              <Input
                id="businessWebsite"
                type="url"
                value={data.businessWebsite}
                onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-900">Business Address</h3>
          </div>
          
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-slate-700">
                Is Business Address same as Personal Address? *
              </Label>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="address-same-yes"
                    name="businessAddressSameAsPersonal"
                    checked={data.businessAddressSameAsPersonal}
                    onChange={() => handleInputChange('businessAddressSameAsPersonal', true)}
                    className="text-blue-600"
                  />
                  <Label htmlFor="address-same-yes" className="text-sm font-medium text-slate-700">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="address-same-no"
                    name="businessAddressSameAsPersonal"
                    checked={!data.businessAddressSameAsPersonal}
                    onChange={() => handleInputChange('businessAddressSameAsPersonal', false)}
                    className="text-blue-600"
                  />
                  <Label htmlFor="address-same-no" className="text-sm font-medium text-slate-700">
                    No
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {!data.businessAddressSameAsPersonal && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessStreet" className="text-sm font-medium text-slate-700">Street Address</Label>
                <Input
                  id="businessStreet"
                  value={data.businessAddress.street}
                  onChange={(e) => handleNestedChange('businessAddress', 'street', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="businessCity" className="text-sm font-medium text-slate-700">City</Label>
                  <Input
                    id="businessCity"
                    value={data.businessAddress.city}
                    onChange={(e) => handleNestedChange('businessAddress', 'city', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="businessState" className="text-sm font-medium text-slate-700">State</Label>
                  <Input
                    id="businessState"
                    value={data.businessAddress.state}
                    onChange={(e) => handleNestedChange('businessAddress', 'state', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="businessZip" className="text-sm font-medium text-slate-700">ZIP Code</Label>
                  <Input
                    id="businessZip"
                    value={data.businessAddress.zipCode}
                    onChange={(e) => handleNestedChange('businessAddress', 'zipCode', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessPhone" className="text-sm font-medium text-slate-700">Business Phone</Label>
            <Input
              id="businessPhone"
              type="tel"
              value={prefillData?.businessPhone || data.businessPhone}
              onChange={(e) => handleInputChange('businessPhone', e.target.value)}
              disabled={!!prefillData?.businessPhone}
              className={`mt-1 ${prefillData?.businessPhone ? 'bg-slate-50 text-slate-500' : ''}`}
            />
            {prefillData?.businessPhone && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Pre-filled from business info
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="businessEmail" className="text-sm font-medium text-slate-700">Business Email</Label>
            <Input
              id="businessEmail"
              type="email"
              value={prefillData?.businessEmail || data.businessEmail}
              onChange={(e) => handleInputChange('businessEmail', e.target.value)}
              disabled={!!prefillData?.businessEmail}
              className={`mt-1 ${prefillData?.businessEmail ? 'bg-slate-50 text-slate-500' : ''}`}
            />
            {prefillData?.businessEmail && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Pre-filled from business info
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bank Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Bank Information</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="bankName" className="text-sm font-medium text-slate-700">Bank Name</Label>
            <Input
              id="bankName"
              value={data.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="routingNumber" className="text-sm font-medium text-slate-700">Routing Number</Label>
            <Input
              id="routingNumber"
              value={data.routingNumber}
              onChange={(e) => handleInputChange('routingNumber', e.target.value)}
              placeholder="9-digit routing number"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="accountNumber" className="text-sm font-medium text-slate-700">Account Number</Label>
            <Input
              id="accountNumber"
              type="password"
              value={data.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Processing Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Processing Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="currentlyProcessing"
              checked={data.currentlyProcessing}
              onCheckedChange={(checked) => handleInputChange('currentlyProcessing', checked)}
            />
            <Label htmlFor="currentlyProcessing" className="text-sm font-medium text-slate-700">Currently processing payments?</Label>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700">Processing Methods (select all that apply)</Label>
            <div className="space-y-2 mt-2">
              {['Credit Cards', 'Debit Cards', 'ACH', 'eCheck', 'Wire Transfer', 'Cash'].map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={method}
                    checked={data.processingMethods.includes(method)}
                    onChange={(e) => {
                      const methods = e.target.checked
                        ? [...data.processingMethods, method]
                        : data.processingMethods.filter(m => m !== method);
                      handleInputChange('processingMethods', methods);
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={method} className="text-sm text-slate-700">{method}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxMonthlySales" className="text-sm font-medium text-slate-700">Max Monthly Sales ($)</Label>
              <Input
                id="maxMonthlySales"
                type="number"
                min="0"
                value={data.maxMonthlySales}
                onChange={(e) => handleInputChange('maxMonthlySales', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="avgTransaction" className="text-sm font-medium text-slate-700">Average Transaction ($)</Label>
              <Input
                id="avgTransaction"
                type="number"
                min="0"
                value={data.avgTransaction}
                onChange={(e) => handleInputChange('avgTransaction', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="highestTransaction" className="text-sm font-medium text-slate-700">Highest Transaction ($)</Label>
              <Input
                id="highestTransaction"
                type="number"
                min="0"
                value={data.highestTransaction}
                onChange={(e) => handleInputChange('highestTransaction', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="fraudProtection"
                checked={data.fraudProtection}
                onCheckedChange={(checked) => handleInputChange('fraudProtection', checked)}
              />
              <Label htmlFor="fraudProtection" className="text-sm font-medium text-slate-700">Interested in fraud protection services?</Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="acceptACH"
                checked={data.acceptACH}
                onCheckedChange={(checked) => handleInputChange('acceptACH', checked)}
              />
              <Label htmlFor="acceptACH" className="text-sm font-medium text-slate-700">Accept ACH/eCheck payments?</Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="businessFundingInterest"
                checked={data.businessFundingInterest}
                onCheckedChange={(checked) => handleInputChange('businessFundingInterest', checked)}
              />
              <Label htmlFor="businessFundingInterest" className="text-sm font-medium text-slate-700">Interested in business funding options?</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Document Upload</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="driverLicense" className="text-sm font-medium text-slate-700">Driver's License</Label>
            <div className="mt-2 flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    id="driverLicense"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files && handleFileUpload('driverLicense', e.target.files[0])}
                    className="sr-only"
                  />
                  <label
                    htmlFor="driverLicense"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
                  >
                    Upload driver's license
                  </label>
                </div>
                {data.driverLicense && (
                  <p className="text-xs text-green-600 mt-1">✓ {data.driverLicense.name}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="bankStatements" className="text-sm font-medium text-slate-700">3 Months Bank Statements</Label>
            <div className="mt-2 flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    id="bankStatements"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload('bankStatements', Array.from(e.target.files))}
                    className="sr-only"
                  />
                  <label
                    htmlFor="bankStatements"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
                  >
                    Upload bank statements (3 months)
                  </label>
                </div>
                {data.bankStatements.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ {data.bankStatements.length} files uploaded</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="incorporationDocs" className="text-sm font-medium text-slate-700">Incorporation Documents</Label>
            <div className="mt-2 flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    id="incorporationDocs"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files && handleFileUpload('incorporationDocs', e.target.files[0])}
                    className="sr-only"
                  />
                  <label
                    htmlFor="incorporationDocs"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
                  >
                    Upload incorporation documents
                  </label>
                </div>
                {data.incorporationDocs && (
                  <p className="text-xs text-green-600 mt-1">✓ {data.incorporationDocs.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LegitScript Certification Question */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-800">LegitScript Certification</h3>
            <p className="text-orange-700">
              LegitScript certification helps build trust with customers and ensures compliance with healthcare regulations.
            </p>
            <div className="flex items-center space-x-3">
              <Switch
                id="wantsLegitScript"
                checked={data.wantsLegitScript}
                onCheckedChange={(checked) => handleInputChange('wantsLegitScript', checked)}
              />
              <Label htmlFor="wantsLegitScript" className="text-orange-800 font-medium">
                Would you like to apply for LegitScript certification?
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <div className="flex space-x-4">
          <Button variant="outline">
            Save as Draft
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!isValid()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
