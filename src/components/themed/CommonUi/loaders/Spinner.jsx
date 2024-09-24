import { ReloadIcon } from '@radix-ui/react-icons';
import React from 'react';

export const Spinner = React.forwardRef((props, ref) => {
  return (
    <span ref={ref} {...props}>
      <ReloadIcon className="animate-spin" />
    </span>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
