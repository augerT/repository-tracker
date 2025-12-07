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
            // Merge incoming data with existing cache
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      Repo: {
        // Define how to identify each repo uniquely
        keyFields: ['id'],
      },
    },
  }),
});