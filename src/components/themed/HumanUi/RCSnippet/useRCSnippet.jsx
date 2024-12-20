import { useFocusRing } from '@react-aria/focus';
import { useState, useCallback, useRef } from 'react';
/**
 * Custom hook to copy text to clipboard with a specified timeout.
 * @param {string} initialText - Initial text to copy.
 * @param {Object} options - Configuration options.
 * @param {number} options.successDuration - Duration for the copied status.
 * @returns {Array} - Copied state and copy function.
 */
function useClipboard(initialText, options = { successDuration: 2000 }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text = initialText) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), options.successDuration);
      } catch (error) {
        console.error('Failed to copy text: ', error);
        setIsCopied(false);
      }
    },
    [initialText, options.successDuration]
  );

  return [isCopied, copyToClipboard];
}

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
