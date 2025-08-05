import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, FileText, AlertCircle, Shield, CheckCircle, Clock } from 'lucide-react';
import { LegitScript } from '../types';

interface LegitScriptStepProps {
  data: LegitScript;
  onUpdate: (data: LegitScript) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LegitScriptStep: React.FC<LegitScriptStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{
    key: keyof typeof data.documentsSignature;
    label: string;
  } | null>(null);

  const handleDocumentSign = (documentKey: keyof typeof data.documentsSignature) => {
    // Simulate DocuSign completion
    onUpdate({
      ...data,
      documentsSignature: {
        ...data.documentsSignature,
        [documentKey]: true,
      },
    });
    setSelectedDocument(null);
  };

  const openDocumentModal = (doc: { key: keyof typeof data.documentsSignature; label: string }) => {
    setSelectedDocument(doc);
  };

  const isValid = !data.applyNow || (
    data.businessName &&
    data.documentsSignature.document1 &&
    data.documentsSignature.document2 &&
    data.documentsSignature.document3
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">📄 LegitScript Certification</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Get certified to sell regulated health products like supplements, telehealth services, etc.
        </p>
      </div>

      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">Apply for LegitScript Now</h3>
              <p className="text-sm text-slate-600">
                Recommended for businesses selling health products or telehealth services
              </p>
            </div>
            <Switch
              checked={data.applyNow}
              onCheckedChange={(checked) => onUpdate({ ...data, applyNow: checked })}
            />
          </div>

          {!data.applyNow && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Skipping LegitScript Certification</h4>
                  <p className="text-sm text-yellow-700">
                    You can apply for certification later, but some features may be limited.
                  </p>
                </div>
              </div>
            </div>
          )}

          {data.applyNow && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium text-slate-700">
                    Business/Clinic Name *
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
                  <Label htmlFor="npiNumber" className="text-sm font-medium text-slate-700">
                    NPI Number (Optional)
                  </Label>
                  <Input
                    id="npiNumber"
                    placeholder="1234567890"
                    value={data.npiNumber}
                    onChange={(e) => onUpdate({ ...data, npiNumber: e.target.value })}
                    className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500">
                    National Provider Identifier for healthcare providers
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Document Signatures Required</h4>
                <div className="space-y-3">
                  {[
                    { key: 'document1' as const, label: 'LegitScript Application Form' },
                    { key: 'document2' as const, label: 'Compliance Certification Agreement' },
                    { key: 'document3' as const, label: 'Terms of Service Agreement' },
                  ].map((doc) => (
                    <div key={doc.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">{doc.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {data.documentsSignature[doc.key] ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Signed
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="outline" className="border-orange-200 text-orange-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDocumentModal(doc)}
                              className="ml-2"
                            >
                              Sign Document
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Certification Process</h4>
                    <p className="text-sm text-blue-700">
                      You will get a demo site with a "Verification Pending" banner. 
                      Once certified, your live site will be activated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          <span>Next: Bank Verification</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Document Signing Modal */}
      <Dialog open={selectedDocument !== null} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sign Document</DialogTitle>
            <DialogDescription>
              {selectedDocument?.label}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Simulated Document Content */}
            <div className="border rounded-lg p-6 bg-gray-50 min-h-[400px]">
              <div className="text-center text-gray-600 mb-4">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">{selectedDocument?.label}</h3>
                <p className="text-sm">Document content would be displayed here</p>
              </div>
              
              <div className="space-y-4 text-sm text-gray-700">
                <p>This is a simulated document view. In a real implementation, this would show the actual document content that needs to be signed.</p>
                <p>The document would typically include:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Terms and conditions</li>
                  <li>Compliance requirements</li>
                  <li>Business obligations</li>
                  <li>Certification standards</li>
                </ul>
              </div>
            </div>

            {/* DocuSign Simulation */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">D</span>
                  </div>
                  <span className="font-medium text-blue-800">DocuSign Integration</span>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  Click "Sign with DocuSign" to electronically sign this document.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => selectedDocument && handleDocumentSign(selectedDocument.key)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign with DocuSign
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};