import { ApolloClient, InMemoryCache } from "@apollo/client";

import { accessToken, previewToken, spaceId } from "../env";

function getGraphQLEndpoint(preview = false) {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${spaceId}`;
  const token = preview ? previewToken || accessToken : accessToken;

  return {
    endpoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getClient(preview = false) {
  const { endpoint, headers } = getGraphQLEndpoint(preview);

  return new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
    headers,
  });
}
