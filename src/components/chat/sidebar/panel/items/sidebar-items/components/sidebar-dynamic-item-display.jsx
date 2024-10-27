import AddIcon from '@mui/icons-material/Add'; // Example of a Material UI icon
import { Box, Typography, IconButton, Tooltip, TextField } from '@mui/material';
import { DeleteIcon, EditIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

function DynamicItemDisplay({
  spaces,
  item,
  icon,
  onEdit,
  onDelete,
  onSelect,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const itemRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(item.id, editedName); // Assuming onEdit is a prop function to update the item
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    onDelete(item.id); // Assuming onDelete is a prop function to delete the item
  };

  const handleChange = event => {
    setEditedName(event.target.value);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      console.log(`Item clicked: ${item.name}`);
    }
  };

  const handleClickAction = e => {
    e.stopPropagation();
    console.log(`Item clicked: ${item.name}`);
    onSelect(item);
    console.log(`Selected ${item.name}`);
    onSelect(item);
  };

  return (
    <Box
      ref={itemRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        borderRadius: 1,
        cursor: 'pointer',
        width: '100%',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          opacity: 0.8,
        },
        outline: 'none',
      }}
      tabIndex={0}
      onClick={handleClickAction}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        {isEditing ? (
          <TextField
            value={editedName}
            onChange={handleChange}
            onBlur={handleEdit}
            onKeyDown={handleKeyDown}
            // autoFocus
            size="small"
          />
        ) : (
          <Typography
            variant="subtitle1"
            sx={{
              marginLeft: 3,
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 'bold',
            }}
          >
            {item.name}
          </Typography>
        )}
      </div>

      {isHovering && (
        <Tooltip title={`Start chat with ${item.name}`} arrow>
          <IconButton onClick={handleEdit} aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export default DynamicItemDisplay;
