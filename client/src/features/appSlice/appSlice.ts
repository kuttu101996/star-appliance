import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

// Define a type for a single todo item
interface Todo {
  id: number | string; // nanoid() generates a string id, while your initial state uses a number.
  text: string;
}

// Define a type for the slice state
interface TodoState {
  todos: Todo[];
}

// Define the initial state using the type
const initialState: TodoState = {
  todos: [{ id: 1, text: "Hello World" }],
};

export const appSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ text: string }>) => {
      const todo: Todo = { id: nanoid(), text: action.payload.text };
      state.todos.push(todo);
    },
    removeTodo: (state, action: PayloadAction<{ id: number | string }>) => {
      state.todos = state.todos.filter((ele) => ele.id !== action.payload.id);
    },
  },
});

// To get the individual access of the reducer function
export const { addTodo, removeTodo } = appSlice.actions; // We can get this from actions of that slice we have created.

export default appSlice.reducer; // We need to export every reducer
