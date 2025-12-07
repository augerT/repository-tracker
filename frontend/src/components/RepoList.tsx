import React from 'react';
import { Paper, List } from '@mui/material';
import Repo from './Repo';
import { Repository } from '../types/repository';

interface RepoListProps {
  repos: Repository[];
  selectedRepo: Repository | null;
  onSelectRepo: (repo: Repository) => void;
  onRemoveRepo: (id: number) => void;
}

const RepoList: React.FC<RepoListProps> = ({
  repos,
  selectedRepo,
  onSelectRepo,
  onRemoveRepo
}) => {
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <List sx={{ p: 0 }}>
        {repos.map((repo) => (
          <Repo
            key={repo.id}
            id={repo.id}
            name={repo.name}
            owner={repo.owner}
            version={repo.version}
            seenByUser={repo.seenByUser}
            isSelected={selectedRepo?.id === repo.id}
            onSelect={() => onSelectRepo(repo)}
            onRemove={onRemoveRepo}
          />
        ))}
      </List>
    </Paper>
  );
};

export default RepoList;