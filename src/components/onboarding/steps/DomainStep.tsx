
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Globe, Search, ExternalLink, Copy, Check, HelpCircle, AlertCircle, CheckCircle2, Shield, Zap, Settings, Clock, Edit2, Mail } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Domain } from '../types';

interface DomainStepProps {
  data: Domain;
  businessName: string;
  onUpdate: (data: Domain) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DomainStep: React.FC<DomainStepProps> = ({
  data,
  businessName,
  onUpdate,
  onNext,
  onPrev
}) => {
  // State management for different domain setup flows
  const [domainSearch, setDomainSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ domain: string; available: boolean; price: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDNSInstructions, setShowDNSInstructions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<'pending' | 'verified' | 'failed' | 'propagating'>('pending');
  const [selectedOption, setSelectedOption] = useState<'purchase' | 'existing' | 'subdomain'>(
    data.domainOption === 'custom' ? 'existing' : data.domainOption === 'subdomain' ? 'subdomain' : 'purchase'
  );
  const [setupMethod, setSetupMethod] = useState<'auto' | 'manual'>('auto');
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null);
  
  // New state for tracking setup progress and completion
  const [isSubdomainConfigured, setIsSubdomainConfigured] = useState(false);
  const [isDomainPurchased, setIsDomainPurchased] = useState(false);
  const [isExistingDomainVerified, setIsExistingDomainVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPlatformLaunched, setIsPlatformLaunched] = useState(false);
  const [selectedDomainToPurchase, setSelectedDomainToPurchase] = useState<string>('');
  const [purchasedDomain, setPurchasedDomain] = useState<string>('');

  const generateSubdomain = () => {
    const cleaned = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned.substring(0, 15);
  };

  const handleDomainSearch = async () => {
    if (!domainSearch.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        { domain: `${domainSearch}.com`, available: true, price: '$12.99/year' },
        { domain: `${domainSearch}.net`, available: true, price: '$14.99/year' },
        { domain: `${domainSearch}.org`, available: false, price: 'Not available' },
        { domain: `${domainSearch}.io`, available: true, price: '$49.99/year' },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionSelect = (option: 'purchase' | 'existing' | 'subdomain') => {
    setSelectedOption(option);
    const domainOption = option === 'existing' ? 'custom' : option === 'subdomain' ? 'subdomain' : 'purchase';
    onUpdate({ ...data, domainOption });
  };

  // Subdomain configuration handler
  const handleSubdomainConfigure = () => {
    const subdomainValue = data.subdomain || generateSubdomain();
    onUpdate({ ...data, subdomain: subdomainValue });
    setIsSubdomainConfigured(true);
  };

  // Domain purchase handler
  const handleDomainPurchase = (domain: string) => {
    setSelectedDomainToPurchase(domain);
    setPurchasedDomain(domain);
    setIsDomainPurchased(true);
    setDnsStatus('propagating');
    onUpdate({ ...data, customDomain: domain });
  };

  // Domain verification handler
  const handleDomainVerification = async () => {
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        setDnsStatus('verified');
        setIsExistingDomainVerified(true);
      } else {
        setDnsStatus('failed');
      }
      setIsVerifying(false);
    }, 2000);
  };

  const handleProviderConnect = async (providerId: string) => {
    setConnectedProvider(providerId);
    setDnsStatus('verified');
    setIsExistingDomainVerified(true);
  };

  const dnsRecords = [
    { type: 'A', name: '@', value: '185.158.133.1' },
    { type: 'A', name: 'www', value: '185.158.133.1' },
  ];

  const domainProviders = [
    { id: 'godaddy', name: 'GoDaddy', logo: '🌐', color: 'bg-green-600' },
    { id: 'namecheap', name: 'Namecheap', logo: '🔶', color: 'bg-orange-500' },
    { id: 'google', name: 'Google Domains', logo: '🌍', color: 'bg-blue-600' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 size={12} className="mr-1" />Live</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock size={12} className="mr-1" />Pending Activation</Badge>;
      case 'awaiting':
        return <Badge variant="default" className="bg-gray-100 text-gray-800 border-gray-200"><AlertCircle size={12} className="mr-1" />Awaiting DNS Update</Badge>;
      case 'propagating':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200"><Clock size={12} className="mr-1" />Propagation in progress</Badge>;
      default:
        return null;
    }
  };

  const getDomainUrl = () => {
    if (selectedOption === 'subdomain') {
      return `${data.subdomain || generateSubdomain()}.hyrhealth.com`;
    } else if (selectedOption === 'purchase' && purchasedDomain) {
      return purchasedDomain;
    } else if (selectedOption === 'existing' && data.customDomain) {
      return data.customDomain;
    }
    return '';
  };

  const getCustomerPortalUrl = () => `https://${getDomainUrl()}`;
  const getMerchantPortalUrl = () => `https://${getDomainUrl()}/admin`;

  // Check if we're in post-launch state
  if (isPlatformLaunched) {
    return (
      <TooltipProvider>
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Domain Setup Complete</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your domain configuration has been completed successfully.
            </p>
          </div>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Your domain setup is complete</h3>
                <p className="text-slate-600">Your platform is now accessible at the following URLs:</p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Domain:</span>
                  <span className="text-sm font-bold text-slate-900">{getDomainUrl()}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Status:</span>
                  {getStatusBadge('live')}
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => window.open(getCustomerPortalUrl(), '_blank')}
                  >
                    <span>Customer Portal</span>
                    <ExternalLink size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => window.open(getMerchantPortalUrl(), '_blank')}
                  >
                    <span>Merchant Portal</span>
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <Mail size={16} className="inline mr-2" />
                  If you need to make changes to your domain settings, please contact support.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button onClick={onPrev} variant="outline" className="h-12 px-6">
              <ChevronLeft size={16} className="mr-2" />
              Previous
            </Button>
            <Button onClick={onNext} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Continue
            </Button>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Step 6: Connect Your Domain</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose how patients will access your platform. Select the option that works best for your business.
          </p>
        </div>

        {/* Show confirmation cards for completed setups */}
        {(isSubdomainConfigured || isDomainPurchased || isExistingDomainVerified) && (
          <div className="space-y-4">
            {/* Subdomain Confirmation */}
            {isSubdomainConfigured && selectedOption === 'subdomain' && (
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={24} className="text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Your subdomain has been set</h3>
                      <p className="text-sm text-green-700">{getDomainUrl()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge('live')}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsSubdomainConfigured(false)}
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between"
                    onClick={() => window.open(getCustomerPortalUrl(), '_blank')}
                  >
                    Customer Portal <ExternalLink size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between"
                    onClick={() => window.open(getMerchantPortalUrl(), '_blank')}
                  >
                    Merchant Portal <ExternalLink size={14} />
                  </Button>
                </div>
              </Card>
            )}

            {/* Purchase Domain Confirmation */}
            {isDomainPurchased && selectedOption === 'purchase' && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={24} className="text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Your domain purchase was successful</h3>
                      <p className="text-sm text-blue-700">{purchasedDomain}</p>
                    </div>
                  </div>
                  {getStatusBadge('propagating')}
                </div>
                
                <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Clock size={14} className="inline mr-2" />
                    DNS setup is in progress. This may take a few hours.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between text-gray-500"
                    disabled
                  >
                    Customer Portal {getStatusBadge('pending')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between"
                    onClick={() => window.open(getMerchantPortalUrl(), '_blank')}
                  >
                    Merchant Portal <ExternalLink size={14} />
                  </Button>
                </div>
              </Card>
            )}

            {/* Existing Domain Confirmation */}
            {isExistingDomainVerified && selectedOption === 'existing' && (
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={24} className="text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Domain verified successfully</h3>
                      <p className="text-sm text-green-700">{data.customDomain}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge('live')}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsExistingDomainVerified(false)}
                    >
                      Re-verify
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle2 size={14} className="inline mr-2" />
                    Your site will go live once you launch the platform.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between"
                    onClick={() => window.open(getCustomerPortalUrl(), '_blank')}
                  >
                    Customer Portal <ExternalLink size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between"
                    onClick={() => window.open(getMerchantPortalUrl(), '_blank')}
                  >
                    Merchant Portal <ExternalLink size={14} />
                  </Button>
                </div>
              </Card>
            )}

            {/* Manual DNS Setup Warning */}
            {selectedOption === 'existing' && setupMethod === 'manual' && !isExistingDomainVerified && data.customDomain && (
              <Card className="p-6 bg-amber-50 border-amber-200">
                <div className="flex items-center space-x-3">
                  <AlertCircle size={24} className="text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-amber-900">Please add the following DNS records</h3>
                    <p className="text-sm text-amber-700">Update these records in your domain provider to complete setup.</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  {dnsRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="text-sm font-mono">
                        <span className="font-medium text-amber-800">{record.type}</span>
                        <span className="mx-2 text-slate-400">|</span>
                        <span className="text-slate-600">{record.name}</span>
                        <span className="mx-2 text-slate-400">→</span>
                        <span className="text-slate-800">{record.value}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(record.value)}
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between text-gray-500"
                    disabled
                  >
                    Customer Portal {getStatusBadge('awaiting')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-between"
                    onClick={() => window.open(getMerchantPortalUrl(), '_blank')}
                  >
                    Merchant Portal <ExternalLink size={14} />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Domain Setup Options - Only show if no domain is configured */}
        {!isSubdomainConfigured && !isDomainPurchased && !isExistingDomainVerified && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  id: 'subdomain',
                  title: 'Use HyrHealth Subdomain',
                  description: 'Use a free subdomain powered by HyrHealth.',
                  icon: <CheckCircle2 className="h-6 w-6 text-purple-600" />,
                  recommended: true,
                  benefits: ['Free forever', 'SSL included', 'Instant setup']
                },
                {
                  id: 'purchase',
                  title: 'Purchase a New Domain',
                  description: "Don't have a domain? You can buy one from us.",
                  icon: <Globe className="h-6 w-6 text-blue-600" />,
                  recommended: false,
                  benefits: ['Full ownership', 'Professional appearance', 'SEO benefits']
                },
                {
                  id: 'existing',
                  title: 'Connect Existing Domain',
                  description: 'Already have a domain? Connect it here.',
                  icon: <ExternalLink className="h-6 w-6 text-green-600" />,
                  recommended: false,
                  benefits: ['Use your existing domain', 'Auto-setup available', 'Keep your brand']
                },
              ].map((option) => (
                <Card
                  key={option.id}
                  className={`relative p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => handleOptionSelect(option.id as any)}
                >
                  {option.recommended && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {option.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {selectedOption === option.id && (
                        <Check size={12} className="text-white m-0.5" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Dynamic Form Based on Selection */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              {selectedOption === 'subdomain' && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Use HyrHealth Subdomain</h3>
                    <p className="text-slate-600">Quick and easy setup with instant SSL and no DNS configuration needed</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subdomain" className="text-sm font-medium text-slate-700 mb-2 block">
                        Choose your subdomain
                      </Label>
                      <div className="flex items-center max-w-md">
                        <Input
                          id="subdomain"
                          placeholder={generateSubdomain()}
                          value={data.subdomain}
                          onChange={(e) => onUpdate({ ...data, subdomain: e.target.value })}
                          className="rounded-r-none border-r-0"
                        />
                        <div className="px-3 py-2 bg-slate-50 border border-l-0 rounded-r-md text-slate-600 text-sm">
                          .hyrhealth.com
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-green-800">✓ Free forever</div>
                        <div className="text-sm font-medium text-green-800">✓ SSL certificate included</div>
                        <div className="text-sm font-medium text-green-800">✓ Instant setup</div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSubdomainConfigure}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Continue with Subdomain
                    </Button>
                  </div>
                </div>
              )}

              {selectedOption === 'purchase' && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Purchase a New Domain</h3>
                    <p className="text-slate-600">Find and register the perfect domain for your business</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <Input
                        placeholder="Enter your desired domain name"
                        value={domainSearch}
                        onChange={(e) => setDomainSearch(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                      />
                      <Button 
                        onClick={handleDomainSearch} 
                        disabled={isSearching || !domainSearch.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSearching ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <Search size={16} className="mr-2" />
                        )}
                        {isSearching ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-800">Available Domains</h4>
                        {searchResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <Globe size={16} className="text-slate-500" />
                              <span className="font-medium text-slate-800">{result.domain}</span>
                              {!result.available && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                  Unavailable
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-slate-600 font-medium">{result.price}</span>
                              <Button
                                size="sm"
                                disabled={!result.available}
                                onClick={() => handleDomainPurchase(result.domain)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {result.available ? 'Purchase' : 'Unavailable'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedOption === 'existing' && (
                <div className="space-y-6">
                  <div className="border-b pb-4 flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-slate-800">Connect Existing Domain</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle size={16} className="text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose auto-setup for supported providers or manual setup</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="existing-domain" className="text-sm font-medium text-slate-700 mb-2 block">
                        Enter your domain
                      </Label>
                      <Input
                        id="existing-domain"
                        placeholder="www.myclinic.com"
                        value={data.customDomain}
                        onChange={(e) => onUpdate({ ...data, customDomain: e.target.value })}
                        className="max-w-md"
                      />
                    </div>
                    
                    {data.customDomain && (
                      <div className="space-y-6">
                        {/* Setup Method Selection */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-slate-800">Choose Setup Method</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <Card
                              className={`p-4 cursor-pointer transition-all border-2 ${
                                setupMethod === 'auto'
                                  ? 'border-blue-500 bg-blue-50/50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => setSetupMethod('auto')}
                            >
                              <div className="flex items-center space-x-3">
                                <Zap className="h-5 w-5 text-blue-600" />
                                <div>
                                  <h5 className="font-medium text-slate-800">Auto-Setup</h5>
                                  <p className="text-sm text-slate-600">Connect in under 2 minutes</p>
                                </div>
                              </div>
                            </Card>
                            <Card
                              className={`p-4 cursor-pointer transition-all border-2 ${
                                setupMethod === 'manual'
                                  ? 'border-blue-500 bg-blue-50/50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => setSetupMethod('manual')}
                            >
                              <div className="flex items-center space-x-3">
                                <Settings className="h-5 w-5 text-slate-600" />
                                <div>
                                  <h5 className="font-medium text-slate-800">Manual Setup</h5>
                                  <p className="text-sm text-slate-600">Configure DNS yourself</p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>

                        {setupMethod === 'auto' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Shield size={16} className="text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  Connect automatically with supported providers
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {domainProviders.map((provider) => (
                                <Card
                                  key={provider.id}
                                  className={`p-4 cursor-pointer transition-all border-2 ${
                                    connectedProvider === provider.id
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                  }`}
                                  onClick={() => handleProviderConnect(provider.id)}
                                >
                                  <div className="text-center space-y-2">
                                    <div className={`w-12 h-12 rounded-full ${provider.color} flex items-center justify-center mx-auto text-white text-xl`}>
                                      {provider.logo}
                                    </div>
                                    <h5 className="font-medium text-slate-800">{provider.name}</h5>
                                    {connectedProvider === provider.id ? (
                                      <div className="flex items-center justify-center space-x-1 text-green-600">
                                        <CheckCircle2 size={14} />
                                        <span className="text-xs">Connected</span>
                                      </div>
                                    ) : (
                                      <Button size="sm" variant="outline" className="w-full">
                                        Connect
                                      </Button>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                            
                            <div className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSetupMethod('manual')}
                                className="text-slate-600"
                              >
                                Don't see your provider? Use manual setup
                              </Button>
                            </div>
                          </div>
                        )}

                        {setupMethod === 'manual' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-3">DNS Configuration Required</h4>
                              <p className="text-sm text-blue-700 mb-4">
                                Add these DNS records in your domain provider's dashboard:
                              </p>
                              <div className="space-y-2">
                                {dnsRecords.map((record, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                                    <div className="text-sm font-mono">
                                      <span className="font-medium text-blue-800">{record.type}</span>
                                      <span className="mx-2 text-slate-400">|</span>
                                      <span className="text-slate-600">{record.name}</span>
                                      <span className="mx-2 text-slate-400">→</span>
                                      <span className="text-slate-800">{record.value}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(record.value)}
                                    >
                                      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-blue-600 mt-3">
                                💡 DNS changes may take up to 24-48 hours to propagate globally.
                              </p>
                            </div>
                            
                            <Button 
                              onClick={handleDomainVerification}
                              disabled={isVerifying}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isVerifying ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                  Verifying...
                                </>
                              ) : (
                                'Verify Domain'
                              )}
                            </Button>

                            {dnsStatus === 'failed' && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">
                                  <AlertCircle size={14} className="inline mr-2" />
                                  Domain verification failed. Please check your DNS records and try again.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Info Message */}
        <div className="text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center">
            <Mail size={14} className="mr-2" />
            You'll also receive an email once your platform is live.
          </p>
        </div>

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
            disabled={!isSubdomainConfigured && !isDomainPurchased && !isExistingDomainVerified}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
