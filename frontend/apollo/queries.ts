import { gql } from '@apollo/client';

export const GET_REPOS = gql`
  query GetRepos {
    trackedRepos {
      id
      name
      owner
      url
      latestReleaseTag
      latestReleaseName
      latestReleaseDate
      latestReleaseUrl
      latestReleaseNotes
      seenByUser
    }
  }
`;