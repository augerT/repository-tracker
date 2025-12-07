import React from 'react';
import { Paper, List } from '@mui/material';
import Repo from './Repo';

interface RepoData {
  id: number;
  name: string;
  owner: string;
  version: string;
  releaseNotes: string;
  seenByUser: boolean;
}

interface RepoListProps {
  repos: RepoData[];
  selectedRepo: RepoData | null;
  onSelectRepo: (repo: RepoData) => void;
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