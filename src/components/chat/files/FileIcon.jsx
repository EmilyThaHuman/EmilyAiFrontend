import PropTypes from 'prop-types';
import React from 'react';
import {
  FaFileAlt,
  FaFileCode,
  FaFileImage,
  FaFile,
  FaFileCsv,
  FaFileWord,
  FaFilePdf,
  FaRegFile,
} from 'react-icons/fa';

export const FileIcon = React.memo(
  ({ type, size = 32, iconColor = '#BDBDBD' }) => {
    const iconMap = {
      image: FaFileImage,
      pdf: FaFilePdf,
      csv: FaFileCsv,
      docx: FaFileWord,
      plain: FaFileAlt,
      json: FaFileCode,
      markdown: FaRegFile,
      javascript: FaFileCode,
      txt: FaFileAlt,
    };

    const IconComponent = iconMap[type] || FaFile;
    return <IconComponent size={size} color={iconColor} />;
  }
);

FileIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number,
  iconColor: PropTypes.string,
};

FileIcon.displayName = 'FileIcon';
