/*Modules*/
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
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
/*Components*/
import RepoList from './components/RepoList';
import ReleaseNotes from './components/ReleaseNotes';
import AddRepo from './components/AddRepo';
/*GraphQL*/
import { GET_REPOS } from '../apollo/queries';
import { ADD_REPO, REMOVE_REPO, SYNC_ALL_REPOS, MARK_REPO_SEEN } from '../apollo/mutations';
/*Types*/
import { Repository } from './types/repository';

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

// Type the GraphQL response
interface GetReposData {
  trackedRepos: Array<{
    id: number;
    name: string;
    owner: string;
    url: string;
    latestReleaseTag: string | null;
    latestReleaseNotes: string | null;
    latestReleaseDate: string | null;
    seenByUser: boolean;
  }>;
}


function App() {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const { loading, error, data } = useQuery<GetReposData>(GET_REPOS);

  const [addRepoMutation] = useMutation(ADD_REPO, {
    refetchQueries: [{ query: GET_REPOS }],

  });

  const [removeRepoMutation] = useMutation(REMOVE_REPO, {
    refetchQueries: [{ query: GET_REPOS }],
  });

  const [syncAllReposMutation] = useMutation(SYNC_ALL_REPOS, {
    refetchQueries: [{ query: GET_REPOS }],
  });

  const [markRepoSeenMutation] = useMutation(MARK_REPO_SEEN, {
    refetchQueries: [{ query: GET_REPOS }],
  });


  const repos: Repository[] = data?.trackedRepos.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    owner: repo.owner,
    version: repo.latestReleaseTag || 'N/A',
    releaseNotes: repo.latestReleaseNotes || 'No release notes available yet. Try syncing releases to fetch the latest release information.',
    seenByUser: repo.seenByUser,
    releaseDate: repo.latestReleaseDate || null,
  })) || [];

  const handleAddRepo = async (owner: string, name: string) => {
    try {
      await addRepoMutation({
        variables: { owner, name },
      });
    } catch (err) {
      console.error('Error adding repository:', err);
    }
  };

  const handleSyncAll = async () => {
    try {
      await syncAllReposMutation();
    } catch (err) {
      console.error('Error syncing all repositories:', err);
    }
  };

  const handleRemoveRepo = async (id: number) => {
    try {
      await removeRepoMutation({
        variables: { id },
      });

      // If we removed the selected repo, clear selection
      if (selectedRepo?.id === id) {
        setSelectedRepo(null);
      }
    } catch (err) {
      console.error('Error removing repository:', err);
    }
  };

  const handleSelectRepo = async (repo: Repository) => {
    setSelectedRepo(repo);

    // Mark as seen if it hasn't been seen
    if (!repo.seenByUser) {
      try {
        await markRepoSeenMutation({
          variables: { id: repo.id.toString() },
        });
      } catch (err) {
        console.error('Error marking repo as seen:', err);
      }
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography variant="h6">Loading repositories...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography variant="h6" color="error">Error loading repositories: {error.message}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

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
                <AddRepo 
                  onAdd={handleAddRepo} 
                  onSyncAll={handleSyncAll} 
                />
                <RepoList
                  repos={repos}
                  selectedRepo={selectedRepo}
                  onSelectRepo={(repo) => handleSelectRepo(repo)}
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