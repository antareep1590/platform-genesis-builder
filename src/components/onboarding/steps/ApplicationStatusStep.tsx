import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { ApplicationStatus } from '../types';
import { useToast } from '@/hooks/use-toast';

interface ApplicationStatusStepProps {
  data: ApplicationStatus;
  onUpdate: (data: ApplicationStatus) => void;
  onNext: () => void;
  onResubmit: () => void;
}

export const ApplicationStatusStep: React.FC<ApplicationStatusStepProps> = ({
  data,
  onUpdate,
  onNext,
  onResubmit
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to check status
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, randomly update status to approved after refresh
    // In real app, this would come from your backend
    if (data.status === 'submitted' || data.status === 'pending') {
      const updatedStatus: ApplicationStatus = {
        ...data,
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        message: 'Your application has been approved! You can now continue to launch your platform.'
      };
      onUpdate(updatedStatus);
      toast({
        title: "Status Updated",
        description: "Your application has been approved!",
      });
    } else {
      toast({
        title: "Status Checked",
        description: "No updates to your application status at this time.",
      });
    }
    
    setIsRefreshing(false);
  };
  const getStatusIcon = () => {
    switch (data.status) {
      case 'submitted':
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'denied':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <AlertTriangle className="w-16 h-16 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (data.status) {
      case 'submitted':
        return {
          title: 'Application Submitted Successfully!',
          description: 'Your application is currently under review. We will notify you once the review is complete.',
          color: 'text-yellow-800'
        };
      case 'pending':
        return {
          title: 'Application Under Review',
          description: 'Your application is currently under review. We will notify you once the review is complete.',
          color: 'text-yellow-800'
        };
      case 'approved':
        return {
          title: 'Application Approved!',
          description: 'Congratulations! Your application has been approved. You can now continue to the next step.',
          color: 'text-green-800'
        };
      case 'denied':
        return {
          title: 'Application Needs Attention',
          description: data.message || 'Your application requires some additional information. Please review and resubmit.',
          color: 'text-red-800'
        };
      default:
        return {
          title: 'Application Status Unknown',
          description: 'Please contact support for assistance.',
          color: 'text-gray-800'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Application Status</h1>
        <p className="text-slate-600 text-lg">RevitPay Pre-Application Review</p>
      </div>

      {/* Status Card */}
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl ${statusInfo.color}`}>
            {statusInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600 text-lg leading-relaxed">
            {statusInfo.description}
          </p>

          {data.submittedAt && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Submitted:</span> {new Date(data.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {data.reviewedAt && (
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Reviewed:</span> {new Date(data.reviewedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          )}

          {data.status === 'denied' && data.message && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-left">
              <h4 className="font-semibold text-red-800 mb-2">Review Comments:</h4>
              <p className="text-red-700 text-sm">{data.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            {data.status === 'approved' && (
              <Button 
                onClick={onNext}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Continue to Next Step
              </Button>
            )}

            {data.status === 'denied' && (
              <Button 
                onClick={onResubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Resubmit Application
              </Button>
            )}

            {(data.status === 'pending' || data.status === 'submitted') && (
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-4">
                  We'll send you an email notification once your application is reviewed.
                </p>
                <Button 
                  variant="outline"
                  className="text-slate-600"
                  onClick={refreshStatus}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Status
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-slate-600 text-sm mb-4">
              If you have questions about your application status, our support team is here to help.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <a href="mailto:support@revitpay.com" className="text-blue-600 hover:text-blue-700">
                support@revitpay.com
              </a>
              <span className="text-slate-400">|</span>
              <a href="tel:1-800-555-0123" className="text-blue-600 hover:text-blue-700">
                1-800-555-0123
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};