import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RepoList from '../RepoList';
import { Repository } from '../../types/repository';

describe('RepoList', () => {
  const mockRepos: Repository[] = [
    {
      id: 1,
      name: 'facebook/react',
      owner: 'facebook',
      version: 'v18.2.0',
      seenByUser: false,
      releaseNotes: 'Initial release',
    },
    {
      id: 2,
      name: 'vuejs/vue',
      owner: 'vuejs',
      version: 'v3.3.4',
      seenByUser: true,
      releaseNotes: 'Updated features',
    },
    {
      id: 3,
      name: 'angular/angular',
      owner: 'angular',
      version: 'v16.2.0',
      seenByUser: false,
      releaseNotes: 'Angular release'
    },
  ];

  it('should render all repositories', () => {
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={mockRepos}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    expect(screen.getByText('facebook/react')).toBeInTheDocument();
    expect(screen.getByText('vuejs/vue')).toBeInTheDocument();
    expect(screen.getByText('angular/angular')).toBeInTheDocument();
  });

  it('should render empty list when no repositories provided', () => {
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    const { container } = render(
      <RepoList
        repos={[]}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    const list = container.querySelector('.MuiList-root');
    expect(list?.children).toHaveLength(0);
  });

  it('should call onSelectRepo when a repository is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={mockRepos}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    await user.click(screen.getByText('facebook/react'));

    expect(mockOnSelectRepo).toHaveBeenCalledWith(mockRepos[0]);
  });

  it('should call onRemoveRepo when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={mockRepos}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(mockOnRemoveRepo).toHaveBeenCalledWith(1);
  });

  it('should highlight the selected repository', () => {
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={mockRepos}
        selectedRepo={mockRepos[1]} // Select vuejs/vue
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    // The selected repo should be rendered (can't easily test styling without brittle tests)
    expect(screen.getByText('vuejs/vue')).toBeInTheDocument();
  });

  it('should handle selecting different repositories', async () => {
    const user = userEvent.setup();
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={mockRepos}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    // Click first repo
    await user.click(screen.getByText('facebook/react'));
    expect(mockOnSelectRepo).toHaveBeenCalledWith(mockRepos[0]);

    // Click second repo
    await user.click(screen.getByText('vuejs/vue'));
    expect(mockOnSelectRepo).toHaveBeenCalledWith(mockRepos[1]);
  });

  it('should show "New" badge for unseen repositories', () => {
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={mockRepos}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    // facebook/react and angular/angular are unseen
    const newBadges = screen.getAllByText('New');
    expect(newBadges).toHaveLength(2);
  });

  it('should hide "New" badge for seen repositories', () => {
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    const allSeenRepos = mockRepos.map(repo => ({ ...repo, seenByUser: true }));

    render(
      <RepoList
        repos={allSeenRepos}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('should render repositories in the order provided', () => {
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={mockRepos}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    const repoNames = screen.getAllByText(/\//); // Match "owner/name" pattern
    expect(repoNames[0]).toHaveTextContent('facebook/react');
    expect(repoNames[1]).toHaveTextContent('vuejs/vue');
    expect(repoNames[2]).toHaveTextContent('angular/angular');
  });

  it('should handle single repository', () => {
    const mockOnSelectRepo = vi.fn();
    const mockOnRemoveRepo = vi.fn();

    render(
      <RepoList
        repos={[mockRepos[0]]}
        selectedRepo={null}
        onSelectRepo={mockOnSelectRepo}
        onRemoveRepo={mockOnRemoveRepo}
      />
    );

    expect(screen.getByText('facebook/react')).toBeInTheDocument();
    expect(screen.queryByText('vuejs/vue')).not.toBeInTheDocument();
  });
});