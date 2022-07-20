import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import bigNumber from "bignumber.js";

import api from "../../api";
import CardComp from "../../components/NFTCard";
import Header from "../../components/Header";
import SellNFTModel from "../../components/SellNFTModel";
import ProgressLoader from "../../components/ProgressLoader";
import marketPlaceABI from "../../contractABI/marketPlaceABI.json";
import NFTMinterContractABI from "../../contractABI/NFTMinterABI.json";
import web3Object from "../../web3/web3";

const Items = (props) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);

  const [data, setData] = useState([]);
  const [isModelOpen, setModelOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState([]);
  const [nftAmount, setNftAmount] = useState();
  const [nftStatus, setNFTStatus] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nftPriceToWei = nftAmount * 1000000000000000000;
    const nftPriceFromatted = new bigNumber(nftPriceToWei);

    setSelectedNFT({ ...selectedNFT, itemPrice: nftPriceFromatted });

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        throw new Error("Please fill all required fields in correct format");
      }

      const approvalResponse = await sendApprovalRequest();

      if (!approvalResponse) {
        throw new Error("Error while approving NFT");
      }

      selectedNFT.isAvailableForSale = true;

      const editResponse = await api.editItem(selectedNFT);

      if (!editResponse) {
        throw new Error("Error while editting NFT in database");
      }

      closeModel();
      alert("NFT is successfully added to marketplace.");
      await fetchItems();
      setLoader(false);
    } catch (e) {
      console.log("Error while approving NFT to marketplace:=>", e.message);

      alert(
        "Error while adding NFT to marketplace, See logs for more details."
      );
      setLoader(false);
    }
  };

  const addNFTToMarket = async () => {
    try {
      const web3 = web3Object;
      const marketPlaceContract = new web3.web3.eth.Contract(
        marketPlaceABI,
        process.env.REACT_APP_MARKETPLACE_CONTRACT
      );
      const response = await marketPlaceContract.methods
        .addItemToMarket(
          selectedNFT.tokenId,
          selectedNFT.tokenAddress,
          selectedNFT.itemPrice,
          nftStatus,
          process.env.REACT_APP_WALLET_TOKEN_ADDRESS
        )
        .send({ from: user.user.userWalletId });

      selectedNFT.marketPlaceId = response.events.ItemAdded.returnValues.id;
      selectedNFT.isAuction = nftStatus;

      const editResponse = await api.editItem(selectedNFT);

      if (!editResponse) {
        throw new Error("Unable to update item in Database.");
      }

      return response;
    } catch (e) {
      console.log("Error while adding NFT to marketplace:=>", e.message);
      setLoader(false);
    }
  };

  const sendApprovalRequest = async () => {
    try {
      const web3 = web3Object;
      const NFTMinterContract = new web3.web3.eth.Contract(
        NFTMinterContractABI,
        process.env.REACT_APP_NFT_MINTER_CONTRACT
      );
      const approvalResponse = await NFTMinterContract.methods
        .approve(
          process.env.REACT_APP_MARKETPLACE_CONTRACT,
          selectedNFT.tokenId
        )
        .send({ from: user.user.userWalletId });

      if (!approvalResponse) {
        throw new Error("Error while approving NFT");
      }

      const response = await addNFTToMarket();

      return response;
    } catch (e) {
      console.log("Error while approving NFT for marketplace:=>", e.message);

      setLoader(false);
    }
  };

  const handleWithdrawClick = async (item) => {
    try {
      setLoader(true);

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
      item.highestBid = 0;

      if (!response) {
        throw new Error("Error while removing item from Marketplace.");
      }

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
  const handleSelectChange = async (e) => {
    setNFTStatus(e.target.value);
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

  return (
    <div className={classes.main}>
      <Header pageName={"My NFT'S"} />
      <SellNFTModel
        isOpen={isModelOpen}
        title={"NFT Details"}
        selectValue={nftStatus}
        handleDropDownChange={(e) => handleSelectChange(e)}
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
            isItemForAuction={item.isAuction}
            itemImage={item.itemImage}
            onSellClick={(e) => openModel(item)}
            isBuyScreen={false}
            itemUserId={item.userId}
            onEndAuction={(e) => endAuctionClick(item)}
            isAvailableForSale={item.isAvailableForSale}
            onWithdrawClick={(e) => handleWithdrawClick(item)}
            highestBid={item.highestBid}  
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
