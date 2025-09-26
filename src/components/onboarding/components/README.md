# Launch Ready Status Components

This directory contains the components that power the redesigned "Launch Ready Status" page, replacing the previous "Application Status" page.

## Components Overview

### 1. ApplicationStatusStep.tsx (Main Component)
The primary component that implements a state machine with two main states:
- **Submitted (In Review)**: Shows progress checklist, encouragement, and pre-launch tasks
- **Approved (Ready to Launch)**: Displays celebration, confirmation, and launch actions

### 2. Confetti.tsx
Provides celebratory animations with accessibility support:
- `Confetti`: Animated confetti particles for celebration
- `ReducedMotionCelebration`: Static fallback for users with motion sensitivities

### 3. ProgressChecklist.tsx
Shows onboarding progress with animated indicators:
- Displays completed steps with check marks
- Shows active step (Final Review) with pulsing animation
- Updates based on current application status

### 4. PreLaunchChecklist.tsx
Expandable checklist of optional pre-launch tasks:
- Upload logo, set payment descriptor, connect domain, invite teammates
- Tracks completion progress with visual indicators
- Links to relevant settings pages

## State Management

The main component uses a simple state machine pattern:

```typescript
const isSubmittedState = data.status === 'submitted' || data.status === 'pending';
const isApprovedState = data.status === 'approved';
const isDeniedState = data.status === 'denied';
```

## Key Features

### Accessibility
- WCAG AA contrast compliance
- Respects `prefers-reduced-motion` for animations
- ARIA live regions for status updates
- Proper focus management and keyboard navigation

### Responsive Design
- Mobile: Stacked layout with sticky bottom CTA
- Desktop: Two-column layout with hero/checklist left, status/actions right

### Animations & Micro-interactions
- Confetti burst on approval (with reduced motion fallback)
- Pulsing animations for active states
- Smooth transitions between states
- Optional success sound toggle

### Polling & Updates
- Automatic status polling every 10 seconds for submitted applications
- Exponential backoff to prevent excessive API calls
- Real-time UI updates when status changes

## Customization

### Checklist Tasks
Edit pre-launch tasks in `PreLaunchChecklist.tsx`:
```typescript
const preLaunchTasks = [
  {
    id: 'logo',
    label: 'Upload company logo',
    description: 'Add your brand logo for customer recognition',
    icon: Upload,
    link: '/settings/branding',
    completed: false
  },
  // Add more tasks...
];
```

### Status Messages
Update copy and messaging in the render functions:
- `renderSubmittedState()`: In-review messaging and encouragement
- `renderApprovedState()`: Celebration and launch messaging

### Styling & Theming
All components use semantic design tokens from the project's design system:
- Colors: `hsl(var(--primary))`, `hsl(var(--secondary))`, etc.
- Components respect light/dark mode automatically
- Animations can be customized via CSS custom properties

## Integration Notes

### Required Props
```typescript
interface ApplicationStatusStepProps {
  data: ApplicationStatus;
  onUpdate: (data: ApplicationStatus) => void;
  onNext: () => void;
  onResubmit: () => void;
}
```

### External Dependencies
- Uses existing UI components from `@/components/ui/`
- Integrates with toast system via `@/hooks/use-toast`
- Requires Lucide React icons
- Built with Tailwind CSS and CVA for styling

### Backend Integration
The component expects these status values:
- `'pending'` or `'submitted'`: Shows review state
- `'approved'`: Shows launch-ready state  
- `'denied'`: Shows attention-needed state

Status polling can be connected to your backend API by replacing the mock `refreshStatus` function.

## Testing Considerations

The component includes empty states and error handling for:
- Failed status fetches
- Network connectivity issues
- Missing or malformed data
- Accessibility edge cases

Consider testing with:
- Different screen sizes and orientations
- Various motion sensitivity preferences
- Network interruption scenarios
- Different application status combinations