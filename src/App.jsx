import { useState, useEffect } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";

function App() {  
  const [form, setform] = useState({
    task: "",
    isCompleted: false,
  });
  const [todos, settodos] = useState([]);

  useEffect(() => {
    async function fetchtTodos() {
      const persistantTodos = await fetch(import.meta.env.VITE_SERVER_URI);
      const newpersistantTodos = await persistantTodos.json();
      settodos(newpersistantTodos);
    }
    fetchtTodos();
    console.log(import.meta.env.VITE_SERVER_URI);
  }, []);

  function handleForm(event) {
    setform({
      ...form,
      [event.target.name]: event.target.value,
    });
  }
  function showToast(type, text) {
    toast[type](text, {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  async function handleKeyDown(event) {
    if (event.key === "Enter") {
      const editedTodo = todos.filter((todo) => {
        return todo.id !== form.id;
      });
      const newtodo = { ...form, id: uuidv4() };
      if (newtodo.task) {
        const updatedtodos = [...editedTodo, newtodo];
        settodos(updatedtodos);
        setform({
          ...form,
          task: "",
        });
        await fetch(import.meta.env.VITE_SERVER_URI, {
          method: "DELETE",
          body: JSON.stringify({
            id: form.id,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        await fetch(import.meta.env.VITE_SERVER_URI, {
          method: "POST",
          body: JSON.stringify({
            task: form.task,
            isCompleted: form.isCompleted,
            id: updatedtodos[updatedtodos.length - 1].id,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        showToast("info", "Your todo is saved");
      } else {
        showToast("warn", "Please add some value");
      }
    }
  }

  async function saveTodo() {
    const editedArray = todos.filter((todo) => {
      return todo.id !== form.id;
    });

    await fetch(import.meta.env.VITE_SERVER_URI, {
      method: "DELETE",
      body: JSON.stringify({ id: form.id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const newtodo = { ...form, isCompleted: false, id: uuidv4() };
    if (!newtodo.task) {
      showToast("warn", "Please add some value");
      return;
    }
    const updatedtodos = [...editedArray, newtodo];
    settodos(updatedtodos);
    setform({
      ...form,
      task: "",
    });

    await fetch(import.meta.env.VITE_SERVER_URI, {
      method: "POST",
      body: JSON.stringify({
        task: form.task,
        isCompleted: form.isCompleted,
        id: updatedtodos[updatedtodos.length - 1].id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    showToast("info", "Your todo is saved");
  }

  async function deleteTodo(id) {
    const deletedarray = todos.filter((todo) => todo.id !== id);
    settodos(deletedarray);

    const newDeletedArray = todos.filter((todo) => todo.id === id);

    showToast("error", "Todo is deleted");
    const newData = await fetch(import.meta.env.VITE_SERVER_URI, {
      method: "DELETE",
      body: JSON.stringify({ id: newDeletedArray[0].id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const addData = await newData.json();
  }
  async function markAsDone(completeid) {
    const donetodo = todos.map((todo) => {
      if (todo.id === completeid) {
        if (todo.isCompleted === false) {
          todo.isCompleted = true;
          showToast("success", "Well Done");
        } else {
          todo.isCompleted = false;
          showToast("warn", "Something Left");
        }
      }
      return todo;
    });
    settodos(donetodo);
    const newDeletedArray = donetodo.filter((todo) => todo.id === completeid);
    const markDonetodo = await fetch(import.meta.env.VITE_SERVER_URI, {
      method: "PUT",
      body: JSON.stringify({
        id: completeid,
        isCompleted: newDeletedArray[0].isCompleted,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

  async function handleEdit(myid) {
    let editArray = todos.filter((todo) => todo.id === myid)[0];
    setform({ ...form, task: editArray.task, id: editArray.id });
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
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <TextField
          onChange={handleForm}
          onKeyDown={handleKeyDown}
          name="task"
          value={form.task}
          id="outlined-basic"
          variant="outlined"
          size="small"
          label="My Task"
        />
        <Button onClick={saveTodo} variant="outlined" size="medium">
          Add
        </Button>
      </Box>
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          gap: "0",
          alignItems: "center",
        }}
      >
        {todos.length == 0 && (
          <Box
            sx={(theme) => ({
              p: 1,
              color: "grey.800",
              fontSize: "0.575rem",
            })}
          >
            <Typography variant="h4" component="h2">
              Please Add new tasks
            </Typography>
          </Box>
        )}
        {todos.length != 0 &&
          todos.map((todo) => {
            return (
              <List
                key={todo.id}
                dense
                sx={{
                  width: "100%",
                  maxWidth: "768px",
                  bgcolor: "background.paper",
                }}
              >
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton aria-label="delete" size="large">
                        <EditIcon
                          fontSize="inherit"
                          onClick={() => handleEdit(todo.id)}
                        />
                      </IconButton>

                      <Checkbox
                        edge="end"
                        onChange={() => markAsDone(todo.id, todo.isCompleted)}
                        checked={todo.isCompleted ? "checked" : ""}
                        inputProps=""
                      />
                      <IconButton aria-label="delete" size="large">
                        <DeleteIcon
                          fontSize="inherit"
                          onClick={() => deleteTodo(todo.id)}
                        />
                      </IconButton>
                    </>
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{
                        textDecoration: todo.isCompleted
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {todo.task}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </List>
            );
          })}
      </Box>
    </>
  );
}

export default App;
