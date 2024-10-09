import { uniqueId } from 'lodash';
import React, { useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FileTreeItem } from './FileTreeItem';

export const FileTree = props => {
  const {
    fileStructure,
    setFileStructure,
    moveItem,
    expandedFolders,
    toggleFolder,
    hoveredItem,
    focusedItem,
    selectedItem,
    onHoverFile,
    onFocusFile,
    onSelectFile,
    setSelectedItem,
  } = props;

  const onDragEnd = useCallback(
    result => {
      if (!result.destination) return;

      const { source, destination } = result;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const newFileStructure = Array.from(fileStructure);
      const [reorderedItem] = newFileStructure.splice(source.index, 1);
      newFileStructure.splice(destination.index, 0, reorderedItem);

      setFileStructure(newFileStructure); // Updated to reflect state change in parent
    },
    [fileStructure, setFileStructure]
  );
  const renderFileStructure = useCallback(
    (items, parentPath = '') => {
      return (
        <Droppable droppableId={parentPath || 'root'}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items?.map(
                (item, index) =>
                  item && (
                    <FileTreeItem
                      key={uniqueId('file_')}
                      item={item}
                      index={index}
                      path={`${parentPath}${parentPath ? '.' : ''}${index}`}
                      expandedFolders={expandedFolders}
                      toggleFolder={toggleFolder}
                      isHovered={hoveredItem === item.id}
                      isFocused={focusedItem === item.id}
                      isSelected={selectedItem === item.id}
                      onHover={onHoverFile}
                      onFocus={onFocusFile}
                      onSelect={onSelectFile}
                      setSelectedItem={setSelectedItem}
                    >
                      {item.type === 'folder' &&
                        expandedFolders[item.id] &&
                        item.children &&
                        renderFileStructure(
                          item.children,
                          `${parentPath}${parentPath ? '.' : ''}${index}`
                        )}
                    </FileTreeItem>
                  )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    },
    [
      expandedFolders,
      hoveredItem,
      focusedItem,
      selectedItem,
      toggleFolder,
      onHoverFile,
      onFocusFile,
      onSelectFile,
      setSelectedItem,
    ]
  );
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {renderFileStructure(fileStructure)}
    </DragDropContext>
  );
};

export default React.memo(FileTree);
