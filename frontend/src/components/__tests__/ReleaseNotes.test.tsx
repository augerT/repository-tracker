import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReleaseNotes from '../ReleaseNotes';
import { Repository } from '../../types/repository';

describe('ReleaseNotes', () => {
  const mockRepo: Repository = {
    id: 1,
    name: 'facebook/react',
    owner: 'facebook',
    version: 'v18.2.0',
    releaseDate: '1705276800000', // January 14, 2024 (corrected)
    releaseNotes: '## Bug Fixes\n\n- Fixed memory leak\n- Improved performance\n\n## New Features\n\n- Added concurrent rendering',
    seenByUser: false,
  };

  it('should show placeholder message when no repository is selected', () => {
    render(<ReleaseNotes repo={null} />);

    expect(screen.getByText('Select a repository to view release notes')).toBeInTheDocument();
  });

  it('should not show release details when no repository is selected', () => {
    render(<ReleaseNotes repo={null} />);

    expect(screen.getByText('Select a repository to view release notes')).toBeInTheDocument();
    expect(screen.queryByText(/version/i)).not.toBeInTheDocument();
  });

  it('should display repository name in heading', () => {
    render(<ReleaseNotes repo={mockRepo} />);

    expect(screen.getByText('facebook/react Release Notes')).toBeInTheDocument();
  });

  it('should display version number', () => {
    render(<ReleaseNotes repo={mockRepo} />);

    expect(screen.getByText(/Version: v18\.2\.0/)).toBeInTheDocument();
  });

  it('should format and display release date', () => {
    render(<ReleaseNotes repo={mockRepo} />);

    expect(screen.getByText(/Released on/)).toBeInTheDocument();
    expect(screen.getByText(/January 14, 2024/)).toBeInTheDocument();
  });

  it('should not display date section when releaseDate is null', () => {
    const repoWithoutDate = { ...mockRepo, releaseDate: null };

    render(<ReleaseNotes repo={repoWithoutDate} />);

    expect(screen.queryByText(/Released on/)).not.toBeInTheDocument();
  });

  it('should not display date section when releaseDate is undefined', () => {
    const repoWithoutDate = { ...mockRepo, releaseDate: undefined };

    render(<ReleaseNotes repo={repoWithoutDate} />);

    expect(screen.queryByText(/Released on/)).not.toBeInTheDocument();
  });

  it('should render markdown headers', () => {
    render(<ReleaseNotes repo={mockRepo} />);

    expect(screen.getByText('Bug Fixes')).toBeInTheDocument();
    expect(screen.getByText('New Features')).toBeInTheDocument();
  });

  it('should render markdown list items', () => {
    render(<ReleaseNotes repo={mockRepo} />);

    expect(screen.getByText('Fixed memory leak')).toBeInTheDocument();
    expect(screen.getByText('Improved performance')).toBeInTheDocument();
    expect(screen.getByText('Added concurrent rendering')).toBeInTheDocument();
  });

  it('should handle empty release notes', () => {
    const repoWithEmptyNotes = { ...mockRepo, releaseNotes: '' };

    render(<ReleaseNotes repo={repoWithEmptyNotes} />);

    expect(screen.getByText('facebook/react Release Notes')).toBeInTheDocument();
    expect(screen.getByText(/Version: v18\.2\.0/)).toBeInTheDocument();
  });

  it('should handle plain text release notes', () => {
    const repoWithPlainText = {
      ...mockRepo,
      releaseNotes: 'This is a simple release with bug fixes.',
    };

    render(<ReleaseNotes repo={repoWithPlainText} />);

    expect(screen.getByText('This is a simple release with bug fixes.')).toBeInTheDocument();
  });

  it('should handle complex markdown formatting', () => {
    const repoWithComplexMarkdown = {
      ...mockRepo,
      releaseNotes: '# Major Release\n\n**Bold text** and *italic text*\n\n- Item 1\n- Item 2\n\n```js\nconst x = 1;\n```',
    };

    render(<ReleaseNotes repo={repoWithComplexMarkdown} />);

    expect(screen.getByText('Major Release')).toBeInTheDocument();
    expect(screen.getByText(/Bold text/)).toBeInTheDocument();
    expect(screen.getByText(/italic text/)).toBeInTheDocument();
  });

  it('should display different repositories correctly', () => {
    const { rerender } = render(<ReleaseNotes repo={mockRepo} />);

    expect(screen.getByText('facebook/react Release Notes')).toBeInTheDocument();

    const differentRepo: Repository = {
      id: 2,
      name: 'vuejs/vue',
      owner: 'vuejs',
      version: 'v3.3.4',
      releaseDate: '1673784600000',
      releaseNotes: '## Vue 3.3.4 Release',
      seenByUser: false,
    };

    rerender(<ReleaseNotes repo={differentRepo} />);

    expect(screen.getByText('vuejs/vue Release Notes')).toBeInTheDocument();
    expect(screen.getByText(/Version: v3\.3\.4/)).toBeInTheDocument();
    expect(screen.getByText('Vue 3.3.4 Release')).toBeInTheDocument();
  });

  it('should handle switching from selected repo to no selection', () => {
    const { rerender } = render(<ReleaseNotes repo={mockRepo} />);

    expect(screen.getByText('facebook/react Release Notes')).toBeInTheDocument();

    rerender(<ReleaseNotes repo={null} />);

    expect(screen.queryByText('facebook/react Release Notes')).not.toBeInTheDocument();
    expect(screen.getByText('Select a repository to view release notes')).toBeInTheDocument();
  });

  it('should format dates correctly for different timestamps', () => {
    const repoWithDifferentDate = {
      ...mockRepo,
      releaseDate: '1735689600000', // December 31, 2024
    };

    render(<ReleaseNotes repo={repoWithDifferentDate} />);

    expect(screen.getByText(/December 31, 2024/)).toBeInTheDocument();
  });
});