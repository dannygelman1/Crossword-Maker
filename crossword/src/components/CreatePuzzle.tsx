import { ReactElement, useState } from "react";
import Link from "next/link";
import { createGame, getGame, updateBox } from "@/lib/BoxService";
import { updateBoxData, updateBoxVariables, UPDATE_BOX } from "@/lib/gqlClient";
import { Box, Clues } from "@/models/Box";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface CreatePuzzleProps {}

export const CreatePuzzle = ({}: CreatePuzzleProps): ReactElement => {
  interface GameFormFields {
    slug: string;
  }
  const { handleSubmit, register } = useForm<GameFormFields>();
  const router = useRouter();
  const [validSlug, setValidSlug] = useState<boolean>(false);
  const [slug, setSlug] = useState<string>("");
  return (
    <div className="bg-white w-full h-full absolute">
      <div className="flex flex-row space-x-2">
        <form
          onSubmit={handleSubmit(async (data: GameFormFields) => {
            const slugExists = await checkIfGameExists(data.slug);
            if (!slugExists) {
              setValidSlug(true);
              setSlug(data.slug);
            } else setValidSlug(false);
          })}
          className="flex flex-row space-x-2"
        >
          <input
            {...register("slug")}
            className="bg-white w-40 h-8"
            onChange={() => setValidSlug(false)}
          />
          <button type="submit" className="bg-green-500 p-2 h-8">
            Check if unique
          </button>
        </form>
        <button
          className="bg-green-500 p-2 disabled:bg-green-200"
          disabled={!validSlug}
          onClick={async () => {
            await createGame(slug);
            router.push(`/game/edit/${slug}`);
          }}
        >
          Click here to start game
        </button>
      </div>
    </div>
  );
};

const checkIfGameExists = async (slug: string): Promise<boolean> => {
  const game = await getGame(slug);
  return Boolean(game.findGame);
};
