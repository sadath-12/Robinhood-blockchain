require("@nomiclabs/hardhat-waffle");
require("dotenv").config({path:".env"})

module.exports = {
  solidity: "0.8.4",
  networks:{
    rinkeby:{
      url:"https://eth-rinkeby.alchemyapi.io/v2/fKS_KzVDDz3NQ4wSV4Egz9BTvekBp6GQ",
      accounts:["7f4d063fcefdc03548934955105ccf2fc283ab9191d35036cf1fa749ad2a9a8a"]
    }
  }
};
