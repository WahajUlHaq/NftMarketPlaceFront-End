import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

import OutlinedInput from "../OutlinedInput";

export default function ModelComp(props) {
  const classes = useStyles();
  const {
    isOpen,
    handleModelClose,
    title,
    handleInputChange,
    handleSaveBtnChange,
  } = props;

  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <div className={classes.inputContainer}>
          <OutlinedInput
            onChange={(e) => handleInputChange(e, "nftAmount")}
            label={"NFT Amount in ETH:"}
          />
        </div>
        <DialogActions>
          <Button onClick={handleModelClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSaveBtnChange} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles({
  inputContainer: {
    padding: 30,
  },
});
