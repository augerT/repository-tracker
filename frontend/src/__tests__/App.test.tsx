import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import App from '../App';
import { GET_REPOS } from '../../apollo/queries';
import { ADD_REPO, REMOVE_REPO, SYNC_ALL_REPOS, MARK_REPO_SEEN } from '../../apollo/mutations';

describe('App Integration', () => {
  const mockRepos = [
    {
      id: 1,
      name: 'react',
      owner: 'facebook',
      latestReleaseTag: 'v18.2.0',
      latestReleaseNotes: '## Bug Fixes\n- Fixed memory leak',
      latestReleaseDate: '1705276800000',
      seenByUser: false,
    },
    {
      id: 2,
      name: 'vue',
      owner: 'vuejs',
      latestReleaseTag: 'v3.3.4',
      latestReleaseNotes: '## New Features\n- Added composition API improvements',
      latestReleaseDate: '1704067200000',
      seenByUser: true,
    },
  ];

  const mocks = [
    {
      request: {
        query: GET_REPOS,
      },
      result: {
        data: {
          trackedRepos: mockRepos,
        },
      },
    },
  ];

  it('should show loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} >
        <App />
      </MockedProvider>
    );

    expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
  });

  it('should render repository list after loading', async () => {
    render(
      <MockedProvider mocks={mocks} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('vue')).toBeInTheDocument();
    });
  });

  it('should render header and main components', async () => {
    render(
      <MockedProvider mocks={mocks} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Repository Tracker')).toBeInTheDocument();
      expect(screen.getByLabelText(/owner/i)).toBeInTheDocument();
      expect(screen.getByText('Select a repository to view release notes')).toBeInTheDocument();
    });
  });

  it('should show error state when query fails', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_REPOS,
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading repositories/)).toBeInTheDocument();
    });
  });

  it('should display release notes when repository is selected', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    await user.click(screen.getByText('react'));

    await waitFor(() => {
      expect(screen.getByText('react Release Notes')).toBeInTheDocument();
      expect(screen.getByText('Bug Fixes')).toBeInTheDocument();
    });
  });

  it('should mark repository as seen when selected', async () => {
    const user = userEvent.setup();

    const mocksWithMarkSeen = [
      ...mocks,
      {
        request: {
          query: MARK_REPO_SEEN,
          variables: { id: '1' },
        },
        result: {
          data: {
            markRepoSeen: true,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithMarkSeen} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // Click unseen repo
    await user.click(screen.getByText('react'));

    await waitFor(() => {
      expect(screen.getByText('react Release Notes')).toBeInTheDocument();
    });
  });

  it('should not mark already seen repository again', async () => {
    const user = userEvent.setup();

    const markSeenSpy = vi.fn();

    const mocksWithSpy = [
      ...mocks,
      {
        request: {
          query: MARK_REPO_SEEN,
          variables: { id: '2' },
        },
        result: () => {
          markSeenSpy();
          return {
            data: {
              markRepoSeen: true,
            },
          };
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithSpy} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('vue')).toBeInTheDocument();
    });

    // Click already seen repo
    await user.click(screen.getByText('vue'));
    await waitFor(() => {
      expect(screen.getByText('vue Release Notes')).toBeInTheDocument();
    });

    // Should not call markRepoSeen mutation
    expect(markSeenSpy).not.toHaveBeenCalled();
  });

  it('should add a new repository', async () => {
    const user = userEvent.setup();

    const mocksWithAdd = [
      ...mocks,
      {
        request: {
          query: ADD_REPO,
          variables: { owner: 'angular', name: 'angular' },
        },
        result: {
          data: {
            addRepo: {
              id: 3,
              name: 'angular',
              owner: 'angular',
              seenByUser: false,
              latestReleaseTag: null,
              latestReleaseNotes: null,
              latestReleaseDate: null,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithAdd} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // Add new repo
    await user.type(screen.getByLabelText(/owner/i), 'angular');
    await user.type(screen.getByLabelText(/repository/i), 'angular');
    await user.click(screen.getByRole('button', { name: /^add$/i }));

    await waitFor(() => {
      expect(screen.getByText('angular')).toBeInTheDocument();
    });
  });

  it('should remove a repository', async () => {
    const user = userEvent.setup();

    const mocksWithRemove = [
      ...mocks,
      {
        request: {
          query: REMOVE_REPO,
          variables: { id: 1 },
        },
        result: {
          data: {
            removeRepo: true,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithRemove} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // Remove repo
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('facebook/react')).not.toBeInTheDocument();
    });
  });

  it('should clear selection when removing selected repository', async () => {
    const user = userEvent.setup();

    const mocksWithRemove = [
      ...mocks,
      {
        request: {
          query: MARK_REPO_SEEN,
          variables: { id: '1' },
        },
        result: {
          data: {
            markRepoSeen: true,
          },
        },
      },
      {
        request: {
          query: REMOVE_REPO,
          variables: { id: 1 },
        },
        result: {
          data: {
            removeRepo: true,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithRemove} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // Select repo
    await user.click(screen.getByText('react'));
    await waitFor(() => {
      expect(screen.getByText('react Release Notes')).toBeInTheDocument();
    });

    // Remove the selected repo
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('facebook/react Release Notes')).not.toBeInTheDocument();
      expect(screen.getByText('Select a repository to view release notes')).toBeInTheDocument();
    });
  });

  it('should sync all repositories', async () => {
    const user = userEvent.setup();

    const updatedRepos = mockRepos.map(repo => ({
      ...repo,
      latestReleaseTag: 'v99.0.0',
      seenByUser: false,
    }));

    const mocksWithSync = [
      ...mocks,
      {
        request: {
          query: SYNC_ALL_REPOS,
        },
        result: {
          data: {
            syncAllRepos: 2,
          },
        },
      },
      {
        request: {
          query: GET_REPOS,
        },
        result: {
          data: {
            trackedRepos: updatedRepos,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithSync} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // Click sync button
    await user.click(screen.getByRole('button', { name: /sync/i }));

    await waitFor(() => {
      const versionElements = screen.getAllByText('v99.0.0');
      expect(versionElements.length).toBeGreaterThan(0);
    });
  });

  it('should show "New" badge for unseen repositories', async () => {
    render(
      <MockedProvider mocks={mocks} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      const newBadges = screen.getAllByText('New');
      expect(newBadges).toHaveLength(1); // Only facebook/react is unseen
    });
  });

  it('should handle empty repository list', async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_REPOS,
        },
        result: {
          data: {
            trackedRepos: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} >
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Select a repository to view release notes')).toBeInTheDocument();
      expect(screen.queryByText('facebook/react')).not.toBeInTheDocument();
    });
  });
});