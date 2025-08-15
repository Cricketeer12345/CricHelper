import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    defaultVariants: {},
  }
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    style={{ color: '#2c1810', fontWeight: '600', textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)' }}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
