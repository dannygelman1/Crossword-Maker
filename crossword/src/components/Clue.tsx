import { updateBox } from "@/lib/BoxService";
import { updateBoxData, updateBoxVariables, UPDATE_BOX } from "@/lib/gqlClient";
import { Box, Clues } from "@/models/Box";
import { ReactElement, useState, ChangeEvent, CSSProperties } from "react";
import { useForm } from "react-hook-form";

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
          className="bg-white w-full"
          defaultValue={
            direction === "horizontal" ? box.horizClue : box.vertClue
          }
        />
        <button className=" bg-blue-500" type="submit">
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
