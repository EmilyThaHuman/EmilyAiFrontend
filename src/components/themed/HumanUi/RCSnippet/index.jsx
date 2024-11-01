import { CopyLinearIcon, CheckLinearIcon } from '@mui/icons-material'; // Make sure to import the icons from MUI
import { Button, Tooltip, Box } from '@mui/material';
import PropTypes from 'prop-types';
import React, { forwardRef, useMemo } from 'react';

import { useRCSnippet } from './useRCSnippet';

/**
 * @typedef {Object} RCSnippetProps
 * @property {React.Ref} ref - Ref to the DOM node.
 * @property {React.ReactNode | string | string[]} children - The content of the snippet.
 * @property {string} [symbol] - The symbol to show before the snippet.
 * @property {number} [timeout] - The time in milliseconds to wait before resetting the clipboard.
 * @property {React.ReactNode} [copyIcon] - Snippet copy icon.
 * @property {React.ReactNode} [checkIcon] - Snippet copy icon shown when the text is copied.
 * @property {boolean} [autoFocus] - Whether the copy button should receive focus on render.
 * @property {string } [codeString] - The code string to copy.
 * @property {boolean} [disableTooltip] - Whether to hide the tooltip.
 * @property {boolean} [disableCopy] - Whether to disable the copy functionality.
 * @property {boolean} [hideCopyButton] - Whether to hide the copy button.
 * @property {boolean} [hideSymbol] - Whether to hide the symbol.
 * @property {Object} [tooltipProps] - Tooltip props.
 * @property {Object} [copyButtonProps] - Copy button props.
 * @property {(value: string | string[]) => void} [onCopy] - Callback when the text is copied.
 */

const RCSnippet = forwardRef((props, ref) => {
  const {
    ref: snippetRef,
    preRef,
    children,
    copied,
    onCopy,
    hideCopyButton,
    tooltipProps,
    copyButtonProps,
  } = useRCSnippet({ ...props, ref });

  const copyButton = useMemo(() => {
    if (hideCopyButton) return null;

    return (
      <Tooltip {...tooltipProps} title="Copy to clipboard">
        <Button {...copyButtonProps}>
          {copied ? <CheckLinearIcon /> : <CopyLinearIcon />}
        </Button>
      </Tooltip>
    );
  }, [hideCopyButton, tooltipProps, copyButtonProps, copied]);

  return (
    <Box ref={snippetRef} sx={{ display: 'flex', alignItems: 'center' }}>
      <pre ref={preRef} style={{ margin: 0, padding: 2, fontSize: 14 }}>
        {children}
      </pre>
      {copyButton}
    </Box>
  );
});

RCSnippet.propTypes = {
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  symbol: PropTypes.string,
  timeout: PropTypes.number,
  copyIcon: PropTypes.node,
  checkIcon: PropTypes.node,
  autoFocus: PropTypes.bool,
  codeString: PropTypes.string,
  disableTooltip: PropTypes.bool,
  disableCopy: PropTypes.bool,
  hideCopyButton: PropTypes.bool,
  hideSymbol: PropTypes.bool,
  tooltipProps: PropTypes.object,
  copyButtonProps: PropTypes.object,
  onCopy: PropTypes.func,
};

RCSnippet.displayName = 'RCSnippet';

export default RCSnippet;
