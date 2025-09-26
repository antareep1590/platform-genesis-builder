import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface ProgressChecklistProps {
  currentStatus: 'submitted' | 'pending' | 'approved' | 'denied';
}

const checklistItems = [
  { id: 'account', label: 'Account Setup', completed: true },
  { id: 'business', label: 'Business Details', completed: true },
  { id: 'verification', label: 'Identity Verification', completed: true },
  { id: 'compliance', label: 'Compliance Check', completed: true },
  { id: 'submission', label: 'Application Submission', completed: true },
  { id: 'review', label: 'Final Review', completed: false }
];

export const ProgressChecklist: React.FC<ProgressChecklistProps> = ({ currentStatus }) => {
  const isReviewActive = currentStatus === 'submitted' || currentStatus === 'pending';
  const isReviewCompleted = currentStatus === 'approved';

  return (
    <div className="bg-card rounded-lg p-6 border">
      <h3 className="font-semibold text-lg mb-4 text-foreground">Onboarding Progress</h3>
      <div className="space-y-3">
        {checklistItems.map((item, index) => {
          const isCompleted = item.completed || (item.id === 'review' && isReviewCompleted);
          const isActive = item.id === 'review' && isReviewActive;
          
          return (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                isActive ? 'bg-primary/5 border border-primary/20' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : isActive ? (
                  <div className="relative">
                    <Clock className="w-5 h-5 text-primary" />
                    <div className="absolute inset-0 animate-pulse">
                      <Clock className="w-5 h-5 text-primary opacity-50" />
                    </div>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                isCompleted ? 'text-foreground' : 
                isActive ? 'text-primary font-semibold' : 
                'text-muted-foreground'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="ml-auto text-xs text-primary font-medium">
                  In Progress
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};