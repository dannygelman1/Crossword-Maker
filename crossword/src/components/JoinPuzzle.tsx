import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface PlayPuzzleProps {
  gameId: string;
}

export const JoinPuzzle = ({ gameId }: PlayPuzzleProps): ReactElement => {
  interface GameFormFields {
    player: string;
  }
  const { register, watch } = useForm<GameFormFields>();
  const player = watch("player");
  const router = useRouter();

  return (
    <div className="bg-[#ce9583] w-full h-full absolute flex flex-col space-y-8 items-center justify-center">
      <div className="text-4xl font-mono text-[#3b3987]">Crossword Maker</div>
      <div className="text-md text-[#5c5b70]">
        To play the crossword named{" "}
        <span className="text-[#3b3987]">{gameId}</span>, enter your name
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <form className="flex flex-row space-x-2">
            <input
              {...register("player")}
              autoComplete="off"
              className="bg-white w-40 h-8 rounded-md p-1 focus:outline-none focus:border-0"
              placeholder="Your name"
            />
          </form>
          <button
            className="py-1 px-2 bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white disabled:bg-[#8c8ca1] disabled:text-gray-200 rounded-md"
            onClick={() => {
              router.push(`/game/play/${gameId}?player=${player}`);
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};
