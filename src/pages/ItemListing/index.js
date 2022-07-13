import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import api from "../../api";
import CardComp from "../../components/NFTCard";
import Header from "../../components/Header";
import ProgressLoader from "../../components/ProgressLoader";

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

      setData(response);
      setLoader(false);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const onWithdrawClick = async (item) => {
    try {
      setLoader(true);

      item.isAvailableForSale = false;

      await api.editItem(item);
      await fetchItems();

      alert("Withdrawn Success");
      setLoader(false);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  const onBuyClick = async (item) => {
    try {
      setLoader(true);

      item.userId = user.user._id;
      item.isAvailableForSale = false;

      await api.editItem(item);
      await fetchItems();

      alert("Buy Success");
      setLoader(false);
    } catch (e) {
      alert(e);
      setLoader(false);
    }
  };

  return (
    <div className={classes.main}>
      <Header pageName={"NFT'S Available For Buy"} />
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

export default ItemsLisiting;
