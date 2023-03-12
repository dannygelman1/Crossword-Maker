import { updateBox } from "@/lib/BoxService";
import { updateBoxData, updateBoxVariables, UPDATE_BOX } from "@/lib/gqlClient";
import { Box } from "@/models/Box";
import { ReactElement, useState, ChangeEvent, CSSProperties } from "react";
import { useForm } from "react-hook-form";

interface ClueInputProps {
  box: Box;
}

export const ClueInput = ({ box }: ClueInputProps): ReactElement => {
  interface ClueFormFields {
    clueContent: string;
  }
  const { handleSubmit, register } = useForm<ClueFormFields>();
  const onSubmit = async (
    id: string,
    { clueContent }: ClueFormFields
  ): Promise<void> => {
    console.log("submit", id, clueContent);
    await updateBox(id, null, clueContent);
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
          defaultValue={box.clue}
        />
        <button className=" bg-blue-500" type="submit">
          submit
        </button>
      </form>
    </div>
  );
};

interface ClueTextProps {
  box: Box;
}

export const ClueText = ({ box }: ClueTextProps): ReactElement => {
  return (
    <div className="flex flex-row space-x-1 m-0 px-1">
      <span className="w-5 flex items-center justify-center">{box.number}</span>
      <span className="flex items-center justify-center">{box.clue}</span>
    </div>
  );
};
