export function useEnterSubmit(options) {
  var onSubmit = options.onSubmit;

  function handleKeyDown(event) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      onSubmit();
    }
  }

  return { onKeyDown: handleKeyDown };
}

export default useEnterSubmit;
