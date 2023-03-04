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

export const GET_BOXES = gql`
  query boxes($id: String!) {
    boxes(id: $id) {
      id
      letter
      x
      y
      isblock
    }
  }
`;

export interface getBoxesData {
  boxes: {
    id: string;
    letter: string | null;
    x: number;
    y: number;
    isblock: boolean;
  }[];
}

export interface getBoxesVariables {
  id: string;
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

export const CREATE_BOX = gql`
  mutation createBox($createBoxInput: CreateBoxInput!) {
    createBox(createBoxInput: $createBoxInput) {
      id
      game_id
      x
      y
      isblock
    }
  }
`;

export interface createBoxData {
  createBox: {
    id: string;
    game_id: string;
    x: number;
    y: number;
    isblock: boolean;
  };
}

export interface createBoxVariables {
  createBoxInput: {
    game_id: string;
    x: number;
    y: number;
    isblock: boolean;
  };
}

export const UPDATE_BOX = gql`
  mutation updateBox($updateBoxInput: UpdateBoxInput!) {
    updateBox(updateBoxInput: $updateBoxInput) {
      id
      letter
    }
  }
`;

export interface updateBoxData {
  updateBox: {
    id: string;
    letter?: string;
  };
}

export interface updateBoxVariables {
  updateBoxInput: {
    id: string;
    letter: string | null;
  };
}

export const DELETE_BOX = gql`
  mutation deleteBox($id: String!) {
    deleteBox(id: $id)
  }
`;

export interface deleteBoxData {
  deleteBox: {
    id: string;
  };
}

export interface deleteBoxVariables {
  id: string;
}