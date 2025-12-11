import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddRepo from '../AddRepo';

describe('AddRepo', () => {
  it('should render form inputs and buttons', () => {
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    expect(screen.getByLabelText(/owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/repository/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sync releases/i })).toBeInTheDocument();
  });

  it('should update input values when typing', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    const ownerInput = screen.getByLabelText(/owner/i);
    const repoInput = screen.getByLabelText(/repository/i);

    await user.type(ownerInput, 'facebook');
    await user.type(repoInput, 'react');

    expect(ownerInput).toHaveValue('facebook');
    expect(repoInput).toHaveValue('react');
  });

  it('should call onAdd with trimmed values when form is submitted', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    await user.type(screen.getByLabelText(/owner/i), 'facebook');
    await user.type(screen.getByLabelText(/repository/i), 'react');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).toHaveBeenCalledWith('facebook', 'react');
  });

  it('should clear inputs after successful submission', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    const ownerInput = screen.getByLabelText(/owner/i);
    const repoInput = screen.getByLabelText(/repository/i);

    await user.type(ownerInput, 'facebook');
    await user.type(repoInput, 'react');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(ownerInput).toHaveValue('');
    expect(repoInput).toHaveValue('');
  });

  it('should trim whitespace from inputs before submitting', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    await user.type(screen.getByLabelText(/owner/i), '  facebook  ');
    await user.type(screen.getByLabelText(/repository/i), '  react  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).toHaveBeenCalledWith('facebook', 'react');
  });

  it('should not call onAdd when owner is empty', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    await user.type(screen.getByLabelText(/repository/i), 'react');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should not call onAdd when repository name is empty', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    await user.type(screen.getByLabelText(/owner/i), 'facebook');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should not call onAdd when inputs contain only whitespace', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    await user.type(screen.getByLabelText(/owner/i), '   ');
    await user.type(screen.getByLabelText(/repository/i), '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should call onSyncAll when sync button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    await user.click(screen.getByRole('button', { name: /sync releases/i }));

    expect(mockOnSyncAll).toHaveBeenCalled();
  });

  it('should submit form when pressing Enter in owner field', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    const ownerInput = screen.getByLabelText(/owner/i);
    await user.type(ownerInput, 'facebook');
    await user.type(screen.getByLabelText(/repository/i), 'react');
    await user.type(ownerInput, '{Enter}');

    expect(mockOnAdd).toHaveBeenCalledWith('facebook', 'react');
  });

  it('should submit form when pressing Enter in repository field', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnSyncAll = vi.fn();

    render(<AddRepo onAdd={mockOnAdd} onSyncAll={mockOnSyncAll} />);

    await user.type(screen.getByLabelText(/owner/i), 'facebook');
    const repoInput = screen.getByLabelText(/repository/i);
    await user.type(repoInput, 'react{Enter}');

    expect(mockOnAdd).toHaveBeenCalledWith('facebook', 'react');
  });
});