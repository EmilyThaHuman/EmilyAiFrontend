import PropTypes from 'prop-types';
import { formatFileSize } from '@/lib/fileUtils';

/**
 * Displays file information inside a tooltip.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.file - The file object containing file details.
 * @returns {ReactNode} The tooltip content with file information.
 */
export const FileInfoTooltip = ({ item }) => {
  if (!item) {
    return <div>No item information available</div>;
  }

  return (
    <div>
      <p>
        <strong>Name:</strong> {item.name || 'N/A'}
      </p>
      <p>
        <strong>Type:</strong> {item.type || 'N/A'}
      </p>
      <p>
        <strong>Size:</strong> {item.size ? formatFileSize(item.size) : 'N/A'}
      </p>
      <p>
        <strong>Last Modified:</strong>{' '}
        {item.metadata.lastModified
          ? new Date(item.metadata.lastModified).toLocaleString()
          : 'N/A'}
      </p>
    </div>
  );
};

FileInfoTooltip.displayName = 'FileInfoTooltip';

FileInfoTooltip.propTypes = {
  item: PropTypes.object.isRequired,
};

export default FileInfoTooltip;
