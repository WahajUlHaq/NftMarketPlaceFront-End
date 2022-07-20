import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import bigNumber from "bignumber.js";

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

  const endAuctionClick = async (item) => {
    try {
      setLoader(true);
      const web3 = web3Object;
      const marketPlaceContract = new web3.web3.eth.Contract(
        marketPlaceABI,
        process.env.REACT_APP_MARKETPLACE_CONTRACT
      );
      const response = await marketPlaceContract.methods
        .EndAuction(parseInt(item.marketPlaceId))
        .send({ from: user.user.userWalletId });

      if (!response) {
        throw new Error("Error while ending auction from Marketplace.");
      }

      const highestBidParam = {
        userId: item.userId,
        itemId: item._id,
        auctionId: item.auctionId,
      };
      const highestBidUser = await api.highetsBid(highestBidParam);

      item.userId = highestBidUser.userId;
      item.isAvailableForSale = false;
      item.itemPrice = 0;
      item.highestBid = 0;
      item.isAuction = false;

      const editResponse = await api.editItem(item);

      if (!editResponse) {
        throw new Error("Unable to update item in Database.");
      }

      const editAuctionIdResponse = await api.editAuctionId(item);

      if (!editAuctionIdResponse) {
        throw new Error("Unable to update item in Database.");
      }

      await fetchItems();
      alert("Removd from auction ");
      setLoader(false);
    } catch (e) {
      console.log(e.message);

      alert("Error while ending auction");
      setLoader(false);
    }
  };

  const bidding = async (item) => {
    try {
      const checkUserResponse = isUserConnected();

      if (!checkUserResponse) {
        throw new Error(
          "You have not connected this app with your meta mask wallet. Please connect your wallet and try again."
        );
      }

      setLoader(true);

      const amount = window.prompt("Enter amount to bid");
      const nftPriceToWei = amount * 1000000000000000000;
      const nftPriceFromatted = new bigNumber(nftPriceToWei);
      const web3 = web3Object;
      const marketPlaceContract = new web3.web3.eth.Contract(
        marketPlaceABI,
        process.env.REACT_APP_MARKETPLACE_CONTRACT
      );

      if (item.itemPrice >= nftPriceFromatted) {
        throw new Error("Already higher bid exist");
      }

      const myBidParam = {
        userId: user.user._id,
        itemId: item._id,
      };
      const myBid = await api.getMyBid(myBidParam);
      let response;

      if (!myBid) {
        response = await marketPlaceContract.methods
          .PlaceABid(parseInt(item.marketPlaceId), nftPriceFromatted.toString())
          .send({
            from: user.user.userWalletId,
            value: nftPriceFromatted.toString(),
          });

        if (!response) {
          throw new Error("Error while bidding item to Marketplace.");
        }

        const param = {
          userId: user.user._id,
          itemId: item._id,
          bidAmount: nftPriceFromatted,
          auctionId: item.auctionId,
        };
        const saveBidToDb = await api.bid(param);

        if (!saveBidToDb) {
          throw new Error("Error while bidding item to Marketplace.");
        }

        item.highestBid = nftPriceFromatted;
        const editResponse = await api.editItem(item);

        if (!editResponse) {
          throw new Error("Unable to update item in Database.");
        }
      } else {
        const price = nftPriceFromatted - myBid.bidAmount;

        response = await marketPlaceContract.methods
          .PlaceABid(parseInt(item.marketPlaceId), price.toString())
          .send({
            from: user.user.userWalletId,
            value: price.toString(),
          });

        if (!response) {
          throw new Error("Error while bidding item to Marketplace.");
        }

        myBid.bidAmount = parseInt(myBid.bidAmount) + parseInt(price);
        const saveBidToDb = await api.editbid(myBid);

        if (!saveBidToDb) {
          throw new Error("Error while bidding item to Marketplace.");
        }

        item.highestBid = nftPriceFromatted
        const editResponse = await api.editItem(item);

        if (!editResponse) {
          throw new Error("Unable to update item in Database.");
        }
        console.log(price);
      }

      await fetchItems();
      alert("You have successfully bid this NFT.");
      setLoader(false);
    } catch (e) {
      console.log(e.message);
      console.log(e);

      alert(
        "Unable to buy this item, Please try again. See logs for more details."
      );
      setLoader(false);
    }
  };

  const checkMyBid = async (item) => {
    try {
      const param = {
        userId: user.user._id,
        itemId: item._id,
      };
      const response = await api.getMyBid(param);

      if (!response) {
        throw new Error("You have not place bid for this item now.");
      }

      alert(
        "Your current bid amount for this NFT is: " +
          response.bidAmount / 1000000000000000000
      );
    } catch (e) {
      alert(e.message);
    }
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
            isItemForAuction={item.isAuction}
            itemImage={item.itemImage}
            onBuyClick={(e) => onBuyClick(item)}
            itemUserId={item.userId}
            isAvailableForSale={item.isAvailableForSale}
            onWithdrawClick={(e) => onWithdrawClick(item)}
            onEndAuction={(e) => endAuctionClick(item)}
            highestBid={item.highestBid}
            onBidClick={(e) => bidding(item)}
            checkMyBidClick={(e) => checkMyBid(item)}
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
