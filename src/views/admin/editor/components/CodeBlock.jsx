import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Code from './Code';
import CopyCode from './CopyCode';

const CodeBlockWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[900]}`,
  backgroundColor: theme.palette.common.black,
  padding: theme.spacing(2),
}));

const FileName = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  top: theme.spacing(2),
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.grey[400],
}));

const CopyCodeWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  zIndex: 10,
}));

const CodeWrapper = styled(Box)({
  position: 'relative',
  overflowX: 'auto',
  paddingTop: '40px',
});

const CodeBlock = ({ code, lang, fileName }) => {
  return (
    <CodeBlockWrapper>
      {fileName && <FileName>{fileName}</FileName>}
      <CopyCodeWrapper>
        <CopyCode code={code} />
      </CopyCodeWrapper>
      <CodeWrapper>
        <Code code={code} lang={lang} />
      </CodeWrapper>
    </CodeBlockWrapper>
  );
};

export default CodeBlock;
