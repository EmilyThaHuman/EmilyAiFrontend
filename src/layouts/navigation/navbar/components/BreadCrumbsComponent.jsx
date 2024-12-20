// BreadcrumbsComponent.js
import { Box, Breadcrumbs, Link } from '@mui/material';
import { uniqueId } from 'lodash';

import constants from 'config/constants';
import { extractPaths, findBreadcrumbs } from 'utils/navigation';

export const BreadcrumbsComponent = ({ pathName, brandText, routes }) => {
  const { PUBLIC_URL } = constants;
  const linkPaths = extractPaths(routes);
  const breadcrumbs = findBreadcrumbs(pathName, linkPaths);
  let crumbs = [];
  let header = '';
  breadcrumbs.forEach((crumb, index) => {
    if (index === breadcrumbs.length - 1) {
      header = crumb.text;
    } else {
      crumbs.push(crumb);
    }
  });

  const mainText = '#1B254B';

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          href={`${PUBLIC_URL}/`}
          color="inherit"
          sx={{ fontSize: 'sm', marginBottom: '5px' }}
        >
          Pages
        </Link>
        {crumbs.map((breadcrumb, index) => (
          <Link
            key={uniqueId()}
            href={`${PUBLIC_URL}${breadcrumb.link}`}
            color="inherit"
            sx={{ fontSize: 'sm', marginBottom: '5px' }}
          >
            {breadcrumb.text}
          </Link>
        ))}
      </Breadcrumbs>
      <Link
        href="/"
        color={mainText}
        sx={{
          bg: 'inherit',
          borderRadius: 'inherit',
          fontWeight: 'bold',
          fontSize: '34px',
          '&:hover': { color: mainText },
          '&:active': {
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          },
          '&:focus': {
            boxShadow: 'none',
          },
        }}
      >
        {header.length === 0 ? brandText : header}
      </Link>
    </Box>
  );
};

export default BreadcrumbsComponent;
