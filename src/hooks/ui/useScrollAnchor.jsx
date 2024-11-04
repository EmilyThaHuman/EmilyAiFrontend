import { useCallback, useEffect, useRef, useState } from 'react';

export function useScrollAnchor(messages) {
  var messagesRef = useRef(null);
  var scrollRef = useRef(null);
  var [isAtBottom, setIsAtBottom] = useState(true);
  var [showScrollButton, setShowScrollButton] = useState(false);
  var [autoScroll, setAutoScroll] = useState(true);
  var lastMessageRef = useRef(null);

  var scrollToBottom = useCallback(function () {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(
    function () {
      if (messages.length > 0) {
        var lastMessage = messages[messages.length - 1];
        if (lastMessage !== lastMessageRef.current) {
          // New message added
          lastMessageRef.current = lastMessage;
          if (isAtBottom) {
            scrollToBottom();
          } else {
            setShowScrollButton(true);
          }
        } else if (autoScroll) {
          // Existing message updated
          scrollToBottom();
        }
      }
    },
    [messages, isAtBottom, autoScroll, scrollToBottom]
  );

  useEffect(function () {
    function handleScroll() {
      if (scrollRef.current) {
        var scrollTop = scrollRef.current.scrollTop;
        var scrollHeight = scrollRef.current.scrollHeight;
        var clientHeight = scrollRef.current.clientHeight;
        var bottomThreshold = 20;
        var newIsAtBottom =
          scrollTop + clientHeight >= scrollHeight - bottomThreshold;

        setIsAtBottom(newIsAtBottom);
        setShowScrollButton(!newIsAtBottom);
        setAutoScroll(newIsAtBottom);
      }
    }

    var current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll, { passive: true });
      return function () {
        current.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  var handleNewMessage = useCallback(
    function () {
      if (isAtBottom) {
        scrollToBottom();
      } else {
        setShowScrollButton(true);
      }
      setAutoScroll(true);
    },
    [isAtBottom, scrollToBottom]
  );

  function handleManualScroll() {
    scrollToBottom();
    setAutoScroll(true);
    setShowScrollButton(false);
  }

  return {
    messagesRef: messagesRef,
    scrollRef: scrollRef,
    scrollToBottom: scrollToBottom,
    isAtBottom: isAtBottom,
    showScrollButton: showScrollButton,
    handleNewMessage: handleNewMessage,
    handleManualScroll: handleManualScroll,
  };
}
