import PropTypes from 'prop-types';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

export const MemoizedReactMarkdown = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

MemoizedReactMarkdown.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default { MemoizedReactMarkdown };
