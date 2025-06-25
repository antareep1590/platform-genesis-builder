
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Upload, Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Branding } from '../types';

interface BrandingStepProps {
  data: Branding;
  onUpdate: (data: Branding) => void;
  onNext: () => void;
  onPrev: () => void;
}

const fonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Playfair Display'
];

export const BrandingStep: React.FC<BrandingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdate({ ...data, logo: file });
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    onUpdate({
      ...data,
      socialLinks: {
        ...data.socialLinks,
        [platform]: value
      }
    });
  };

  const isValid = data.displayName && data.tagline;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Customize Your Branding</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Add your brand identity to make your platform uniquely yours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Logo & Visual Identity</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Business Logo</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  {data.logo ? (
                    <div className="space-y-2">
                      <div className="text-sm text-green-600 font-medium">
                        Logo uploaded: {data.logo.name}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        Change Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-slate-400" />
                      <div className="text-sm text-slate-600">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          Click to upload
                        </Button>
                        {' '}or drag and drop
                      </div>
                      <div className="text-xs text-slate-500">PNG, JPG, SVG up to 10MB</div>
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Brand Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={data.brandColor}
                      onChange={(e) => onUpdate({ ...data, brandColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      value={data.brandColor}
                      onChange={(e) => onUpdate({ ...data, brandColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={data.accentColor}
                      onChange={(e) => onUpdate({ ...data, accentColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      value={data.accentColor}
                      onChange={(e) => onUpdate({ ...data, accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Font Family</Label>
                <Select
                  value={data.font}
                  onValueChange={(value) => onUpdate({ ...data, font: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Platform Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium text-slate-700">
                  Platform Display Name *
                </Label>
                <Input
                  id="displayName"
                  placeholder="How your platform name appears to patients"
                  value={data.displayName}
                  onChange={(e) => onUpdate({ ...data, displayName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-sm font-medium text-slate-700">
                  Business Tagline *
                </Label>
                <Input
                  id="tagline"
                  placeholder="A short description of your services"
                  value={data.tagline}
                  onChange={(e) => onUpdate({ ...data, tagline: e.target.value })}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Social Media Links</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center">
                  <Instagram size={16} className="mr-2 text-pink-600" />
                  Instagram
                </Label>
                <Input
                  placeholder="https://instagram.com/yourbusiness"
                  value={data.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center">
                  <Facebook size={16} className="mr-2 text-blue-600" />
                  Facebook
                </Label>
                <Input
                  placeholder="https://facebook.com/yourbusiness"
                  value={data.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center">
                  <Linkedin size={16} className="mr-2 text-blue-700" />
                  LinkedIn
                </Label>
                <Input
                  placeholder="https://linkedin.com/company/yourbusiness"
                  value={data.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center">
                  <Twitter size={16} className="mr-2 text-blue-400" />
                  Twitter
                </Label>
                <Input
                  placeholder="https://twitter.com/yourbusiness"
                  value={data.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center">
                  <Youtube size={16} className="mr-2 text-red-600" />
                  YouTube
                </Label>
                <Input
                  placeholder="https://youtube.com/c/yourbusiness"
                  value={data.socialLinks.youtube}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Brand Preview</h3>
            <div 
              className="p-6 rounded-lg border-2 border-dashed border-slate-300"
              style={{ 
                backgroundColor: `${data.brandColor}10`,
                borderColor: data.brandColor 
              }}
            >
              <div className="text-center">
                <div 
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    color: data.brandColor,
                    fontFamily: data.font 
                  }}
                >
                  {data.displayName || 'Your Platform Name'}
                </div>
                <div 
                  className="text-sm"
                  style={{ 
                    color: data.accentColor,
                    fontFamily: data.font 
                  }}
                >
                  {data.tagline || 'Your business tagline here'}
                </div>
              </div>
            </div>
          </Card>
        </div>
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
          disabled={!isValid}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Continue to Preview
        </Button>
      </div>
    </div>
  );
};
