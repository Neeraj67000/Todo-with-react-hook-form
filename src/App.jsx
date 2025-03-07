import { useState, useEffect } from "react";
import "./App.css";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import { ShowToast } from "./utl/Showtoast";
import Todoform from "./components/Todoform";
import Todolist from "./components/Todolist";
import { Form, useForm } from "react-hook-form";

function App() {
  const [form, setForm] = useState();
  const [todos, settodos] = useState([]);
  const [loading, setloading] = useState(false);

  // react hook form

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  function handleDataFromTodoForm(setValue) {
    setForm(() => setValue);
  }

  useEffect(() => {
    async function fetchtTodos() {
      try {
        const persistantTodos = await fetch(import.meta.env.VITE_SERVER_URI);
        setloading(true);
        const newPersistantTodos = await persistantTodos.json();
        settodos(newPersistantTodos);
        setloading(false);
      } catch (error) {
        console.log("An error occured,", error.message);
      }
    }
    fetchtTodos();
  }, []);

  async function saveTodo(task) {
    if (form) {
      const editedTodo = todos.filter((todo) => {
        return todo.id !== form.id;
      });
      settodos(editedTodo);
      try {
        await fetch(import.meta.env.VITE_SERVER_URI, {
          method: "DELETE",
          body: JSON.stringify({ id: form.id }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      } catch (error) {
        console.log("An error occured,", error.message);
      }
    }
    setForm(task);
    const dataWithid = { ...task, isCompleted: false, id: uuidv4() };
    settodos((prevTodos) => [...prevTodos, dataWithid]);
    try {
      await fetch(import.meta.env.VITE_SERVER_URI, {
        method: "POST",
        body: JSON.stringify(dataWithid),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      console.log("An error occured,", error.message);
    }
    ShowToast("info", "Your todo is saved");
  }

  async function deleteTodo(id) {
    const deletedArray = todos.filter((todo) => todo.id !== id);
    settodos(deletedArray);

    const newDeletedArray = todos.filter((todo) => todo.id === id);

    ShowToast("error", "Todo is deleted");

    try {
      await fetch(`${import.meta.env.VITE_SERVER_URI}${id}`, {
        method: "DELETE",
        body: JSON.stringify({ id: newDeletedArray[0].id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      console.log("An error occured,", error.message);
    }
  }
  async function markAsDone(completeid) {
    const doneTodo = todos.map((todo) => {
      if (todo.id === completeid) {
        if (todo.isCompleted === false) {
          todo.isCompleted = true;
          ShowToast("success", "Well Done");
        } else {
          todo.isCompleted = false;
          ShowToast("warn", "Something Left");
        }
      }
      return todo;
    });
    settodos(doneTodo);
    const newDeletedArray = doneTodo.filter((todo) => todo.id === completeid);

    try {
      await fetch(import.meta.env.VITE_SERVER_URI, {
        method: "PUT",
        body: JSON.stringify({
          id: completeid,
          isCompleted: newDeletedArray[0].isCompleted,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      console.log("An error occured,", error.message);
    }
  }

  async function handleEdit(myid) {
    let editArray = todos.filter((todo) => todo.id === myid)[0];
    setValue("task", editArray.task);
    setForm(editArray);
  }

  async function handleDeleteSelected() {
    const selectedTodos = todos.filter((todo) => {
      return todo.isCompleted !== true;
    });
    settodos(selectedTodos);

    try {
      await fetch(import.meta.env.VITE_SERVER_URI, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      console.log("An error occured,", error.message);
    }
  }
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Typography variant="h2" gutterBottom>
        Neeraj's Todos
      </Typography>
      <Todoform
        sendDataToParent={handleDataFromTodoForm}
        saveTodo={saveTodo}
        settodos={settodos}
        form={form}
        register={register}
        handleSubmit={handleSubmit}
        watch={watch}
        setValue={setValue}
        errors={errors}
        setForm={setForm}
        handleDeleteSelected={handleDeleteSelected}
      />
      <Todolist
        loading={loading}
        todos={todos}
        handleEdit={handleEdit}
        markAsDone={markAsDone}
        deleteTodo={deleteTodo}
      />
    </>
  );
}

export default App;
