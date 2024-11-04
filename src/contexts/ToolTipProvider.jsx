import { Tooltip as MuiTooltip } from '@mui/material';
import { styled } from '@mui/system';
import * as React from 'react';

// Utility function to combine class names
import { cn } from '@/lib/utils/styleUtils';

// Define custom styled components for the Tooltip content
const CustomTooltip = styled(({ className, ...props }) => (
  <MuiTooltip
    arrow
    placement="top"
    classes={{ popper: className }}
    {...props}
  />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: '0.75rem 1rem',
    borderRadius: theme.shape.borderRadius,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: theme.shadows[3],
    border: `1px solid ${theme.palette.divider}`,
    zIndex: 50,
    overflow: 'hidden',
    animation: 'fadeIn 0.3s ease-in-out, zoomIn 0.3s ease-in-out',
  },
  // Handle placement animations (customize as needed)
  [`&[data-placement*='bottom'] .MuiTooltip-tooltip`]: {
    transform: 'translateY(-10px)',
  },
  [`&[data-placement*='top'] .MuiTooltip-tooltip`]: {
    transform: 'translateY(10px)',
  },
  [`&[data-placement*='left'] .MuiTooltip-tooltip`]: {
    transform: 'translateX(10px)',
  },
  [`&[data-placement*='right'] .MuiTooltip-tooltip`]: {
    transform: 'translateX(-10px)',
  },
}));

// TooltipProvider isn't required as Material-UI handles tooltip state globally

const TooltipTrigger = ({ children }) => <>{children}</>;

// Wrapper for custom content
const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <CustomTooltip
      className={cn('custom-tooltip', className)}
      PopperProps={{
        modifiers: [{ name: 'offset', options: { offset: [0, sideOffset] } }],
      }}
      {...props}
    />
  )
);
TooltipContent.displayName = 'TooltipContent';

// Export components
export { TooltipContent as Tooltip, TooltipTrigger };
