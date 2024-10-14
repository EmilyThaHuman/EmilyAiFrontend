export const promptGenEx = `
# Analysis of SearchableList Component

## Summary
The input describes a React component called SearchableList that renders a filterable list of items with a search functionality.

## Detailed Analysis

### Functions

1. **SearchableList**
   - *Description*: Main component function
   - *Parameters*: { items, searchPlaceholder }
   - *Returns*: JSX

2. **handleSearch**
   - *Description*: Event handler for search input
   - *Parameters*: (event)
   - *Returns*: void (updates state)

### Styles

> The component utilizes Tailwind CSS classes for styling, providing a clean and responsive design.

- \`max-w-md mx-auto mt-8\`
  - Centers the component
  - Adds top margin
- \`bg-white shadow-md rounded-lg\`
  - Applies white background
  - Adds shadow effect
  - Rounds corners of the main container
- \`p-4\`
  - Adds padding to the container
- \`mb-4\`
  - Adds margin to the bottom of the search input
- \`w-full p-2 border rounded\`
  - Styles the search input
- \`list-disc pl-5\`
  - Applies bullet list style with left padding

### Props

| Prop Name | Type | Default | Usage |
|-----------|------|---------|-------|
| items | array | Required | List of items to be displayed and searched |
| searchPlaceholder | string | "Search..." | Placeholder text for the search input |

### Component Overview

**SearchableList**
- *Description*: A reusable component that displays a list of items with a search functionality
- *Purpose*: To provide an interactive, filterable list of items
- *Interactions*:
  1. Renders a search input and a list of items
  2. Filters the list based on the search input
  3. Uses React's useState hook for managing the search term state
  4. Implements real-time filtering as the user types

## Notes and Recommendations

1. **Data Structure Assumption**
   > The component assumes that \`items\` is an array of strings. For more complex data structures, the filtering logic would need to be adjusted.

2. **Search Functionality**
   - The search is case-insensitive, which is a good practice for user-friendly searching.
   - Consider adding debounce to the search function for performance optimization with large lists.

3. **Error Handling**
   - Implement error handling for cases where \`items\` might be undefined or not an array.

4. **Performance Enhancements**
   - For large lists, consider implementing:
     - Pagination
     - Virtualization (e.g., react-window or react-virtualized)

5. **Accessibility**
   - Add proper ARIA labels to improve accessibility for screen readers.

6. **Testing**
   - Implement unit tests to ensure the component behaves correctly with various inputs and edge cases.
`;

export default { promptGenEx };
