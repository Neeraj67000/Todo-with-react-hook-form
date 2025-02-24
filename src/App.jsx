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
import CircularProgress from "@mui/material/CircularProgress";
import { ShowToast } from "./utl/Showtoast";
function App() {
  const [form, setForm] = useState({
    task: "",
    isCompleted: false,
  });
  const [todos, settodos] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    async function fetchtTodos() {
      try {
        const persistantTodos = await fetch(import.meta.env.VITE_SERVER_URI);
        const newPersistantTodos = await persistantTodos.json();
        settodos(newPersistantTodos);
      } catch (error) {
        console.log("An error occured,", error.message);
      }
    }
    fetchtTodos();
    setloading(false);
  }, []);

  function handleForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleKeyDown(event) {
    if (event.key === "Enter") {
      const editedTodo = todos.filter((todo) => {
        return todo.id !== form.id;
      });
      const newTodo = { ...form, id: uuidv4() };
      if (newTodo.task) {
        const updatedTodos = [...editedTodo, newTodo];
        settodos(updatedTodos);
        setForm({
          ...form,
          task: "",
        });

        try {
          await fetch(import.meta.env.VITE_SERVER_URI, {
            method: "DELETE",
            body: JSON.stringify({
              id: form.id,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
        } catch (error) {
          console.log("An error occured,", error.message);
        }

        try {
          await fetch(import.meta.env.VITE_SERVER_URI, {
            method: "POST",
            body: JSON.stringify({
              task: form.task,
              isCompleted: form.isCompleted,
              id: updatedTodos[updatedTodos.length - 1].id,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
        } catch (error) {
          console.log("An error occured,", error.message);
        }
        ShowToast("info", "Your todo is saved");
      } else {
        ShowToast("warn", "Please add some value");
      }
    }
  }

  async function saveTodo() {
    const editedArray = todos.filter((todo) => {
      return todo.id !== form.id;
    });
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
    const newTodo = { ...form, isCompleted: false, id: uuidv4() };
    if (!newTodo.task) {
      ShowToast("warn", "Please add some value");
      return;
    }
    const updatedTodos = [...editedArray, newTodo];
    settodos(updatedTodos);
    setForm({
      ...form,
      task: "",
    });

    try {
      await fetch(import.meta.env.VITE_SERVER_URI, {
        method: "POST",
        body: JSON.stringify({
          task: form.task,
          isCompleted: form.isCompleted,
          id: updatedTodos[updatedTodos.length - 1].id,
        }),
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
      await fetch(import.meta.env.VITE_SERVER_URI, {
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
    setForm({ ...form, task: editArray.task, id: editArray.id });
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
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {todos.length == 0 && loading === false ? (
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
        ) : null}
        {todos.length !== 0 && loading === false
          ? todos.map((todo) => {
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
            })
          : null}
      </Box>
    </>
  );
}

export default App;
