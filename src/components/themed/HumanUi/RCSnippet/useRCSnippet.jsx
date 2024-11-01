import { useFocusRing } from '@react-aria/focus';
import { useState, useCallback, useRef } from 'react';
import { useClipboard } from 'react-use-clipboard'; // Using react-use-clipboard for clipboard functionality

/**
 * @typedef {Object} UseRCSnippetProps
 * @property {React.Ref} ref - Ref to the DOM node.
 * @property {React.ReactNode | string | string[]} children - The content of the snippet.
 * @property {string} [symbol] - The symbol to show before the snippet.
 * @property {number} [timeout] - The time in milliseconds to wait before resetting the clipboard.
 * @property {React.ReactNode} [copyIcon] - Snippet copy icon.
 * @property {React.ReactNode} [checkIcon] - Snippet copy icon shown when the text is copied.
 * @property {boolean} [autoFocus] - Whether the copy button should receive focus on render.
 * @property {string} [codeString] - The code string to copy.
 * @property {boolean} [disableTooltip] - Whether to hide the tooltip.
 * @property {boolean} [disableCopy] - Whether to disable the copy functionality.
 * @property {boolean} [hideCopyButton] - Whether to hide the copy button.
 * @property {boolean} [hideSymbol] - Whether to hide the symbol.
 * @property {Object} [tooltipProps] - Tooltip props.
 * @property {Object} [copyButtonProps] - Copy button props.
 * @property {(value: string | string[]) => void} [onCopy] - Callback when the text is copied.
 */

/**
 * @param {UseRCSnippetProps} originalProps
 * @returns {Object} UseRCSnippetReturn
 */
export function useRCSnippet(originalProps) {
  const {
    ref,
    children,
    symbol = '$',
    timeout = 2000,
    codeString,
    disableCopy = false,
    hideCopyButton = false,
    autoFocus = false,
    onCopy: onCopyProp,
    tooltipProps = {},
    copyButtonProps = {},
  } = originalProps;

  const [copied, setCopied] = useState(false);
  const [isCopied, setIsCopied] = useClipboard(codeString || children || '', {
    successDuration: timeout,
  });

  const preRef = useRef(null);

  const onCopy = useCallback(() => {
    if (disableCopy) return;
    const valueToCopy = codeString || preRef.current?.textContent || '';
    setIsCopied(valueToCopy);
    setCopied(true);
    onCopyProp?.(valueToCopy);
    setTimeout(() => setCopied(false), timeout);
  }, [codeString, disableCopy, onCopyProp, setIsCopied]);

  const { isFocusVisible, focusProps } = useFocusRing({ autoFocus });

  return {
    ref,
    preRef,
    children,
    copied,
    onCopy,
    hideCopyButton,
    tooltipProps,
    copyButtonProps: {
      ...copyButtonProps,
      onClick: onCopy,
      'aria-label': 'Copy to clipboard',
      variant: 'contained',
      color: 'primary',
      size: 'small',
      ...focusProps,
    },
  };
}
