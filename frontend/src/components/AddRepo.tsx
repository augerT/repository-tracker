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

interface AddRepoProps {
  onAdd: (owner: string, name: string) => void;
}

const AddRepo: React.FC<AddRepoProps> = ({ onAdd }) => {
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
        <Typography variant="h6" gutterBottom>
          Add New Repository
        </Typography>
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