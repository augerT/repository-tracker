import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Repo from '../Repo';

describe('Repo', () => {
  const mockRepo = {
    id: 1,
    name: 'facebook/react',
    owner: 'facebook',
    version: 'v18.2.0',
    seenByUser: false,
    isSelected: false,
  };

  it('should render repository information', () => {
    const mockOnSelect = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <Repo 
        { ...mockRepo }
        onSelect = { mockOnSelect }
        onRemove = { mockOnRemove }
      />
    );

    expect(screen.getByText('facebook/react')).toBeInTheDocument();
    expect(screen.getByText('v18.2.0')).toBeInTheDocument();
  });

  it('should render "New" badge when seenByUser is false', () => {
    const mockOnSelect = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <Repo 
        { ...mockRepo }
        onSelect = { mockOnSelect }
        onRemove = { mockOnRemove }
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should not render "New" badge when seenByUser is true', () => {
    const mockOnSelect = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <Repo 
        { ...mockRepo }
        seenByUser = { true}
        onSelect = { mockOnSelect }
        onRemove = { mockOnRemove }
      />
    );

    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('should call onSelect when repo is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <Repo 
        { ...mockRepo }
        onSelect = { mockOnSelect }
        onRemove = { mockOnRemove }
      />
    );

    const repoButton = screen.getByRole('button', { name: /facebook\/react/i });
    await user.click(repoButton);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should call onRemove with repo id when delete button clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <Repo 
        { ...mockRepo }
        onSelect = { mockOnSelect }
        onRemove = { mockOnRemove }
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnRemove).toHaveBeenCalledWith(1);
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('should not call onSelect when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <Repo 
        { ...mockRepo }
        onSelect = { mockOnSelect }
        onRemove = { mockOnRemove }
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should highlight when selected', () => {
    const mockOnSelect = vi.fn();
    const mockOnRemove = vi.fn();

    const { container } = render(
      <Repo 
        { ...mockRepo }
        isSelected = { true}
        onSelect = { mockOnSelect }
        onRemove = { mockOnRemove }
      />
    );

    const listItem = container.querySelector('.MuiListItem-root');
    expect(listItem).toHaveStyle({ backgroundColor: 'rgb(240, 244, 255)' });
  });

});