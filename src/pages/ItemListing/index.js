import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import api from "../../api";
import CardComp from "../../components/NFTCard";
import Header from "../../components/Header";
import ProgressLoader from "../../components/ProgressLoader";
import web3Object from "../../web3/web3";
import marketPlaceABI from "../../contractABI/marketPlaceABI.json";

const ItemsLisiting = (props) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoader(true);

      const response = await api.getItemsForSale();

      if (!response) {
        throw new Error(
          "Error while fetching all items, Please try again later. See logs for more details"
        );
      }

      setData(response);
      setLoader(false);
    } catch (e) {
      console.log("Fetch items error=> ", e.message);
      alert(e.message);
      setLoader(false);
    }
  };

  const onWithdrawClick = async (item) => {
    try {
      setLoader(true);

      const checkUserResponse = isUserConnected();

      if (!checkUserResponse) {
        throw new Error(
          "You have not connected this app with your meta mask wallet. Please connect your wallet and try again."
        );
      }

      const web3 = web3Object;
      const marketPlaceContract = new web3.web3.eth.Contract(
        marketPlaceABI,
        process.env.REACT_APP_MARKETPLACE_CONTRACT
      );
      const response = await marketPlaceContract.methods
        .removeItem(parseInt(item.marketPlaceId))
        .send({ from: user.user.userWalletId });

      item.isAvailableForSale = false;
      item.marketPlaceId = null;
      item.itemPrice = 0;

      if (!response) {
        throw new Error("Error while removing item from Marketplace.");
      }

      console.log(response);

      const editResponse = await api.editItem(item);

      if (!editResponse) {
        throw new Error("Unable to update item in Database.");
      }

      await fetchItems();
      alert("You have removed your NFT from marketplace successfully.");
      setLoader(false);
    } catch (e) {
      console.log("Error while Removing NFT from marketplace=> ", e.message);

      alert("Error while removing NFT from market place");
      setLoader(false);
    }
  };

  const onBuyClick = async (item) => {
    try {
      const checkUserResponse = isUserConnected();

      if (!checkUserResponse) {
        throw new Error(
          "You have not connected this app with your meta mask wallet. Please connect your wallet and try again."
        );
      }

      setLoader(true);

      const web3 = web3Object;
      const marketPlaceContract = new web3.web3.eth.Contract(
        marketPlaceABI,
        process.env.REACT_APP_MARKETPLACE_CONTRACT
      );
      const response = await marketPlaceContract.methods
        .BuyItem(parseInt(item.marketPlaceId))
        .send({ from: user.user.userWalletId, value: item.itemPrice });

      if (!response) {
        throw new Error("Error while buying item from Marketplace.");
      }

      item.userId = user.user._id;
      item.isAvailableForSale = false;
      item.itemPrice = 0;

      const editResponse = await api.editItem(item);

      if (!editResponse) {
        throw new Error("Unable to update item in Database.");
      }

      await fetchItems();
      alert("You have successfully bought this NFT.");
      setLoader(false);
    } catch (e) {
      console.log(e.message);

      alert(
        "Unable to buy this item, Please try again. See logs for more details."
      );
      setLoader(false);
    }
  };

  const isUserConnected = () => {
    if (!user.user.userWalletId) {
      return false;
    }

    return true;
  };

  return (
    <div className={classes.main}>
      <Header pageName={"Home"} />
      <div className={classes.container}>
        {data.map((item) => (
          <CardComp
            itemName={item.itemName}
            itemDescription={item.itemDescription}
            itemPrice={item.itemPrice}
            token={item.token}
            itemImage={item.itemImage}
            onBuyClick={(e) => onBuyClick(item)}
            itemUserId={item.userId}
            isAvailableForSale={item.isAvailableForSale}
            onWithdrawClick={(e) => onWithdrawClick(item)}
          />
        ))}
      </div>
      {!data.length && (
        <div className={classes.noContent}>
          <p>For now no NFT are available for sale.</p>
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

export default ItemsLisiting;
