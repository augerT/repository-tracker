import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';

interface AddRepoProps {
  onAdd: (owner: string, name: string) => void;
  onSyncAll: () => void;
}

const AddRepo: React.FC<AddRepoProps> = ({ onAdd, onSyncAll }) => {
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (owner.trim() && name.trim()) {
      onAdd(owner.trim(), name.trim());
      setOwner('');
      setName('');
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Add New Repository
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SyncIcon />}
            onClick={onSyncAll}
            size="small"
          >
            Refresh
          </Button>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
        >
          <TextField
            label="Owner"
            placeholder="e.g., facebook"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Repository"
            placeholder="e.g., react"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddRepo;