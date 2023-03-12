import {
  createBoxData,
  createBoxVariables,
  createGameData,
  createGameVariables,
  CREATE_BOX,
  CREATE_GAME,
  deleteBoxData,
  deleteBoxVariables,
  DELETE_BOX,
  getBoxesData,
  getBoxesVariables,
  getGameData,
  getGameVariables,
  GET_BOXES,
  GET_GAME,
  GQLClient,
  updateBoxData,
  updateBoxVariables,
  UPDATE_BOX,
} from "@/lib/gqlClient";
const gql = new GQLClient();
export const createGame = async (slug: string): Promise<createGameData> => {
  const gameData = await gql.request<createGameData, createGameVariables>(
    CREATE_GAME,
    {
      createGameInput: {
        slug,
      },
    }
  );
  return gameData;
};

export const getGame = async (slug: string): Promise<getGameData> => {
  const gameData = await gql.request<getGameData, getGameVariables>(GET_GAME, {
    slug,
  });
  return gameData;
};

export const getBoxes = async (id: string): Promise<getBoxesData> => {
  const boxesData = await gql.request<getBoxesData, getBoxesVariables>(
    GET_BOXES,
    {
      id,
    }
  );
  return boxesData;
};

export const createBox = async (
  x: number,
  y: number,
  isblock: boolean,
  gameId: string
): Promise<createBoxData> => {
  const boxData = await gql.request<createBoxData, createBoxVariables>(
    CREATE_BOX,
    {
      createBoxInput: {
        game_id: gameId,
        x,
        y,
        isblock,
      },
    }
  );
  return boxData;
};

export const updateBox = async (
  id: string,
  letter: string | null,
  horizClue: string | null,
  vertClue: string | null
): Promise<updateBoxData> => {
  const boxData = await gql.request<updateBoxData, updateBoxVariables>(
    UPDATE_BOX,
    {
      updateBoxInput: {
        id,
        letter,
        horiz_clue: horizClue,
        vert_clue: vertClue,
      },
    }
  );
  return boxData;
};

export const deleteBox = async (id: string): Promise<void> => {
  await gql.request<deleteBoxData, deleteBoxVariables>(DELETE_BOX, {
    id,
  });
};
