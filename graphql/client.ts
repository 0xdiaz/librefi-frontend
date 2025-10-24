import { request } from 'graphql-request';

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://thegraph.com/studio/subgraph/librefi-subgraph/endpoints';

interface QueryVariables {
  [key: string]: unknown;
}

export async function queryGraph<T>(query: string, variables: QueryVariables = {}): Promise<T> {
  try {
    return await request(GRAPHQL_URL, query, variables);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const graphqlError = error as { response?: { errors?: Array<{ message: string }> } };

    console.error('GraphQL query failed:', {
      query,
      variables,
      error: errorMessage,
      details: graphqlError.response?.errors,
    });

    throw new Error(`Failed to query data: ${graphqlError.response?.errors?.[0]?.message || errorMessage}`);
  }
}

export const CACHE_TIME = {
  STANDARD: 30_000, // 30 seconds
  EXTENDED: 60_000, // 1 minute
  LONG: 300_000, // 5 minutes
};
