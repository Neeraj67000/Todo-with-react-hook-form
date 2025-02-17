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
  const [form, setform] = useState({ task: "", isCompleted: false });
  const [todos, settodos] = useState([]);

  useEffect(() => {
    async function fetchtTodos() {
      const persistantTodos = await fetch("http://localhost:3000/");
      const newpersistantTodos = await persistantTodos.json();
      settodos(newpersistantTodos);
    }
    fetchtTodos();
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
      const newtodo = { ...form, myid: uuidv4() };
      if (newtodo.task) {
        const updatedtodos = [...todos, newtodo];
        settodos(updatedtodos);
        setform({
          ...form,
          task: "",
        });
        const newData = await fetch("http://localhost:3000/", {
          method: "POST",
          body: JSON.stringify({
            task: form.task,
            isCompleted: form.isCompleted,
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
    const newtodo = { ...form, isCompleted: false };
    console.log(newtodo);
    if (!newtodo.task) {
      showToast("warn", "Please add some value");
      return;
    }
    const updatedtodos = [...todos, newtodo];
    settodos(updatedtodos);
    setform({
      ...form,
      task: "",
    });
    const newData = await fetch("http://localhost:3000/", {
      method: "POST",
      body: JSON.stringify({ task: form.task, isCompleted: form.isCompleted }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    showToast("info", "Your todo is saved");
  }

  async function deleteTodo(_id) {
    const deletedarray = todos.filter((todo) => todo._id !== _id);
    settodos(deletedarray);
    const newDeletedArray = todos.filter((todo) => todo._id === _id);
    console.log(newDeletedArray[0]);

    showToast("error", "Todo is deleted");
    const newData = await fetch("http://localhost:3000/", {
      method: "DELETE",
      body: JSON.stringify({ id: newDeletedArray[0]._id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const addData = await newData.json();
    console.log(addData);
  }
  async function markAsDone(completeid) {
    console.log(todos);
    console.log(completeid);

    const donetodo = todos.map((todo) => {
      if (todo._id === completeid) {
        if (todo.isCompleted === false) {
          todo.isCompleted = true;
          console.log(todo);

          console.log("todo is false");

          showToast("success", "Well Done");
        } else {
          console.log("todo is true");
          console.log(todo);

          todo.isCompleted = false;
          showToast("warn", "Something Left");
        }
      }
      return todo;
    });
    settodos(donetodo);
    const newDeletedArray = donetodo.filter((todo) => todo._id === completeid);
    console.log(newDeletedArray[0]);
    const markDonetodo = await fetch("http://localhost:3000/", {
      method: "PUT",
      body: JSON.stringify({
        id: completeid,
        isCompleted: newDeletedArray[0].isCompleted,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    console.log(markDonetodo);
  }

  async function handleEdit(myid) {
    let editArray = todos.filter((todo) => todo._id === myid)[0];
    setform({ ...form, task: editArray.task });
    const deletedarray = todos.filter((todo) => todo._id !== myid);
    settodos(deletedarray);
    const editedArray = await fetch("http://localhost:3000/", {
      method: "DELETE",
      body: JSON.stringify({ id: myid }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
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
          todos.map((todo, index) => {
            return (
              <List
                key={index}
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
                          onClick={() => handleEdit(todo._id)}
                        />
                      </IconButton>

                      <Checkbox
                        edge="end"
                        onChange={() => markAsDone(todo._id, todo.isCompleted)}
                        checked={todo.isCompleted ? "checked" : ""}
                        inputProps=""
                      />
                      <IconButton aria-label="delete" size="large">
                        <DeleteIcon
                          fontSize="inherit"
                          onClick={() => deleteTodo(todo._id)}
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
