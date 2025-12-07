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

// Hardcoded data
const mockRepos = [
  {
    id: 1,
    name: 'vue.js',
    owner: 'vuejs',
    version: '10.2.2020-05-10',
    releaseNotes: `Welcome to the September 2019 release of Visual Studio Code. There are a number of updates in this version that we hope you will like, some of the key highlights include:

**Text selections displayed in minimap** - See selection locations at a glance in the minimap overview.
**Toggle region folding keyboard shortcut** - Quickly expand and collapse regions with Toggle Fold.
**Source Control tree view** - Display pending changes in either a list or new tree view.
**Open terminal in custom working directory** - Add keyboard shortcuts for specific folders.
**HTML ARIA attribute reference** - ARIA attributes now have descriptions and links to MDN documentation.`
  },
  {
    id: 2,
    name: 'vscode',
    owner: 'microsoft',
    version: '10.2.2020-05-10',
    releaseNotes: 'Release notes for VS Code...'
  },
  {
    id: 3,
    name: 'tensorflow',
    owner: 'tensorflow',
    version: '10.2.2020-05-10',
    releaseNotes: 'TensorFlow latest release information...'
  },
  {
    id: 4,
    name: 'lodash',
    owner: 'lodash',
    version: '10.2.2020-05-10',
    releaseNotes: 'Lodash utility library updates...'
  },
];

function App() {
  const [repos, setRepos] = useState(mockRepos);
  const [selectedRepo, setSelectedRepo] = useState<typeof mockRepos[0] | null>(mockRepos[0]);

  const handleAddRepo = (owner: string, name: string) => {
    const newRepo = {
      id: repos.length + 1,
      name,
      owner,
      version: 'N/A',
      releaseNotes: 'No release notes available yet.'
    };
    setRepos([...repos, newRepo]);
  };

  const handleRemoveRepo = (id: number) => {
    setRepos(repos.filter(repo => repo.id !== id));
    if (selectedRepo?.id === id) {
      setSelectedRepo(repos[0] || null);
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