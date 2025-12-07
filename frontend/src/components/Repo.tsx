import React from 'react';
import {
  ListItem,
  ListItemButton,
  IconButton,
  Box,
  Typography,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RepoProps {
  id: number;
  name: string;
  owner: string;
  version: string;
  isSelected: boolean;
  seenByUser: boolean;
  onSelect: () => void;
  onRemove: (id: number) => void;
}

const Repo: React.FC<RepoProps> = ({
  id,
  name,
  seenByUser,
  version,
  isSelected,
  onSelect,
  onRemove
}) => {
  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      sx={{
        borderBottom: '1px solid #e0e0e0',
        bgcolor: isSelected ? '#f0f4ff' : 'transparent',
      }}
    >
      <ListItemButton onClick={onSelect}>
        <Box sx={{ width: '100%', pr: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea' }}>
            {name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Chip
              label={version}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: '20px',
                bgcolor: isSelected ? '#667eea' : '#e0e0e0',
                color: isSelected ? 'white' : 'text.secondary'
              }}
            />
            {!seenByUser && (
              <Chip
                label="New"
                size="small"
                color="success"
                sx={{
                  fontSize: '0.7rem',
                  height: '20px',
                  fontWeight: 600
                }}
              />
            )}
          </Box>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default Repo;