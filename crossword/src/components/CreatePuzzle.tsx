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
    <div className="bg-[#ce9583] w-full h-full absolute flex flex-col space-y-8 items-center justify-center">
      <div className="text-4xl font-mono text-[#3b3987]">Crossword Maker</div>
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
            className="bg-white w-40 h-8 rounded-md"
            onChange={() => setValidSlug(false)}
          />
          <button
            type="submit"
            className="py-1 px-2 bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white rounded-md"
          >
            Check if unique
          </button>
        </form>
        <button
          className="py-1 px-2 bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white disabled:bg-[#8c8ca1] disabled:text-gray-200 rounded-md"
          disabled={!validSlug}
          onClick={async () => {
            await createGame(slug);
            router.push(`/game/edit/${slug}`);
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
};

const checkIfGameExists = async (slug: string): Promise<boolean> => {
  const game = await getGame(slug);
  return Boolean(game.findGame);
};
