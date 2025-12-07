import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Repository } from '../types/repository';


interface ReleaseNotesProps {
  repo: Repository | null;
}

const ReleaseNotes: React.FC<ReleaseNotesProps> = ({ repo }) => {
  if (!repo) {
    return (
      <Paper sx={{ p: 4, minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Select a repository to view release notes
        </Typography>
      </Paper>
    );
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;

    // Unix timestamp
    const timestamp = parseInt(dateString, 10);
    const date = new Date(timestamp);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  };

  return (
    <Paper sx={{ p: 3, minHeight: '500px' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea' }}>
          {repo.name} Release Notes
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
          Version: {repo.version}
        </Typography>
      </Box>
      {repo.releaseDate && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Released on {formatDate(repo.releaseDate)}
      </Typography>
      )}
      <Divider sx={{ mb: 3 }} />
      <ReactMarkdown>{repo.releaseNotes}</ReactMarkdown>
    </Paper>
  );
};

export default ReleaseNotes;