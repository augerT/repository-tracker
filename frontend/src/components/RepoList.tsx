import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  Box,
  Typography,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Repo {
  id: number;
  name: string;
  owner: string;
  version: string;
  releaseNotes: string;
}

interface RepoListProps {
  repos: Repo[];
  selectedRepo: Repo | null;
  onSelectRepo: (repo: Repo) => void;
  onRemoveRepo: (id: number) => void;
}

const RepoList: React.FC<RepoListProps> = ({
  repos,
  selectedRepo,
  onSelectRepo,
  onRemoveRepo
}) => {
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <List sx={{ p: 0 }}>
        {repos.map((repo) => (
          <ListItem
            key={repo.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRepo(repo.id);
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              borderBottom: '1px solid #e0e0e0',
              bgcolor: selectedRepo?.id === repo.id ? '#f0f4ff' : 'transparent',
            }}
          >
            <ListItemButton onClick={() => onSelectRepo(repo)}>
              <Box sx={{ width: '100%', pr: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea' }}>
                  {repo.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                  <Chip
                    label={repo.version}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: '20px',
                      bgcolor: selectedRepo?.id === repo.id ? '#667eea' : '#e0e0e0',
                      color: selectedRepo?.id === repo.id ? 'white' : 'text.secondary'
                    }}
                  />
                  {selectedRepo?.id === repo.id && (
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
        ))}
      </List>
    </Paper>
  );
};

export default RepoList;