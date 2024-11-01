import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { MessageCodeBlock } from './CodeBlock';

export const MessageMarkdownMemoized = memo(
  /**
   * A memoized wrapper component for ReactMarkdown.
   * @param {Object} props - The props to be passed to the ReactMarkdown component.
   * @returns {React.Element} A rendered ReactMarkdown component with the given props.
   */
  function MessageMarkdownMemoized(props) {
    return <ReactMarkdown {...props} />;
  }
);

/**
 * Creates a styled Box component with custom styling for prose content
 * @param {Object} theme - The theme object containing palette and spacing information
 * @returns {Component} A styled Box component with custom CSS rules
 */
const StyledBox = styled(Box)(({ theme }) => ({
  '& .prose': {
    minWidth: '100%',
    color: theme.palette.text.primary,
    '& p': {
      marginBottom: theme.spacing(2),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    '& pre': {
      padding: 0,
    },
  },
}));

/**
 * Renders markdown content with custom styling and component overrides.
 * @param {Object} props - The component props.
 * @param {string} props.content - The markdown content to be rendered.
 * @returns {JSX.Element} A styled box containing the rendered markdown content.
 */
export const MessageMarkdown = ({ content }) => {
  return (
    <StyledBox>
      <MessageMarkdownMemoized
        className="prose"
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          p({ children }) {
            return <Typography paragraph>{children}</Typography>;
          },
          img({ node, ...props }) {
            return <Box component="img" sx={{ maxWidth: '67%' }} {...props} />;
          },
          code({ node, className, children, ...props }) {
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0];
            const firstChildAsString = React.isValidElement(firstChild)
              ? firstChild.props.children
              : firstChild;

            if (firstChildAsString === '▍') {
              return (
                <Box
                  component="span"
                  sx={{
                    mt: 1,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    cursor: 'default',
                  }}
                >
                  ▍
                </Box>
              );
            }

            if (typeof firstChildAsString === 'string') {
              childArray[0] = firstChildAsString.replace('`▍`', '▍');
            }

            const match = /language-(\w+)/.exec(className || '');

            if (
              typeof firstChildAsString === 'string' &&
              !firstChildAsString.includes('\n')
            ) {
              return (
                <Typography component="code" className={className} {...props}>
                  {childArray}
                </Typography>
              );
            }

            return (
              <MessageCodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(childArray).replace(/\n$/, '')}
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </MessageMarkdownMemoized>
    </StyledBox>
  );
};

MessageMarkdown.displayName = 'MessageMarkdown';

export default MessageMarkdown;
