import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          trackedRepos: {
            merge(_existing, incoming) {
              // Always use incoming data (don't try to merge)
              return incoming;
            },
          },
        },
      },
      Repo: {
        keyFields: ['id'],
      },
    },
  })
});