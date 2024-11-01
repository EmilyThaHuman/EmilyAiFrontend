import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { TreeView } from '@mui/lab';
import './tree-styles.css';
import { Box, Menu, MenuItem, OutlinedInput, Typography } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default class Tree extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        name: 'Earth',
        type: 'directory',
        children: [
          {
            name: 'Asia',
            type: 'directory',
            children: [
              { name: 'India', type: 'file' },
              { name: 'China', type: 'file' },
              { name: 'Japan', type: 'file' },
              { name: 'South Korea', type: 'file' },
              { name: 'U.A.E', type: 'file' },
              { name: 'Jordan', type: 'file' },
            ],
          },
          {
            name: 'Americas',
            type: 'directory',
            children: [
              { name: 'USA', type: 'file' },
              { name: 'Canada', type: 'file' },
              { name: 'Brazil', type: 'file' },
              { name: 'Mexico', type: 'file' },
              { name: 'Chile', type: 'file' },
            ],
          },
          {
            name: 'Europe',
            type: 'directory',
            children: [
              { name: 'France', type: 'file' },
              { name: 'United Kingdom', type: 'file' },
              { name: 'Germany', type: 'file' },
              { name: 'Russia', type: 'file' },
              { name: 'Turkey', type: 'file' },
              { name: 'Sweden', type: 'file' },
            ],
          },
          {
            name: 'Africa',
            type: 'directory',
            children: [
              { name: 'Egypt', type: 'file' },
              { name: 'South Africa', type: 'file' },
              { name: 'Morocco', type: 'file' },
              { name: 'Nigeria', type: 'file' },
              { name: 'Ghana', type: 'file' },
              { name: 'Ivory Coast', type: 'file' },
            ],
          },
          { name: 'Australia', type: 'directory', children: [] },
          { name: 'Antarctica', type: 'directory', children: [] },
        ],
      },
      activeItemId: null,
      rename: false,
      contextMenuPosition: null,
      value: '',
      deleteDialogProps: null,
      isDirectory: null,
    };
  }

  onDragEnd = result => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    const sourcePathArray = source.droppableId.split('/');
    const destPathArray = destination.droppableId.split('/');

    let sourceParent = this.state.data;
    let destParent = this.state.data;

    // Navigate to the source parent
    for (let i = 1; i < sourcePathArray.length; i++) {
      sourceParent = sourceParent.children.find(
        child => child.name === sourcePathArray[i]
      );
    }

    // Navigate to the destination parent
    for (let i = 1; i < destPathArray.length; i++) {
      destParent = destParent.children.find(
        child => child.name === destPathArray[i]
      );
    }

    // Remove from source
    const [removed] = sourceParent.children.splice(source.index, 1);

    // Add to destination
    destParent.children.splice(destination.index, 0, removed);

    this.setState({ data: this.state.data });
  };

  textChange = event => {
    this.setState({ value: event.target.value });
  };

  keyPress = (event, path) => {
    var { data, value } = this.state;
    if (event.keyCode === 13) {
      if (value) {
        var i = 1;
        const pathArray = path.split('/');
        data.children.forEach(function iter(a) {
          if (i === pathArray.length - 1) {
            if (a.name === pathArray[i]) {
              a.name = value;
            }
          } else {
            if (a.name === pathArray[i]) {
              i += 1;
              a.children.forEach(iter);
            }
          }
        });
      }
      event.target.blur();
    }
    if (event.keyCode === 27) {
      event.persist();
      event.target.blur();
    }
  };

  toggleRename = () => {
    if (!this.state.rename) {
      this.hideContextMenu();
      setTimeout(() => {
        this.setState({ rename: true });
      }, 500);
    } else {
      this.setState({ rename: false, value: '' }, () => {
        this.setState({ activeItemId: null, isDirectory: null });
      });
    }
  };

  showContextMenu = (event, path, type) => {
    const xPos = event.clientX;
    const yPos = event.clientY;
    if (type !== 'directory') {
      this.setState({ activeItemId: path }, () => {
        this.setState({ contextMenuPosition: { x: xPos, y: yPos } });
      });
    }
  };

  hideContextMenu = () => {
    this.setState({ contextMenuPosition: null, isDirectory: null });
  };

  deleteObject = () => {
    var { data, activeItemId } = this.state;
    var i = 1;
    const pathArray = activeItemId.split('/');
    data.children.forEach(function del(a) {
      if (a.name === pathArray[i]) {
        i += 1;
        if (i === pathArray.length - 1) {
          a.children.splice(
            a.children.findIndex(item => item.name === pathArray[i]),
            1
          );
        } else {
          a.children.forEach(del);
        }
      }
    });
    this.setState({
      deleteDialogProps: null,
      activeItemId: null,
      contextMenuPosition: null,
      isDirectory: null,
    });
  };

  render() {
    const {
      data,
      activeItemId,
      rename,
      contextMenuPosition,
      value,
      isDirectory,
    } = this.state;

    const customLabel = (data, path) => {
      if (rename) {
        return (
          <>
            {path !== activeItemId && data.name}
            {path === activeItemId && (
              <OutlinedInput
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                value={value}
                onChange={event => {
                  this.textChange(event);
                }}
                onFocus={event => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
                onBlur={event => {
                  this.toggleRename();
                  event.stopPropagation();
                }}
                onKeyDown={event => {
                  this.keyPress(event, path);
                  event.stopPropagation();
                }}
              />
            )}
          </>
        );
      }
      return data.name;
    };

    const TreeRender = (data, filePath) => {
      var path;
      if (!filePath) {
        path = `${data.name}`;
      } else {
        path = `${filePath}/${data.name}`;
      }

      const isChildren = data.children && data.children.length > 0;

      if (!rename) {
        if (data.type === 'directory') {
          return (
            <Droppable droppableId={path} key={path}>
              {provided => (
                <TreeItem
                  nodeId={path}
                  label={data.name}
                  onContextMenu={event => {
                    this.showContextMenu(event, path, data.type);
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {isChildren &&
                    data.children.map((node, index) => (
                      <Draggable
                        key={node.name}
                        draggableId={`${path}/${node.name}`}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {TreeRender(node, path)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </TreeItem>
              )}
            </Droppable>
          );
        } else {
          return (
            <Draggable
              key={data.name}
              draggableId={path}
              index={parseInt(path.split('/').pop())}
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TreeItem
                    nodeId={path}
                    label={data.name}
                    onContextMenu={event => {
                      this.showContextMenu(event, path, data.type);
                      event.stopPropagation();
                      event.preventDefault();
                    }}
                  />
                </div>
              )}
            </Draggable>
          );
        }
      } else {
        if (data.type === 'directory') {
          return (
            <TreeItem nodeId={path} label={customLabel(data, path)}>
              {isChildren &&
                data.children.map((node, index) => TreeRender(node, path))}
            </TreeItem>
          );
        } else {
          return <TreeItem nodeId={path} label={customLabel(data, path)} />;
        }
      }
    };

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <TreeView
          defaultCollapseIcon={<ArrowDropDown />}
          defaultExpandIcon={<ArrowRight />}
        >
          {TreeRender(data)}
        </TreeView>
        {contextMenuPosition && (
          <Menu
            keepMounted
            open={contextMenuPosition !== null}
            onClose={this.hideContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenuPosition !== null
                ? { top: contextMenuPosition.y, left: contextMenuPosition.x }
                : undefined
            }
          >
            {activeItemId && (
              <MenuItem
                onClick={event => {
                  this.toggleRename();
                  event.stopPropagation();
                  event.preventDefault();
                }}
              >
                Rename
              </MenuItem>
            )}
            {activeItemId && (
              <MenuItem
                onClick={() => {
                  this.deleteObject();
                }}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        )}
        <Typography>Right click on a country to Rename / Delete it</Typography>
      </DragDropContext>
    );
  }
}
