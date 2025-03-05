import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const Todolist = (props) => {  
  return (
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          gap: "0",
          alignItems: "center",
        }}
      >
        {props.loading && (
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
        {props.todos.length == 0 && props.loading === false ? (
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
        {props.todos.length !== 0 && props.loading === false
          ? props.todos.map((todo) => {
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
                            onClick={() => props.handleEdit(todo.id)}
                          />
                        </IconButton>

                        <Checkbox
                          edge="end"
                          onChange={() => props.markAsDone(todo.id, todo.isCompleted)}
                          checked={todo.isCompleted ? "checked" : ""}
                          inputProps=""
                        />
                        <IconButton aria-label="delete" size="large">
                          <DeleteIcon
                            fontSize="inherit"
                            onClick={() => props.deleteTodo(todo.id)}
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
  );
};

export default Todolist;
