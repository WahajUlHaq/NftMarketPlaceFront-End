import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import {
  getAccount,
  web3Initializer,
} from "../../helpers/metamaskWalletConnector";
import userWalletActions from "../../redux/user/action";
import api from "../../api";
import ButtonComp from "../../components/Button";
import Header from "../../components/Header";

const Login = (props) => {
  const dispatch = useDispatch();
  const { setUser } = userWalletActions;
  const classes = useStyles();
  const navigate = useNavigate();

  const onLoginClickHandler = async () => {
    try {
      await web3Initializer();
      const userWalletId = await getAccount();
      const userAccount = await checkForUser(userWalletId);

      if (!userAccount) {
        throw new Error("Api failed");
      }

      dispatch(setUser(userAccount));

      navigate("home");
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }
  };

  return (
    <div className={classes.main}>
      <div>
        <Header pageName="Login" />
      </div>
      <div className={classes.btnComp}>
        <ButtonComp
          Lable={"Connect Your Account"}
          onClick={onLoginClickHandler}
        >
          Connect Your Account
        </ButtonComp>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  btnComp:{
    display: "flex",
    justifyContent: 'center',
    marginTop: 20
  }
}));

export default Login;
