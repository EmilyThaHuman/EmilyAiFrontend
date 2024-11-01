import { useMemo } from 'react';

export const useFileSearch = (items, searchTerm) => {
  return useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const filterItems = items => {
      return items.reduce((acc, item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchLower);

        if (item.children?.length) {
          const filteredChildren = filterItems(item.children);
          if (matchesSearch || filteredChildren.length) {
            return [...acc, { ...item, children: filteredChildren }];
          }
        } else if (matchesSearch) {
          return [...acc, item];
        }

        return acc;
      }, []);
    };

    return filterItems(items);
  }, [items, searchTerm]);
};

export default useFileSearch;
