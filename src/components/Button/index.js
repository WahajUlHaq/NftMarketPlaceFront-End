import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export default function ButtonComp(props) {
  const classes = useStyles();
  const { onClick, style, Lable } = props;

  return (
    <div className={classes.root}>
      <Button style={style} fullWidth onClick={onClick} variant="contained">
        {Lable}
      </Button>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({}));
