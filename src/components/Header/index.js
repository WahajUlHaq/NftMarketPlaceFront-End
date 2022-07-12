import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import userWalletActions from "../../redux/user/action";

export default function Header(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { pageName } = props;
  const { setUser } = userWalletActions;

  const logout = () => {
    dispatch(setUser([]));
  };

  return (
    <div className={classes.root}>
      <AppBar  sx={{
    backgroundColor: "gray"
  }} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {pageName}
          </Typography>
          {user.user.userWalletId && (
            <Button onClick={logout} color="inherit">
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
