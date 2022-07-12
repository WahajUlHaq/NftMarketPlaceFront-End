import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export default function UploadButton(props) {
  const classes = useStyles();
  const { onChange, style } = props;

  return (
    <div className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={onChange}
        style={style}
      />
      <label htmlFor="contained-button-file">
        <Button fullWidth variant="contained" color="dark" component="span">
          Upload NFT Image
        </Button>
      </label>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
}));
