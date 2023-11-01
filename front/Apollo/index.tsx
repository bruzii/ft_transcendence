import { ApolloClient, InMemoryCache, from, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

/**
 * @description: Handle error messages here for graphQL, below we have handeled 401 messages
 */
const errorLink = onError(({ operation, graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    // const { result } = networkError || {};
    const context = operation || {};
    const status = operation?.getContext()?.response?.status;

    switch (status) {
      case 401:
        localStorage.removeItem("token");
        window.location.href = "/";
    }
  }
});

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
  headers: {
    credentials: "include",
    mode: "cors",
  },
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});
export default client;
