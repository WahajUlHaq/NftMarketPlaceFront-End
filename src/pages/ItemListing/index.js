import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import api from "../../api";
import CardComp from "../../components/NFTCard";
import Header from "../../components/Header";

const ItemsLisiting = (props) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.getItemsForSale();
      console.log(response);
      setData(response);
    } catch (e) {
      alert(e);
    }
  };

  const onWithdrawClick = async (item) => {
    try {
      item.isAvailableForSale = false;

      const response = await api.editItem(item);

      alert("Withdrawn Success");
      await fetchItems();
    } catch (e) {
      alert(e);
    }
  };

  const onBuyClick = async (item) => {
    try {
      item.userId = user.user._id;
      item.isAvailableForSale = false;

      const response = await api.editItem(item);
      alert("Buy Success");
      await fetchItems();
    } catch (e) {
      alert(e);
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
            // itemPrice={item.itemPrice}
            token={item.token}
            itemImage={item.itemImage}
            onBuyClick={(e) => onBuyClick(item)}
            itemUserId={item.userId}
            isAvailableForSale={item.isAvailableForSale}
            onWithdrawClick={(e) => onWithdrawClick(item)}
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

export default ItemsLisiting;
