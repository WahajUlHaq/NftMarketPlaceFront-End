import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

export default function OutlinedInput(props) {
  const { onChange, label } = props;
  const classes = useStyles();

  return (
    <TextField
      onChange={onChange}
      className={classes.input}
      id="outlined-basic"
      label= {label}
      variant="outlined"
      fullWidth
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

