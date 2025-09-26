import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronUp, ChevronDown, Upload, Settings, Globe, Users } from 'lucide-react';

interface PreLaunchChecklistProps {
  isOpen: boolean;
  onToggle: () => void;
}

const preLaunchTasks = [
  {
    id: 'logo',
    label: 'Upload company logo',
    description: 'Add your brand logo for customer recognition',
    icon: Upload,
    link: '/settings/branding',
    completed: false
  },
  {
    id: 'descriptor',
    label: 'Set payment descriptor',
    description: 'Configure how payments appear on customer statements',
    icon: Settings,
    link: '/settings/payments',
    completed: false
  },
  {
    id: 'domain',
    label: 'Connect custom domain',
    description: 'Set up your custom domain for professional branding',
    icon: Globe,
    link: '/settings/domain',
    completed: true
  },
  {
    id: 'teammates',
    label: 'Invite team members',
    description: 'Add teammates to help manage your platform',
    icon: Users,
    link: '/settings/team',
    completed: false
  }
];

export const PreLaunchChecklist: React.FC<PreLaunchChecklistProps> = ({ isOpen, onToggle }) => {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(
    new Set(preLaunchTasks.filter(task => task.completed).map(task => task.id))
  );

  const handleTaskToggle = (taskId: string) => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(taskId)) {
      newChecked.delete(taskId);
    } else {
      newChecked.add(taskId);
    }
    setCheckedTasks(newChecked);
  };

  const completedCount = checkedTasks.size;
  const totalTasks = preLaunchTasks.length;

  return (
    <Card className={`transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-16 overflow-hidden'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Pre-Launch Checklist</CardTitle>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{totalTasks} tasks completed • Keep momentum while you wait
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-4">
          {preLaunchTasks.map((task) => {
            const Icon = task.icon;
            const isChecked = checkedTasks.has(task.id);
            
            return (
              <div
                key={task.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  isChecked ? 'bg-green-50 border-green-200' : 'bg-background border-border hover:border-border/80'
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                  className="mt-0.5"
                />
                <Icon className={`w-4 h-4 ${isChecked ? 'text-green-600' : 'text-muted-foreground'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isChecked ? 'text-green-800 line-through' : 'text-foreground'}`}>
                    {task.label}
                  </p>
                  <p className={`text-xs ${isChecked ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {task.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                  onClick={() => window.location.href = task.link}
                >
                  {isChecked ? 'Edit' : 'Set up'}
                </Button>
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalTasks) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Complete these optional tasks to optimize your launch
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};