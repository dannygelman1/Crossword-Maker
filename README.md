# Crossword Maker

# Table of Contents
- [Inspiration](#inspiration)
- [How to play](#how-to-play)
  - [Example](#example-of-a-frog-shaped-crossword)
- [Code Structure](#code-structure)
  - [Frontend](#frontend-typescript-react-tailwind-nextjs)
  - [Backend](#backend-typescript-nestjs)
  - [Database](#database-postgresql)

## Inspiration

For the last few months I got really into the New York Times Daily Mini. Its just a fun way for me to start my morning and wake my brain up in a few minutes.

One day, as I was trying to come up with a birthday present idea for a friend, I thought - "Wouldn't it be great to make them a personalized crossword puzzle of words related to our shared memories?"

And so, the idea for crossword maker was born - a web application that lets you create crossword puzzles and share them with friends to solve!

## How to play

First you will land on this page where you can enter the name of your puzzle. 
You have to check if the name has already been taken first.

<img width="500" alt="Screen Shot 2023-05-14 at 5 44 12 PM" src="https://github.com/dannygelman1/Crossword-Maker/assets/45411340/c9af6cf1-e8da-41c0-865f-a6ad4fbebf4c">


Then you will be sent to the editor where you can construct your puzzle. 
There are a few key features when creating the crossword puzzle.

<table style="border-collapse: collapse;">
  <tr style="border: 10px transparent;">
    <td style="padding: 0; margin: 0">
      <img src="https://user-images.githubusercontent.com/45411340/235030637-cc9c9b26-ed46-4a8b-8d38-c7d98992337f.gif" style="width: 500px">
    </td>
    <td style="padding: 0; margin: 0; text-align: center">
      <b>Creation</b>
      <br>
      <br>
      Go to create mode. To create new boxes 
      <br>
      first click on an existing box. Then the
      <br>
      neighboring boxes will appear. Then you can
      <br>
      select any of them to create new ones.
    </td>
  </tr>
  <tr style="border: 10px transparent;">
    <td style="padding: 0; margin: 0;">
      <img src="https://user-images.githubusercontent.com/45411340/235031036-4e5ddfde-bacf-43dd-9b39-04b4aeff3b02.gif" style="width: 500px">
    </td>
    <td style="padding: 0; margin: 0;">
      <b>Text</b>
      <br>
      <br>
      Go to text mode. Easily add text
      <br>
      to any box by selecting it and typing. 
      <br>
      You can replace any existing letter by 
      <br>
      selecting it and typing a new letter, so
      <br>
      there is no need for deleting, eventhough 
      <br>
      it is still possible.
    </td>
  </tr>
  <tr style="border: 10px transparent;">
    <td style="padding: 0; margin: 0;">
      <img src="https://user-images.githubusercontent.com/45411340/235032305-1ffacc56-60eb-461d-bc5e-53b62140ffab.gif" style="width: 500px">
    </td>
    <td style="padding: 0; margin: 0;">
      <b>Deletion</b>
      <br>
      <br>
      Go to delete mode. You can delete any 
      <br>
      existing box by selecting on it.
    </td>
    </td>
  </tr>
  <tr style="border: 10px transparent;">
    <td style="padding: 0; margin: 0;">
      <img src="https://user-images.githubusercontent.com/45411340/235032007-c91f2c24-128f-4423-8aba-ccf2811a1227.gif" style="width: 500px">
    </td>
    <td style="padding: 0; margin: 0;">
      <b>Block</b>
      <br>
      <br>
      Go to block mode. You can create any 
      <br>
      block similar to any box. Select any 
      <br>
      existing box or block and you will 
      <br>
      see their neighbors. Select them to 
      <br>
      create them. 
    </td>
  </tr>
</table>

Once you are happy with the puzzle, you can select the Copy Link button and send it to a friend. They will have to enter their name and can start playing!

<img width="500" alt="Screen Shot 2023-05-14 at 5 44 58 PM" src="https://github.com/dannygelman1/Crossword-Maker/assets/45411340/55791003-da78-4db7-b497-60bbcd103d58">

## Example of a frog shaped crossword

### Making the puzzle shape
Using all the features listed above, you can create puzzles of any shape!

https://github.com/dannygelman1/Crossword-Maker/assets/45411340/109afb4c-5174-44c3-81b6-a58fe68a11a6

### Setting the answers and clues
You can fill in the crossword with the answers and clues for your friend to solve.

https://user-images.githubusercontent.com/45411340/235391052-43d3b803-9e4c-4ada-978d-d87f599e21b5.mp4

### Sending the puzzle
You can copy the play link to send to you friend to play and they can check the puzzle as much as they want!

https://github.com/dannygelman1/Crossword-Maker/assets/45411340/0df8a28a-3e0f-4bc5-8a1c-417d1178f65a

## Code structure

This is shows the crossword creation flow:
```mermaid
sequenceDiagram
    rect rgb(235, 213, 205)
    index.tsx ->>+ CreatePuzzle.tsx: directs to
    CreatePuzzle.tsx ->>+ crossword-api: queries to check if puzzle name is unique
    note right of crossword-api: Starting a new crossword puzzle
    crossword-api ->>+ CreatePuzzle.tsx: responds with answer of whether puzzle name is unique
    CreatePuzzle.tsx ->>+ game/edit/[id].tsx getServerSideProps: directs to (with game_id)
    game/edit/[id].tsx getServerSideProps ->>+ Editor.tsx: directs to
    end
    rect rgb(235, 213, 205)
    note right of crossword-api: Creating the crossword puzzle within the Editor
    Editor.tsx ->>+ crossword-api: sends mutations for puzzle edits
    crossword-api ->>+ Editor.tsx: responds with ids for newly created entities
    end
    rect rgb(235, 213, 205)
    note right of Editor.tsx: Sending link to friend
    Editor.tsx ->>+ game/play/[id].tsx getServerSideProps: directs to (with game_id)
    end
```

This shows the sending to a friend and answering flow :
```mermaid
sequenceDiagram
    rect rgb(235, 213, 205)
    game/play/[id].tsx ->>+ JoinPuzzle.tsx: directs to (with game_id)
    note right of JoinPuzzle.tsx: Friend joins crossword puzzle
    JoinPuzzle.tsx ->>+ game/play/[id].tsx: directs to (with query param player={playerName})
    game/play/[id].tsx ->>+ Play.tsx: directs to (with game_id)
    end
    rect rgb(235, 213, 205)
    note right of Play.tsx: Friend plays crossword puzzle
    Play.tsx ->>+ crossword-api: sends mutations for puzzle answers
    crossword-api ->>+ Play.tsx: responds with ids for newly created entities
    end
```
### Frontend (typescript, react, tailwind, Next.js)

My frontend is has 4 major pages: CreatePuzzle, Editor, JoinPuzzle, Play. 

- `CreatePuzzle` - this is where you enter the name of the crossword puzzle you want to create
- `Editor` - this is where you create the crossword puzzle
- `JoinPuzzle` - this is where your friend first lands when you send them the link to your puzzle, and where they can enter their name
- `Play` - this is where they can play your crossword puzzle

Each page uses queries and mutations from my `BoxService.ts`, which is a light wrapper for the GraphQL queries/mutations in `gqlClient.ts`

For example here is my getBoxes function in BoxService.ts:
```
export const getBoxes = async (id: string): Promise<getBoxesData> => {
  const boxesData = await gql.request<getBoxesData, getBoxesVariables>(
    GET_BOXES,
    {
      id,
    }
  );
  return boxesData;
};
```

And here is my `boxes` query in gqlClient.ts:
```
query boxes($id: String!) {
  boxes(id: $id) {
    id
    letter
    x
    y
    isblock
    vert_clue
    horiz_clue
  }
} 
```

### Backend (typescript, Nest.js)
My api is organized into games, boxes, and user_boxes:
 - `games` - each crossword puzzle is a `game`
 - `boxes` - each crossword puzzle is made of multiple `boxes`
 - `user_boxes` - each box can have multiple `user_boxes` associated with it, one for every new player's guess
 
Here are the queries and mutations:
- games
  - queries
    - findGame
  - mutations
    - createGame
- boxes
  - queries
    - box
    - boxes
  - mutations
    - createBox
    - updateBox
    - deleteBox
- user_boxes
  - queries
    - user_boxes
  - mutations
    - createUserBox
    - updateUserBox

### Database (PostgreSQL)

Here is how I store my data. 

 - `games` - each row corresponds to a new crossword puzzle game
 - `boxes` - each row corresponds to one box in one crossword puzzle.
 - `user_boxes` - each row corresponds to one player's answer to one box in one crossword puzzle.

```mermaid
classDiagram
direction LR
games "" --> "*" boxes : has many
boxes "" --> "*" user_boxes : has many

    class games {
        +uuid id
        +text slug
        +timestamptz created_at
    	+timestamptz updated_at
    }

    class boxes {
    	+uuid id
        +text? letter
    	+integer x
    	+integer y
        +boolean isblock
        +text game_id
        +text? vert_clue
        +text? horiz_clue
        +timestamptz created_at
    	+timestamptz updated_at
    }

    class user_boxes {
    	+uuid id
        +uuid box_id
    	+text name
    	+text letter
        +timestamptz created_at
    	+timestamptz updated_at

    }
```
 
