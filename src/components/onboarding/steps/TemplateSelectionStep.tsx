
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Eye, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Template } from '../types';

interface TemplateSelectionStepProps {
  data: Template;
  businessType: string;
  onUpdate: (data: Template) => void;
  onNext: () => void;
  onPrev: () => void;
}

const templates = {
  'Gym': [
    {
      id: 'gym-vibrant',
      name: 'Vibrant Fitness',
      description: 'Bold, energetic design perfect for gyms and fitness centers',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Modern', 'Bold', 'Fitness-focused'],
      primaryColor: '#FF6B35',
      accentColor: '#4ECDC4'
    },
    {
      id: 'gym-minimal',
      name: 'Clean Performance',
      description: 'Minimal, professional design for premium fitness brands',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Minimal', 'Professional', 'Clean'],
      primaryColor: '#2D3748',
      accentColor: '#10B981'
    }
  ],
  'Medical Clinic': [
    {
      id: 'clinic-trust',
      name: 'Medical Trust',
      description: 'Professional, trustworthy design for medical practices',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Professional', 'Trustworthy', 'Medical'],
      primaryColor: '#2B6CB0',
      accentColor: '#065F46'
    },
    {
      id: 'clinic-modern',
      name: 'Modern Healthcare',
      description: 'Contemporary design with a focus on patient care',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Modern', 'Healthcare', 'Patient-focused'],
      primaryColor: '#7C3AED',
      accentColor: '#059669'
    }
  ],
  'Wellness Center': [
    {
      id: 'wellness-calm',
      name: 'Calm Wellness',
      description: 'Soothing, peaceful design for wellness and spa centers',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Calm', 'Peaceful', 'Wellness'],
      primaryColor: '#059669',
      accentColor: '#7C2D12'
    },
    {
      id: 'wellness-vibrant',
      name: 'Vibrant Wellness',
      description: 'Energetic design promoting health and vitality',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Vibrant', 'Energetic', 'Health-focused'],
      primaryColor: '#DC2626',
      accentColor: '#0891B2'
    }
  ],
  'default': [
    {
      id: 'universal-clean',
      name: 'Clean & Modern',
      description: 'Versatile design suitable for any healthcare business',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Clean', 'Modern', 'Versatile'],
      primaryColor: '#3B82F6',
      accentColor: '#10B981'
    },
    {
      id: 'universal-professional',
      name: 'Professional Elite',
      description: 'Premium professional design for established practices',
      thumbnail: '/api/placeholder/400/300',
      tags: ['Professional', 'Premium', 'Elite'],
      primaryColor: '#1F2937',
      accentColor: '#7C3AED'
    }
  ]
};

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  data,
  businessType,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const availableTemplates = templates[businessType as keyof typeof templates] || templates.default;

  const loadingMessages = [
    'Initializing your custom storefront…',
    'Your digital storefront is coming to life…',
    'Customization Completed'
  ];

  useEffect(() => {
    if (!isLoading) return;

    let currentIndex = 0;
    setLoadingMessage(loadingMessages[0]);

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < loadingMessages.length) {
        setLoadingMessage(loadingMessages[currentIndex]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          onNext();
        }, 800);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleTemplateSelect = (template: any) => {
    onUpdate({
      selectedTemplate: template.id,
      templateData: template
    });
  };

  const handlePreview = (template: any) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-xl font-medium text-foreground animate-fade-in">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your Template</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select a design template that matches your {businessType.toLowerCase()} brand and style.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableTemplates.map((template) => (
          <Card
            key={template.id}
            className={`overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg ${
              data.selectedTemplate === template.id
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              {data.selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-2">
                  <Check size={16} />
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(template);
                  }}
                  className="bg-white/90 hover:bg-white text-slate-700"
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </Button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {template.name}
              </h3>
              <p className="text-slate-600 mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
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
          onClick={() => setIsLoading(true)}
          disabled={!data.selectedTemplate}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Apply Theme & Continue
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name} Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Landing Page</h4>
                  <div className="h-40 bg-slate-100 rounded flex items-center justify-center">
                    <img src={previewTemplate?.thumbnail} alt="Landing Page" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Product Page</h4>
                  <div className="h-40 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                    Product Page Preview
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Intake Form</h4>
                  <div className="h-40 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                    Intake Form Preview
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Booking Page</h4>
                  <div className="h-40 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                    Booking Page Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
