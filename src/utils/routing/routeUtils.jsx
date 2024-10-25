import { uniqueId } from 'lodash';

// Function to analyze routes and filter non-root, non-index, and non-dynamic routes
export function analyzeRoutes(routes) {
  const routeInfo = [];

  // Helper function to check if a route is dynamic (contains ':')
  const isDynamicRoute = path => path.includes(':');

  // Recursive function to traverse and extract route details
  const traverseRoutes = (routeArray, parentPath = '') => {
    routeArray.forEach(route => {
      const currentPath = parentPath + (route.path || '');

      // Skip root, index, and dynamic routes
      if (!route.index && !isDynamicRoute(currentPath) && currentPath !== '/') {
        routeInfo.push({
          id: uniqueId(currentPath),
          title: route.title || route.name || 'Untitled',
          path: currentPath,
          link: `${window.location.origin}${currentPath}`,
          icon: route.icon || null,
        });
      }

      // Recursively handle children if they exist
      if (route.children) {
        traverseRoutes(route.children, currentPath + '/');
      }
    });
  };

  // Start traversing from the root routes
  traverseRoutes(routes);

  return routeInfo;
}
