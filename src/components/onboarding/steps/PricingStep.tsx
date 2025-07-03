
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, CreditCard, Shield, Check, Info, Calendar } from 'lucide-react';
import { Payment } from '../types';

interface PricingStepProps {
  data: Payment;
  onUpdate: (data: Payment) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PricingStep: React.FC<PricingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingZip: ''
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onUpdate({
        completed: true,
        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
        acceptedTerms: data.acceptedTerms
      });
      setProcessing(false);
      onNext();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your Annual Plan</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Get complete access to your branded telehealth platform with 12 months of hosting, updates, and support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pricing Summary */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Annual Plan - $997/year</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-slate-600">Annual Subscription Fee</span>
                <span className="text-2xl font-bold text-slate-800">$997</span>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <div className="flex items-start space-x-3">
                  <Calendar size={20} className="text-blue-600 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Billing Information</p>
                    <p className="mb-2">Your subscription includes access to the complete platform, hosting, security updates, and feature rollouts for 12 months.</p>
                    <div className="space-y-1">
                      <div>• Renewal Date: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                      <div>• Cancel anytime before renewal to avoid charges</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-slate-800">What's Included in Your Plan:</h4>
                <div className="space-y-2">
                  {[
                    'Fully branded telehealth platform',
                    'Custom domain setup and hosting',
                    'Patient intake forms and workflows',
                    'Booking system integration',
                    'Payment processing setup',
                    'HIPAA compliant infrastructure',
                    'Admin dashboard access',
                    'Security updates and maintenance',
                    'New feature rollouts',
                    'Priority customer support',
                    'Platform analytics and reporting',
                    'Mobile-responsive design'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check size={16} className="text-green-600" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-blue-50/50 backdrop-blur-sm border-blue-200">
            <div className="flex items-start space-x-3">
              <Info size={20} className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Commission Structure</h4>
                <p className="text-sm text-blue-700">
                  After setup, we charge a small commission on consultations and product sales to help maintain and improve your platform. This ensures we're aligned with your success.
                </p>
                <div className="mt-3 space-y-1 text-sm text-blue-700">
                  <div>• Consultations: 3% + $0.30 per transaction</div>
                  <div>• Product sales: 2.9% + $0.30 per transaction</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Form */}
        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-800">Payment Information</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName" className="text-sm font-medium text-slate-700">
                Cardholder Name
              </Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm font-medium text-slate-700">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ 
                  ...cardDetails, 
                  cardNumber: formatCardNumber(e.target.value) 
                })}
                maxLength={19}
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-sm font-medium text-slate-700">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    expiryDate: formatExpiryDate(e.target.value) 
                  })}
                  maxLength={5}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm font-medium text-slate-700">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 4) 
                  })}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingZip" className="text-sm font-medium text-slate-700">
                Billing ZIP Code
              </Label>
              <Input
                id="billingZip"
                placeholder="12345"
                value={cardDetails.billingZip}
                onChange={(e) => setCardDetails({ 
                  ...cardDetails, 
                  billingZip: e.target.value.replace(/[^0-9]/g, '').substring(0, 5) 
                })}
                className="h-12"
              />
            </div>

            <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield size={20} className="text-green-600" />
              <div className="text-sm text-green-800">
                <div className="font-medium">Secure Payment</div>
                <div>Your payment information is encrypted and secure</div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border">
              <Checkbox
                id="terms"
                checked={data.acceptedTerms}
                onCheckedChange={(checked) => onUpdate({ ...data, acceptedTerms: !!checked })}
              />
              <Label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed">
                I agree to the recurring billing terms and authorize HyrHealth to charge my payment method $997 annually. I understand I can cancel anytime before my renewal date.
              </Label>
            </div>

            <Button
              onClick={handlePayment}
              disabled={processing || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName || !data.acceptedTerms}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {processing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </div>
              ) : (
                `Start Annual Plan - $997/year`
              )}
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          className="h-12 px-6"
          disabled={processing}
        >
          <ChevronLeft size={16} className="mr-2" />
          Previous
        </Button>
      </div>
    </div>
  );
};
