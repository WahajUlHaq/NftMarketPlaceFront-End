import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { useSelector } from "react-redux";

export default function CardComp(props) {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const {
    onBuyClick,
    itemName,
    itemDescription,
    token,
    itemImage,
    onSellClick,
    itemPrice,
    itemUserId,
    isAvailableForSale,
    onWithdrawClick,
  } = props;

  return (
    <div className={classes.main}>
      <MuiThemeProvider theme={theme}>
        <Card disableTouchRipple={true} className={classes.cont}>
          <CardActionArea>
            <CardMedia className={classes.media} image={itemImage} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {itemName}
              </Typography>
              {itemPrice && (
                <Typography gutterBottom variant="h5" component="h2">
                  {itemPrice} Wei
                </Typography>
              )}
              <Typography
                className={classes.description}
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {itemDescription}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              onClick={() => navigator.clipboard.writeText(token)}
              size="small"
              color="primary"
            >
              Copy Token Id
            </Button>
            {itemUserId === user.user._id && !isAvailableForSale && (
              <Button onClick={onSellClick} size="small" color="primary">
                Set NFT For Sale
              </Button>
            )}
            {itemUserId === user.user._id && isAvailableForSale && (
              <Button onClick={onWithdrawClick} size="small" color="primary">
                Withdraw
              </Button>
            )}
            {itemUserId !== user.user._id && isAvailableForSale && (
              <Button onClick={onBuyClick} size="small" color="primary">
                Buy This NFT
              </Button>
            )}
          </CardActions>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

const useStyles = makeStyles({
  main: {
    alignItems: "center",
    display: "flex",
  },
  cont: {
    height: 470,
    width: 300,
    marginTop: 30,
    marginRight: 30,
    transition: "all 0.3s",
    "&:hover": {
      transform: "translateY(-12px)",
    },
  },
  media: { 
    height: 200,
  },
  marginTop10: {
    marginTop: 10,
  },
  description: {
    height: 100,
    width: 280,
    overflowY: "auto",
  },
});

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});
