import { ReactElement, useState } from "react";
import { createGame, getGame } from "@/lib/BoxService";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface CreatePuzzleProps {}

export const CreatePuzzle = ({}: CreatePuzzleProps): ReactElement => {
  interface GameFormFields {
    slug: string;
  }
  const { handleSubmit, register } = useForm<GameFormFields>();
  const [loading, setLoading] = useState<boolean>(false);
  const [neverChecked, setNeverChecked] = useState<boolean>(true);
  const router = useRouter();
  const [validSlug, setValidSlug] = useState<boolean>(false);
  const [slug, setSlug] = useState<string>("");

  const checkIfGameExists = async (slug: string): Promise<boolean> => {
    setNeverChecked(false);
    setLoading(true);
    const game = await getGame(slug);
    setLoading(false);
    return Boolean(game.findGame);
  };
  return (
    <div className="bg-[#ce9583] w-full h-full absolute flex flex-col space-y-8 items-center justify-center">
      <div className="text-4xl font-mono text-[#3b3987]">Crossword Maker</div>
      <div className="flex flex-col space-y-2">
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
              className="bg-white w-40 h-8 rounded-md p-1 focus:outline-none focus:border-0"
              autoComplete="off"
              onChange={() => {
                setValidSlug(false);
                setNeverChecked(true);
              }}
              placeholder="Name of puzzle"
            />
            <button
              type="submit"
              className={cn("py-1 px-2 rounded-md", {
                "bg-[#3b3987]/50 animate-pulse": loading,
                "bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white":
                  !loading,
              })}
            >
              Check if unique
            </button>
          </form>
          <button
            className="py-1 px-2 bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white disabled:bg-[#8c8ca1] disabled:text-gray-200 rounded-md"
            disabled={!validSlug || slug === ""}
            onClick={async () => {
              await createGame(slug);
              router.push(`/game/edit/${slug}`);
            }}
          >
            Start
          </button>
        </div>
        <div
          className={cn("text-white", {
            visible: !validSlug,
            invisible: validSlug || neverChecked || loading,
          })}
        >
          Already exists, try a new name!
        </div>
      </div>
    </div>
  );
};
