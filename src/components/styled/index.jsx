/* eslint-disable no-unused-vars */
import { Box, Paper, alpha } from '@mui/material';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { styled } from 'styled-components';
// --- MAIN UI COMPONENTS --- //
const FlexBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const PaperCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  minWidth: '100%',
  overflowWrap: 'break-word',
  maxWidth: 'max-content',
  height: '100%',
  borderRadius: '20px',
  background: 'border-box rgb(255, 255, 255)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(8),
}));
const StyledIconContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.background.default}`,
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    // color: theme.palette.dark.main,
    backgroundColor: theme.palette.background.hover,
  },
}));
const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: theme.spacing(2),
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  alignContent: 'flex-start',
  textAlign: 'flex-start',
  height: '100%',
}));
const AspectRatioBox = styled(Box)({
  width: '60%', // Take the full width of its parent
  maxHeight: 500, // Maximum height of 80% of the viewport height
  maxWidth: 'calc(500px * 0.707)', // Maintain A4 aspect ratio (0.707 = 1 / √2)
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '1rem',
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    paddingTop: '141.4%', // Height is 141.4% of the width, maintaining A4 aspect ratio
  },
  '& > div': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    margin: 'auto',
  },
});
export const FileTreeWidget = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[800],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.25)
        : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export {
  StyledIconContainer,
  StyledPaper,
  AspectRatioBox,
  FlexBetween,
  PaperCard,
};
