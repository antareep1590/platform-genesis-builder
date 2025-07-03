
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Globe, Search, ExternalLink, Copy, Check, HelpCircle, AlertCircle, CheckCircle2, Shield, Zap, Settings } from 'lucide-react';
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
  const [domainSearch, setDomainSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ domain: string; available: boolean; price: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDNSInstructions, setShowDNSInstructions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [selectedOption, setSelectedOption] = useState<'purchase' | 'existing' | 'subdomain'>(data.domainOption === 'custom' ? 'existing' : data.domainOption === 'subdomain' ? 'subdomain' : 'purchase');
  const [setupMethod, setSetupMethod] = useState<'auto' | 'manual'>('auto');
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null);

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

  const dnsRecords = [
    { type: 'CNAME', name: 'www', value: 'app.hyrhealth.com' },
    { type: 'A', name: '@', value: '104.21.45.78' },
  ];

  const domainProviders = [
    { id: 'godaddy', name: 'GoDaddy', logo: '🌐', color: 'bg-green-600' },
    { id: 'namecheap', name: 'Namecheap', logo: '🔶', color: 'bg-orange-500' },
    { id: 'google', name: 'Google Domains', logo: '🌍', color: 'bg-blue-600' },
  ];

  const domainOptions = [
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
  ];

  const handleProviderConnect = async (providerId: string) => {
    // Simulate OAuth flow
    setConnectedProvider(providerId);
    setDnsStatus('verified');
    // In real implementation, this would trigger OAuth flow
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Step 6: Connect Your Domain</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose how patients will access your platform. Select the option that works best for your business.
          </p>
        </div>

        {/* Domain Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {domainOptions.map((option) => (
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
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {result.available ? 'Buy and Connect' : 'Unavailable'}
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
                              If your domain is with one of these providers, we can help you connect it automatically
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
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            {dnsStatus === 'pending' && <AlertCircle size={16} className="text-amber-500" />}
                            {dnsStatus === 'verified' && <CheckCircle2 size={16} className="text-green-500" />}
                            {dnsStatus === 'failed' && <AlertCircle size={16} className="text-red-500" />}
                            <span className={`text-sm font-medium ${
                              dnsStatus === 'pending' ? 'text-amber-600' : 
                              dnsStatus === 'verified' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              DNS Status: {dnsStatus === 'pending' ? 'Pending Verification' : 
                                          dnsStatus === 'verified' ? 'Verified' : 'Failed'}
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDNSInstructions(!showDNSInstructions)}
                        >
                          <ExternalLink size={16} className="mr-2" />
                          {showDNSInstructions ? 'Hide' : 'View'} DNS Setup Instructions
                        </Button>
                        
                        {showDNSInstructions && (
                          <Card className="p-4 bg-blue-50 border-blue-200">
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
                          </Card>
                        )}
                        
                        <Button className="bg-green-600 hover:bg-green-700">
                          Verify and Connect
                        </Button>
                      </div>
                    )}

                    {/* Domain Status Summary */}
                    {(connectedProvider || dnsStatus === 'verified') && (
                      <Card className="p-4 bg-green-50 border-green-200">
                        <h4 className="font-medium text-green-900 mb-3">Domain Connection Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">Domain Name:</span>
                            <span className="font-medium text-green-900">{data.customDomain}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">Setup Method:</span>
                            <span className="font-medium text-green-900">
                              {connectedProvider ? `Auto via ${domainProviders.find(p => p.id === connectedProvider)?.name}` : 'Manual'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">DNS Status:</span>
                            <span className="font-medium text-green-900 flex items-center space-x-1">
                              <CheckCircle2 size={14} />
                              <span>Verified</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">SSL Status:</span>
                            <span className="font-medium text-green-900 flex items-center space-x-1">
                              <CheckCircle2 size={14} />
                              <span>Active</span>
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <Button variant="outline" size="sm" className="mr-2">
                            Recheck DNS
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setSetupMethod(setupMethod === 'auto' ? 'manual' : 'auto')}>
                            Change Setup Method
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

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
                
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Use Subdomain
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-slate-500 flex items-center">
              <HelpCircle size={12} className="mr-1" />
              You can update your domain settings later from your dashboard
            </p>
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
            Continue
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
