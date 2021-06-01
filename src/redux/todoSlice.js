import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTodosAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async () => {
    const response = await axios
      .get("/todo", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((resp) => {
        return resp.data.alltodo;
      })
      .catch((error) => {
        return error.message;
      });
    return { response };
  }
);

export const addTodoAsync = createAsyncThunk(
  "/todos/addTodoAsync",
  async (payload) => {
    let data = new Date();
    const response = await axios
      .post("/todo", {
        title: payload.title,
        todoId: data.getMilliseconds(),
        completed: false,
      })
      .then((resp) => {
        return resp.data.Item;
      })
      .catch((error) => {
        return error.message;
      });
    return { response };
  }
);

export const toggleCompleteAsync = createAsyncThunk(
  "/todos/toggleCompleteAsync",
  async (payload) => {
    const response = await axios
      .patch("/todo", {
        todoId: payload.todoId,
        updateKey: "completed",
        updateValue: payload.completed,
      })
      .then((resp) => {
        return resp.data.UpdatedAttributes.Attributes;
      })
      .catch((error) => {
        console.log("Error Checker", error);
      });
    return { todoId: response.todoId, completed: response.completed };
  }
);
export const deleteTodoAsync = createAsyncThunk(
  "/todos/deleteTodoAsync",
  async (payload) => {
    const response = await axios
      .delete("/todo", {
        data: {
          todoId: payload.todoId,
        },
      })
      .then((resp) => {
        return resp.data.Item.Attributes;
      })
      .catch((error) => {
        console.log("delete error :", error);
      });
    return {
      todoId: response.todoId,
    };
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        todoId: Date.now(),
        title: action.payload.title,
        completed: false,
      };
      state.push(newTodo);
    },
    toggleComplete: (state, action) => {
      const index = state.findIndex(
        (todo) => todo.todoId === action.payload.todoId
      );
      state[index].completed = action.payload.completed;
    },
    deleteTodo: (state, action) => {
      return state.filter((todo) => todo.todoId !== action.payload.todoId);
    },
  },
  extraReducers: {
    [getTodosAsync.pending]: (state, action) => {
      console.log("Fetching Data...");
    },
    [getTodosAsync.fulfilled]: (state, action) => {
      console.log("Fetched Data Successfully!");
      return action.payload.response;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.push(action.payload.response);
    },
    [toggleCompleteAsync.fulfilled]: (state, action) => {
      const index = state.findIndex(
        (todo) => todo.todoId === action.payload.todoId
      );
      state[index].completed = action.payload.completed;
    },
    [deleteTodoAsync.fulfilled]: (state, action) => {
      return state.filter((todo) => todo.todoId !== action.payload.todoId);
    },
  },
});

export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
