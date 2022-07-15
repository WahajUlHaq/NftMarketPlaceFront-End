import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import userWalletActions from "../../redux/user/action";
import {
  getAccount,
  web3Initializer,
} from "../../helpers/metamaskWalletConnector";
import api from "../../api";
import ProgressLoader from "../ProgressLoader";

export default function Header(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loader, setLoader] = useState(false);
  const { pageName } = props;
  const { setUser } = userWalletActions;

  const onLoginClickHandler = async () => {
    try {
      setLoader(true);
      await web3Initializer();

      const userWalletId = await getAccount();
      const userAccount = await checkForUser(userWalletId);

      if (!userAccount) {
        throw new Error(
          "Unable to connect user, Please try again! See logs for more detailed error."
        );
      }

      dispatch(setUser(userAccount));
      setLoader(false);
    } catch (e) {
      alert(e.message);
      setLoader(false);
    }
  };

  const checkForUser = async (userWalletId) => {
    try {
      const param = {
        userWalletId: userWalletId,
      };
      const response = await api.registerUser(param);

      return response;
    } catch (e) {
      console.log("Error while verifying user:=>", e.message);
    }
  };

  const logout = () => {
    dispatch(setUser([]));
  };

  const handleBuyNFTClick = () => {
    navigate("/");
  };

  const handleMintNFTClick = () => {
    navigate("/mint-nft");
  };

  const handleMyNFTClick = () => {
    navigate("/my-items");
  };

  return (
    <div className={classes.root}>
      <AppBar
        sx={{
          backgroundColor: "gray",
        }}
        position="static"
      >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {pageName}
          </Typography>
          {!user.user.userWalletId && (
            <div className={classes.btnContainer}>
              <Button
                style={{ color: "grey", backgroundColor: "white" }}
                onClick={onLoginClickHandler}
                color="inherit"
              >
                Connect Your Wallet
              </Button>
            </div>
          )}
          {user.user.userWalletId && (
            <div className={classes.btnContainer}>
              <Button
                style={{ color: "grey", backgroundColor: "white" }}
                onClick={handleMintNFTClick}
                color="inherit"
              >
                Mint NFT's
              </Button>
            </div>
          )}
          {user.user.userWalletId && (
            <div className={classes.btnContainer}>
              <Button
                style={{ color: "grey", backgroundColor: "white" }}
                onClick={handleMyNFTClick}
                color="inherit"
              >
                My NFT's
              </Button>
            </div>
          )}
          {user.user.userWalletId && (
            <div className={classes.btnContainer}>
              <Button
                style={{ color: "grey", backgroundColor: "white" }}
                onClick={handleBuyNFTClick}
                color="inherit"
              >
                Buy NFT's
              </Button>
            </div>
          )}
          {user.user.userWalletId && (
            <div className={classes.btnContainer}>
              <Button
                style={{ color: "grey", backgroundColor: "white" }}
                onClick={logout}
                color="inherit"
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
          {user.user.userWalletId && (
            <div className={classes.walletId}>
              <p>
                {user.user.userWalletId.slice(0, 6)}....
                {user.user.userWalletId.slice(
                  user.user.userWalletId.length - 6
                )}
              </p>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {loader && (
        <div className={classes.loader}>
          <ProgressLoader />
        </div>
      )}
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
  btnContainer: {
    marginRight: 10,
  },
}));
