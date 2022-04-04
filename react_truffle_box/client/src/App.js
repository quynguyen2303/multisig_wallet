import React, { useEffect, useState } from "react";
import { getWeb3, getWallet } from "./utils.js";
import Header from "./Header.js";
import NewTransfer from "./NewTransfer.js";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState(undefined);
  const [quorum, setQuorum] = useState(undefined);


  // Initialization
  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();

      // React state
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
    };
    init();
  }, []);

  const createTransfer = transfer => {
    wallet.methods
      .createTransfer(transfer.amount, transfer.to)
      .send({from: accounts[0]});
  }

  // Render the UI
  if (
    typeof web3 == "undefined"
    || typeof accounts == "undefined"
    || typeof wallet == "undefined"
    || typeof approvers == "undefined"
    || typeof quorum == "undefined"
  ) {
    return <div>"Loading..."</div>;
  }

  return (
    <div className="App">
      Multisignature Wallet
      <Header approvers={approvers} quorum={quorum} />
      <NewTransfer createTransfer={createTransfer} />
    </div>
  );
}

export default App;