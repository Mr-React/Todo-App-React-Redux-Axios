import React from "react";
import { useDispatch } from "react-redux";
import { toggleCompleteAsync, deleteTodoAsync } from "../redux/todoSlice";

function TodoItem({ todoId, title, completed }) {
  const dispatch = useDispatch();

  const handleComplete = () => {
    dispatch(toggleCompleteAsync({ todoId: todoId, completed: !completed }));
  };

  const handleDelete = () => {
    dispatch(
      deleteTodoAsync({
        todoId: todoId,
      })
    );
  };
  return (
    <li className={`list-group-item ${completed && "list-group-item-success"}`}>
      <div className="d-flex justify-content-between">
        <span className="d-flex align-items-center">
          <input
            type="checkbox"
            className="mr-3"
            onChange={handleComplete}
            checked={completed}
          ></input>
          {title}
        </span>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
