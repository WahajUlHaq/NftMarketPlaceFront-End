import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import OutlinedInput from "../OutlinedInput";

export default function ModelComp(props) {
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
        <DialogContent></DialogContent>
        <OutlinedInput
          onChange={(e) => handleInputChange(e, "nftAmount")}
          label={"Please enter NFT Amount:"}
        />
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
