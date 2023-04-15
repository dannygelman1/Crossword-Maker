import { updateBox } from "@/lib/BoxService";
import { updateBoxData, updateBoxVariables, UPDATE_BOX } from "@/lib/gqlClient";
import { Box, Clues } from "@/models/Box";
import { ReactElement, useState, ChangeEvent, CSSProperties } from "react";
import { useForm } from "react-hook-form";

interface CluesSectionProps {
  editOrPlay: "edit" | "play";
  loading?: boolean;
  boxes: Box[];
}

export const CluesSection = ({
  editOrPlay,
  loading,
  boxes,
}: CluesSectionProps): ReactElement => {
  return (
    <div className="flex flex-row space-x-2 h-[210px] w-[1000px] overflow-auto px-4">
      <div className="flex flex-col space-y-1 w-1/2">
        <span className="flex p-1 items-center justify-center">Across</span>
        {loading ? (
          <>
            <div className="flex w-full h-8 bg-gray-200 animate-pulse rounded-md" />
            <div className="flex w-full h-8 bg-gray-200 animate-pulse rounded-md" />
            <div className="flex w-full h-8 bg-gray-200 animate-pulse rounded-md" />
          </>
        ) : (
          boxes.map((box) => {
            if (box.clues === "horizontal" || box.clues === "both")
              return editOrPlay === "play" ? (
                <ClueText
                  key={`${box.id}_2`}
                  box={box}
                  direction="horizontal"
                />
              ) : (
                <ClueInput
                  key={`${box.id}_2`}
                  box={box}
                  direction="horizontal"
                />
              );
          })
        )}
      </div>
      <div className="flex flex-col space-y-1 w-1/2">
        <span className="flex p-1 items-center justify-center">Down</span>
        {loading ? (
          <>
            <div className="flex w-full h-8 bg-gray-200 animate-pulse rounded-md" />
            <div className="flex w-full h-8 bg-gray-200 animate-pulse rounded-md" />
            <div className="flex w-full h-8 bg-gray-200 animate-pulse rounded-md" />
          </>
        ) : (
          boxes.map((box) => {
            if (box.clues === "vertical" || box.clues === "both")
              return editOrPlay === "play" ? (
                <ClueText key={`${box.id}_2`} box={box} direction="vertical" />
              ) : (
                <ClueInput key={`${box.id}_2`} box={box} direction="vertical" />
              );
          })
        )}
      </div>
    </div>
  );
};

interface ClueInputProps {
  box: Box;
  direction: Clues;
}

export const ClueInput = ({ box, direction }: ClueInputProps): ReactElement => {
  interface ClueFormFields {
    clueContent: string;
  }
  const { handleSubmit, register } = useForm<ClueFormFields>();
  const onSubmit = async (
    id: string,
    { clueContent }: ClueFormFields
  ): Promise<void> => {
    console.log("submit", id, clueContent);
    if (direction === "horizontal")
      await updateBox(id, null, clueContent, null);
    else await updateBox(id, null, null, clueContent);
  };

  return (
    <div className="flex flex-row space-x-1 m-0 px-1">
      <span className="w-5 flex items-center justify-center">{box.number}</span>
      <form
        onSubmit={handleSubmit(async (data: ClueFormFields) =>
          onSubmit(box.id, data)
        )}
        className="flex flex-row space-x-2 w-full"
      >
        <input
          {...register("clueContent")}
          className="bg-white w-full px-2 rounded-md"
          defaultValue={
            direction === "horizontal" ? box.horizClue : box.vertClue
          }
        />
        <button
          className="py-1 px-2 flex items-center justify-center bg-[#3b3987] text-gray-200 hover:bg-[#4c49a3] hover:text-white rounded-md"
          type="submit"
        >
          save
        </button>
      </form>
    </div>
  );
};

interface ClueTextProps {
  box: Box;
  direction: Clues;
}

export const ClueText = ({ box, direction }: ClueTextProps): ReactElement => {
  return (
    <div className="flex flex-row space-x-1 m-0 px-1">
      <span className="w-5 flex items-center justify-center">{box.number}</span>
      <span className="flex items-center justify-center">
        {direction === "horizontal" ? box.horizClue : box.vertClue}
      </span>
    </div>
  );
};
