import { uniqueId } from 'lodash';

/**
 * Analyzes a set of routes and extracts relevant information about them.
 *
 * @param {Array} routes - An array of route objects, potentially with nested child routes.
 * @returns {Object} - An object containing:
 *   - routeInfo: An array of route information objects.
 *   - routeInfoMap: A recursive routes map with routes containing the new data structure and subpaths in an 'items' array.
 */
export function analyzeRoutes(routes) {
  const routeInfo = [];

  // Helper function to check if a route is dynamic (contains ':')
  const isDynamicRoute = path => path.includes(':');

  // Helper function to clean up multiple slashes
  const cleanPath = path => path.replace(/\/{2,}/g, '/');

  // Recursive function to traverse and extract route details and build routeInfoMap
  const traverseRoutes = (routeArray, parentPath = '') => {
    return routeArray.map(route => {
      let currentPath = cleanPath(parentPath + (route.path || ''));

      // Build the route data
      const routeData = {
        id: uniqueId(currentPath),
        title: route.title || route.name || 'Untitled',
        path: currentPath,
        url: `${window.location.origin}${currentPath}`,
        icon: route.icon || null,
      };

      // Add to routeInfo if not root, index, or dynamic route
      if (!route.index && !isDynamicRoute(currentPath) && currentPath !== '/') {
        routeInfo.push(routeData);
      }

      // Recursively handle children if they exist, change 'children' to 'items'
      if (route.children) {
        routeData.items = traverseRoutes(route.children, currentPath + '/');
      }

      return routeData;
    });
  };

  // Start traversing from the root routes
  const routeInfoMap = traverseRoutes(routes);

  return { routeInfo, routeInfoMap };
}
