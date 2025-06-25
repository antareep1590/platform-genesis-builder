
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, Globe, Search, ExternalLink, Copy, Check } from 'lucide-react';
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
  const [showDNSInstructions, setShowDNSInstructions] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSubdomain = () => {
    const cleaned = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned.substring(0, 15);
  };

  const handleDomainSearch = () => {
    // Mock domain search results
    const mockResults = [
      { domain: `${domainSearch}.com`, available: true, price: '$12.99/year' },
      { domain: `${domainSearch}.net`, available: true, price: '$14.99/year' },
      { domain: `${domainSearch}.org`, available: false, price: 'Not available' },
      { domain: `${domainSearch}.io`, available: true, price: '$49.99/year' },
    ];
    setSearchResults(mockResults);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dnsRecords = [
    { type: 'CNAME', name: 'www', value: 'platform.mycompany.com' },
    { type: 'A', name: '@', value: '192.168.1.1' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Setup Your Domain</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose how patients will access your platform. You can use a subdomain, connect your own domain, or purchase a new one.
        </p>
      </div>

      <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <RadioGroup
          value={data.domainOption}
          onValueChange={(value) => onUpdate({ ...data, domainOption: value as any })}
          className="space-y-6"
        >
          {/* Subdomain Option */}
          <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-slate-50 transition-colors">
            <RadioGroupItem value="subdomain" id="subdomain" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="subdomain" className="text-lg font-medium text-slate-800 cursor-pointer">
                Use a subdomain (Recommended)
              </Label>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Quick and easy setup with our platform domain
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder={generateSubdomain()}
                  value={data.subdomain}
                  onChange={(e) => onUpdate({ ...data, subdomain: e.target.value })}
                  className="max-w-xs"
                  disabled={data.domainOption !== 'subdomain'}
                />
                <span className="text-slate-600">.myplatform.com</span>
              </div>
              <div className="text-sm text-green-600 mt-2">✓ Free • SSL included • Instant setup</div>
            </div>
          </div>

          {/* Custom Domain Option */}
          <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-slate-50 transition-colors">
            <RadioGroupItem value="custom" id="custom" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="custom" className="text-lg font-medium text-slate-800 cursor-pointer">
                Connect your existing domain
              </Label>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Use a domain you already own
              </p>
              <Input
                placeholder="yourbusiness.com"
                value={data.customDomain}
                onChange={(e) => onUpdate({ ...data, customDomain: e.target.value })}
                className="max-w-md"
                disabled={data.domainOption !== 'custom'}
              />
              
              {data.domainOption === 'custom' && data.customDomain && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDNSInstructions(!showDNSInstructions)}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View DNS Setup Instructions
                  </Button>
                  
                  {showDNSInstructions && (
                    <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-3">DNS Configuration</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Add these DNS records in your domain provider's dashboard:
                      </p>
                      <div className="space-y-2">
                        {dnsRecords.map((record, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="text-sm font-mono">
                              <span className="font-medium">{record.type}</span> {record.name} → {record.value}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(record.value)}
                            >
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        DNS changes may take up to 24-48 hours to propagate globally.
                      </p>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Purchase Domain Option */}
          <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-slate-50 transition-colors">
            <RadioGroupItem value="purchase" id="purchase" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="purchase" className="text-lg font-medium text-slate-800 cursor-pointer">
                Purchase a new domain
              </Label>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Find and register the perfect domain for your business
              </p>
              
              {data.domainOption === 'purchase' && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="yourbusinessname"
                      value={domainSearch}
                      onChange={(e) => setDomainSearch(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleDomainSearch} variant="outline">
                      <Search size={16} className="mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <Card className="p-4 bg-slate-50">
                      <h4 className="font-medium text-slate-800 mb-3">Available Domains</h4>
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
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
                              <span className="text-sm text-slate-600">{result.price}</span>
                              <Button
                                size="sm"
                                disabled={!result.available}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {result.available ? 'Select' : 'Unavailable'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
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
  );
};
