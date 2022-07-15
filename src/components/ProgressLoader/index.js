import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export default function ProgressLoader() {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <h2>Please wait, we are loading!!!</h2>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    alignItems: 'center',
    background: 'black',
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    left: 0,
    position: 'fixed',
    top: 0,
    transition: 'opacity 0.3s linear',
    width: '100%',
    zIndex: '9999',
    opacity: "0.9",
    color: "#4C4E52"
  },
}));
