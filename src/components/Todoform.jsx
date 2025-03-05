import { React } from "react";
import { Box, TextField, Button, colors } from "@mui/material";
import Input from "@mui/material/Input";

const Todoform = (props) => {
  const onSubmit = (data) => {
    props.setValue("task", "");
    props.saveTodo(data)
  };

  return (
    <>
      <form onSubmit={props.handleSubmit(onSubmit)}>
        <Box
          sx={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Input
            placeholder="My Task"
            label="My Task"
            size="small"
            {...props.register("task", { required: true })}
          />

          <Button type="submit" variant="outlined" size="medium">
            Submit
          </Button>
        </Box>
        {props.errors.task && (
          <Box component="span" sx={{ display: "inline", color: "red" }}>
            This field is required
          </Box>
        )}
      </form>
    </>
  );
};

export default Todoform;
