import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface Repo {
  id: number;
  name: string;
  owner: string;
  version: string;
  releaseNotes: string;
}

interface ReleaseNotesProps {
  repo: Repo | null;
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