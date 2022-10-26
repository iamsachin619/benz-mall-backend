const {
  updateActiveBetToDone,
  addBet,
  generateBetResult,
  updateWinnerWallets
} = require("../Controllers/bet.controller");

function betMaker() {
  generateBetResult().then((res) => {
    console.log("result genterated")
    updateWinnerWallets(res).then(() => {
        console.log('winner wallets updated')
      updateActiveBetToDone().then(() => {
        console.log('bet done')
        addBet();
      });
    });
  });
}

module.exports = {
  betMaker,
};
