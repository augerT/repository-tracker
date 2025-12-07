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
      <Box sx={{
        '& p': { mb: 2, lineHeight: 1.7 },
        '& ul': { pl: 3, mb: 2 },
        '& ol': { pl: 3, mb: 2 },
        '& li': { mb: 1 },
        '& h1': { fontSize: '2rem', fontWeight: 600, mb: 2, mt: 3 },
        '& h2': { fontSize: '1.5rem', fontWeight: 600, mb: 2, mt: 2 },
        '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1.5, mt: 2 },
        '& strong': { fontWeight: 600, color: '#667eea' },
        '& code': {
          bgcolor: '#f5f5f5',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.9em',
          fontFamily: 'monospace'
        },
        '& pre': {
          bgcolor: '#f5f5f5',
          p: 2,
          borderRadius: '4px',
          overflow: 'auto',
          mb: 2
        },
        '& a': {
          color: '#667eea',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '& blockquote': {
          borderLeft: '4px solid #667eea',
          pl: 2,
          ml: 0,
          fontStyle: 'italic',
          color: 'text.secondary'
        }
      }}>
        <ReactMarkdown>{repo.releaseNotes}</ReactMarkdown>
      </Box>
    </Paper>
  );
};

export default ReleaseNotes;