
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ExternalLink, Shield, Check, Info, DollarSign } from 'lucide-react';
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
  const [processing, setProcessing] = useState(false);

  const handlePaymentRedirect = async () => {
    setProcessing(true);
    
    // TODO: Replace with actual Stripe payment link
    const paymentLink = "https://checkout.stripe.com/pay/setup-fee";
    
    // Open Stripe checkout in a new tab
    window.open(paymentLink, '_blank');
    
    // For demo purposes, simulate completion after redirect
    setTimeout(() => {
      onUpdate({
        completed: true,
        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
        acceptedTerms: data.acceptedTerms
      });
      setProcessing(false);
      onNext();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Platform Setup Fee</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Complete your platform setup with a one-time payment to get your branded telehealth platform live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pricing Summary */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">One-Time Setup Fee</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-slate-600">Platform Setup Fee</span>
                <span className="text-2xl font-bold text-slate-800">$5,000</span>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <div className="flex items-start space-x-3">
                  <DollarSign size={20} className="text-blue-600 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Payment Options</p>
                    <p className="mb-2">Choose your preferred payment method during checkout - credit card or ACH bank transfer.</p>
                    <div className="space-y-1">
                      <div>• Secure Stripe payment processing</div>
                      <div>• Multiple payment methods accepted</div>
                      <div>• Instant platform activation upon payment</div>
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
          <div className="flex items-center space-x-2 mb-6">
            <ExternalLink className="text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-800">Complete Your Payment</h3>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <Shield size={20} className="text-green-600" />
                <div className="text-sm text-green-800">
                  <div className="font-medium mb-1">Secure Stripe Payment</div>
                  <div>You'll be redirected to Stripe's secure payment page where you can choose to pay with:</div>
                  <div className="mt-2 space-y-1">
                    <div>• Credit or Debit Card</div>
                    <div>• ACH Bank Transfer</div>
                    <div>• Other supported payment methods</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border">
              <Checkbox
                id="terms"
                checked={data.acceptedTerms}
                onCheckedChange={(checked) => onUpdate({ ...data, acceptedTerms: !!checked })}
              />
              <Label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed">
                I agree to the payment terms and authorize the one-time setup fee of $5,000 to activate my telehealth platform.
              </Label>
            </div>

            <Button
              onClick={handlePaymentRedirect}
              disabled={processing || !data.acceptedTerms}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-medium text-lg"
            >
              {processing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Redirecting to Payment...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Pay $5,000 Setup Fee</span>
                  <ExternalLink size={18} />
                </div>
              )}
            </Button>
            
            <p className="text-xs text-slate-500 text-center">
              You'll be redirected to Stripe's secure payment page in a new tab
            </p>
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
