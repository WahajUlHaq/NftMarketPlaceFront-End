import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import api from "../../api";
import CardComp from "../../components/NFTCard";
import Header from "../../components/Header";
import SellNFTModel from "../../components/SellNFTModel";
import ProgressLoader from "../../components/ProgressLoader";

const Items = (props) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);

  const [data, setData] = useState([]);
  const [isModelOpen, setModelOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState([]);
  const [nftAmount, setNftAmount] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setSelectedNFT({ ...selectedNFT, itemPrice: nftAmount });
  }, [nftAmount]);

  const fetchItems = async () => {
    try {
      setLoader(true);

      const query = {
        userId: user.user._id,
      };
      const response = await api.getMyItem(query);

      setData(response);
      setLoader(false);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const handleSaveBtnChange = async () => {
    try {
      setLoader(true);

      if (!validator()) {
        throw new Error("Please fill all field");
      }

      selectedNFT.isAvailableForSale = true;
      await api.editItem(selectedNFT);

      closeModel();
      alert("Updated Success");
      await fetchItems();
      setLoader(false);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const handleWithdrawClick = async (item) => {
    try {
      setLoader(true);

      item.isAvailableForSale = false;
      
      await api.editItem(item);
      await fetchItems();

      alert("Updated Success");
      setLoader(false);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const validator = () => {
    if (!nftAmount) {
      return false;
    }
    if (isNaN(nftAmount)) {
      return false;
    }
    return true;
  };

  const openModel = (item) => {
    setModelOpen(true);
    setSelectedNFT({ ...selectedNFT, item });
    setSelectedNFT(item);
  };

  const closeModel = () => {
    setModelOpen(false);
  };

  const handleInputChange = async (e) => {
    setNftAmount(e.target.value);
  };

  return (
    <div className={classes.main}>
      <Header pageName={"My NFT'S"} />
      <SellNFTModel
        isOpen={isModelOpen}
        title={"NFT Details"}
        handleModelClose={closeModel}
        handleInputChange={(e) => handleInputChange(e)}
        handleSaveBtnChange={handleSaveBtnChange}
      />
      <div className={classes.container}>
        {data.map((item) => (
          <CardComp
            itemName={item.itemName}
            itemDescription={item.itemDescription}
            token={item.token}
            itemImage={item.itemImage}
            onSellClick={(e) => openModel(item)}
            isBuyScreen={false}
            itemUserId={item.userId}
            isAvailableForSale={item.isAvailableForSale}
            onWithdrawClick={(e) => handleWithdrawClick(item)}
          />
        ))}
      </div>
      {!data.length && (
        <div className={classes.noContent}>
          <p>Opps! No Items to display now</p>
        </div>
      )}
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
    display: "flex",
    flexDirection: "column",
  },
  container: {
    marginLeft: 20,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
}));

export default Items;
