import { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

import UploadButton from "../../components/UploadInput";
import OutlinedInput from "../../components/OutlinedInput";
import Button from "../../components/Button";
import web3Object from "../../web3/web3";
import NFTMinterContractABI from "../../contractABI/NFTMinterABI.json";
import api from "../../api";
import Header from "../../components/Header";
import ProgressLoader from "../../components/ProgressLoader";
import {
  addImageToIPFSServer,
  addObjectToIPFSServer,
} from "../../helpers/IPFS";

const Home = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [data, setData] = useState("");
  const [ipfsHashedObject, setIPFSHashedObject] = useState("");
  const [loader, setLoader] = useState(false);

  const submit = async () => {
    try {
      setLoader(true);

      if (!validator()) {
        throw new Error("Please fill all fields");
      }

      await addImageToIPFS();
      await saveItemToDb(); // after success make it go one line down
      const response = await sendReqToNFTMinterContract();

      setLoader(false);

      console.log("Nft Minter Contract Create Response=> ", response); //remove console
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const validator = () => {
    if (!data.title) {
      return false;
    }
    if (!data.description) {
      return false;
    }
    if (!data.file) {
      return false;
    }

    return true;
  };

  const addImageToIPFS = async () => {
    try {
      const response = await addImageToIPFSServer(data);

      setData({
        ...data,
        imageHash: response.Hash,
      });
      addObjectToIPFS(response.Hash);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const addObjectToIPFS = async (imageHash) => {
    try {
      let objectOfData = data;

      objectOfData.imageHash = imageHash;
      delete objectOfData.file;

      const response = await addObjectToIPFSServer(objectOfData);

      setIPFSHashedObject(response.Hash);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const saveItemToDb = async () => {
    try {
      const payload = {
        userId: user.user._id,
        token: data.imageHash,
        itemName: data.title,
        itemDescription: data.description,
        itemImage: "https://ipfs.io/ipfs/" + data.imageHash,
      };
      const response = await api.addItem(payload);

      if (!response) {
        throw new Error("Api error");
      }
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const sendReqToNFTMinterContract = async () => {
    try {
      const web3 = web3Object;
      const NFTMinterContract = new web3.web3.eth.Contract(
        NFTMinterContractABI,
        process.env.REACT_APP_NFT_MINTER_CONTRACT
      );
      const response = await NFTMinterContract.methods
        .createItem(ipfsHashedObject, 0)
        .send({ from: user.user.userWalletId });

      return response;
    } catch (e) {
      alert(e.message);
      setLoader(false);
    }
  };

  const handleFileChange = (e) => {
    setData({
      ...data,
      file: e.target.files[0],
    });
  };

  const handleTextChange = (e, label) => {
    setData({
      ...data,
      [label]: e.target.value,
    });
  };

  return (
    <div className={classes.main}>
      <div>
        <Header pageName={"Home"} />
      </div>
      <div className={classes.container}>
        <div>
          <h1>Upload Image Details</h1>
        </div>
        <div className={classes.inputContainer}>
          <OutlinedInput
            label="Enter Title"
            onChange={(e) => handleTextChange(e, "title")}
          />
        </div>
        <div className={classes.inputContainer}>
          <OutlinedInput
            label="Enter Description"
            onChange={(e) => handleTextChange(e, "description")}
          />
        </div>
        <div className={classes.btnContainer}>
          <div className={classes.btn}>
            <UploadButton onChange={(e) => handleFileChange(e)} />
          </div>
          <div className={classes.btn}>
            <Button Lable={"Submit"} onClick={(e) => submit()} />
          </div>
        </div>
        <div className={classes.btnContainer}>
          <div className={classes.btn}>
            <Button
              Lable={"Check My NFT'S"}
              onClick={(e) => navigate("/my-items")}
            />
          </div>
          <div className={classes.btn}>
            <Button
              Lable={"Buy NFT'S"}
              onClick={(e) => navigate("/items-for-sale")}
            />
          </div>
        </div>
      </div>
      {loader && (
        <div className={classes.loader}>
          <ProgressLoader />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  main: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    width: "50%",
    marginTop: 10,
  },
  btnContainer: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      width: "50%",
    },
  },
  btn: {
    marginRight: 30,
    marginTop: 20,
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
}));

export default Home;
