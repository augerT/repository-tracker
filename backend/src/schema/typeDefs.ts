export const typeDefs = `#graphql
  type Repo {
    id: ID!
    name: String!
    owner: String!
    seenByUser: Boolean!
    latestReleaseId: ID
    latestReleaseTag: String
    latestReleaseDate: String
    latestReleaseNotes: String
  }

  type Query {
    trackedRepos: [Repo!]!
    repo(id: ID!): Repo
  }

  type Mutation {
    addRepo(name: String!, owner: String!): Repo!
    removeRepo(id: ID!): Boolean!
    syncLatestRelease(id: ID!): Repo!
    markRepoSeen(id: ID!): Boolean!
    syncAllRepos: Int  # Returns count of synced repos
  }
`;