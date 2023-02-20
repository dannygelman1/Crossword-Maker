import {
  GraphQLClient,
  gql,
  RequestDocument,
  Variables,
} from "graphql-request";

export class GQLClient {
  private readonly gqlClient: GraphQLClient;

  constructor() {
    this.gqlClient = new GraphQLClient(
      "https://crossword-api.onrender.com/graphql"
    );
  }

  async request<Response = any, V = Variables>(
    document: RequestDocument,
    variables?: V
  ): Promise<Response> {
    const response = await this.gqlClient.request(document, variables);
    return response;
  }
}

export const GET_GAME = gql`
  query findGame($slug: String!) {
    findGame(slug: $slug) {
      id
      slug
    }
  }
`;

export interface getGameData {
  findGame: {
    id: string;
    slug: string;
  };
}

export interface getGameVariables {
  slug: string;
}

export const CREATE_GAME = gql`
  mutation createGame($createGameInput: CreateGameInput!) {
    createGame(createGameInput: $createGameInput) {
      id
      slug
    }
  }
`;

export interface createGameData {
  createGame: {
    id: string;
    slug: string;
  };
}

export interface createGameVariables {
  createGameInput: {
    slug: string;
  };
}
