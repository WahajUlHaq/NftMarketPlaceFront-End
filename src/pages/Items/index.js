import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import api from "../../api";
import CardComp from "../../components/NFTCard";
import Header from "../../components/Header";
import SellNFTModel from "../../components/SellNFTModel";
import OutlinedInput from "../../components/OutlinedInput";

const Items = (props) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);

  const [data, setData] = useState([]);
  const [isModelOpen, setModelOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState([]);
  const [nftAmount, setNftAmount] = useState();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setSelectedNFT({ ...selectedNFT, itemPrice: nftAmount });
  }, [nftAmount]);

  const fetchItems = async () => {
    try {
      const query = {
        userId: user.user._id,
      };
      const response = await api.getMyItem(query);

      setData(response);
    } catch (e) {
      alert(e);
    }
  };

  const handleSaveBtnChange = async () => {
    try {
      if (!validator()) {
        throw new Error("Please fill all field");
      }

      selectedNFT.isAvailableForSale = true;

      const response = await api.editItem(selectedNFT);

      closeModel();
      alert("Updated Success");
      await fetchItems();
    } catch (e) {
      alert(e);
    }
  };

  const handleWithdrawClick = async (item) => {
    try {
      item.isAvailableForSale = false;

      const response = await api.editItem(item);

      alert("Updated Success");
      await fetchItems();
    } catch (e) {
      alert(e);
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
}));

export default Items;
