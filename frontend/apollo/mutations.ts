import { gql } from '@apollo/client';

export const ADD_REPO = gql`
  mutation AddRepo($owner: String!, $name: String!) {
    addRepo(owner: $owner, name: $name) {
      id
      name
      owner
      url
      latestReleaseTag
      latestReleaseNotes
      seenByUser
    }
  }
`;

export const REMOVE_REPO = gql`
  mutation RemoveRepo($id: ID!) {
    removeRepo(id: $id)
  }
`;

export const SYNC_LATEST_RELEASE = gql`
  mutation SyncLatestRelease($id: ID!) {
    syncLatestRelease(id: $id) {
      id
      latestReleaseTag
      latestReleaseNotes
      seenByUser
    }
  }
`;

export const MARK_REPO_SEEN = gql`
  mutation MarkRepoSeen($id: ID!) {
    markRepoSeen(id: $id)
  }
`;