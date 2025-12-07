import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import RepoList from './components/RepoList';
import ReleaseNotes from './components/ReleaseNotes';
import AddRepo from './components/AddRepo';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

// Type definition for a repository
export interface Repository {
  id: number;
  name: string;
  owner: string;
  version: string;
  releaseNotes: string;
}

function App() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const handleAddRepo = (owner: string, name: string) => {
    const newRepo: Repository = {
      id: Date.now(), // Use timestamp as simple unique ID
      name,
      owner,
      version: 'N/A',
      releaseNotes: 'No release notes available yet.'
    };
    setRepos([...repos, newRepo]);

    // Auto-select the first repo if none selected
    if (!selectedRepo) {
      setSelectedRepo(newRepo);
    }
  };

  const handleRemoveRepo = (id: number) => {
    const updatedRepos = repos.filter(repo => repo.id !== id);
    setRepos(updatedRepos);

    // If we removed the selected repo, select the first available one
    if (selectedRepo?.id === id) {
      setSelectedRepo(updatedRepos[0] || null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppBar position="static" sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Repository Tracker
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Left Side - Repository List */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AddRepo onAdd={handleAddRepo} />
                <RepoList
                  repos={repos}
                  selectedRepo={selectedRepo}
                  onSelectRepo={setSelectedRepo}
                  onRemoveRepo={handleRemoveRepo}
                />
              </Box>
            </Grid>

            {/* Right Side - Release Notes */}
            <Grid size={{ xs: 12, md: 8 }}>
              <ReleaseNotes repo={selectedRepo} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;