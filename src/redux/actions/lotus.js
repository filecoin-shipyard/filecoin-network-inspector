import types from "../constants";
import { FilecoinNumber } from "@openworklabs/filecoin-number";
import { getClient } from "../../utils/lotus";
import { ipfs } from "../../utils/ipfs";
const client = getClient();

const dealStateNames = [
  // go-fil-markets/storagemarket/types.go
  "Unknown", // 0
  "ProposalNotFound", // 1
  "ProposalRejected", // 2
  "ProposalAccepted", // 3
  "Staged", // 4
  "Sealing", // 5
  "Active", // 6
  "Failing", // 7
  "NotFound", // 8
  // Internal
  "FundsEnsured", // 9 Deposited funds as neccesary to create a deal, ready to move forward
  "WaitingForDataRequest", // 10 Client is waiting for a request for the deal data
  "Validating", // 11 Verifying that deal parameters are good
  "AcceptWait", // 12 Deciding whether or not to accept the deal
  "Transferring", // 13 Moving data
  "WaitingForData", // 14 Manual transfer
  "VerifyData", // 15 Verify transferred data - generate CAR / piece data
  "EnsureProviderFunds", // 16 Ensuring that provider collateral is sufficient
  "EnsureClientFunds", // 17 Ensuring that client funds are sufficient
  "ProviderFunding", // 18 Waiting for funds to appear in Provider balance
  "ClientFunding", // 19 Waiting for funds to appear in Client balance
  "Publish", // 20 Publishing deal to chain
  "Publishing", // 21 Waiting for deal to appear on chain
  "Error", // 22 deal failed with an unexpected error
  "Completed", // 23 on provider side, indicates deal is active and info for retrieval is recorded
];

export const getChainStats = () => async (dispatch) => {
  client.chainNotify((changes) => {
    dispatch({
      type: types.GET_CHAIN_STATS,
      payload: changes,
    });
  });
};

export const getWalletDetails = () => async (dispatch) => {
  const nodeClient = getClient({ nodeNumber: 0, nodeOrMiner: "node" });
  const defaultWalletAddress = await nodeClient.walletDefaultAddress();
  const balance = await nodeClient.walletBalance(defaultWalletAddress);
  const filBalance = new FilecoinNumber(balance, "attofil");
  dispatch({
    type: types.GET_WALLET_DETAILS,
    payload: {
      address: defaultWalletAddress,
      balance: filBalance.toFil(),
    },
  });
};

export const uploadToFilecoin = (payload) => async (dispatch) => {
  // Adding file to IPFS
  const nodeClient = getClient({ nodeNumber: 0, nodeOrMiner: "node" });

  for await (const result of ipfs.add(payload.fileBuffer)) {
    // Creating a Storage Deal with a Miner
    const dataRef = {
      Data: {
        TransferType: "graphsync",
        Root: {
          "/": result.path,
        },
        PieceCid: null,
        PieceSize: 0,
      },
      Wallet: payload.defaultWalletAddress,
      Miner: payload.targetMiner,
      EpochPrice: payload.epochPrice,
      MinBlocksDuration: 300,
    };

    const deal = await nodeClient.clientStartDeal(dataRef);

    document.getElementById("uploadToFilecoin").innerText =
      "Upload to Filecoin Network";

    dispatch({
      type: types.ADD_DATA_TO_FILECOIN,
      payload: {
        id: deal["/"],
        cid: result.path,
      },
    });
  }
};
export const getClientDeals = () => async (dispatch) => {
  const nodeClient = getClient({ nodeNumber: 0, nodeOrMiner: "node" });
  let clientDeals = await nodeClient.clientListDeals();
  clientDeals = clientDeals.map((deal) => {
    let color;
    switch (deal.State) {
      case 6:
        color = "green";
        break;
      case 22:
        color = "red";
        break;
      default:
        color = "grey";
        break;
    }
    return { ...deal, stateName: dealStateNames[deal.State], color: color };
  });
  dispatch({
    type: types.GET_CLIENT_DEALS,
    payload: clientDeals.sort(dynamicsort("DealID")),
  });
};

export const getStorageDealStatus = (payload) => async (dispatch) => {
  const nodeClient = getClient({ nodeNumber: 0, nodeOrMiner: "node" });
  const dealInfo = await nodeClient.ClientGetDealInfo([{ "/": payload.cid }]);
  console.log({ dealInfo });
};

export const getAllStorageDealsStatus = (payload) => async (dispatch) => {
  const nodeClient = getClient({ nodeNumber: 0, nodeOrMiner: "node" });
  const deals = await nodeClient.clientListDeals();
  console.log({ deals });
};

export const getDataFromFilecoinNetwork = (payload) => async (dispatch) => {
  const nodeClient = getClient({ nodeNumber: 0, nodeOrMiner: "node" });
  window.nodeClient = nodeClient;

  // Check if the cid is available locally on the node or not
  const hasLocal = await nodeClient.clientHasLocal({ "/": payload.cid });
  console.log({ hasLocal });

  // Fetch the retrieval offer from the lotus node
  const offers = await nodeClient.clientFindData({ "/": payload.cid });
  console.log({ offers });

  const retrievalOffer = {
    Root: offers[0].Root,
    Size: offers[0].Size,
    Total: offers[0].MinPrice,
    PaymentInterval: offers[0].PaymentInterval,
    PaymentIntervalIncrease: offers[0].PaymentIntervalIncrease,
    Client: payload.walletAddress,
    Miner: offers[0].Miner,
    MinerPeerID: offers[0].MinerPeerID,
  };

  // const ask = await nodeClient.clientQueryAsk(
  //   "12D3KooWGzxzKZYveHXtpG6AsrUJBcWxHBFS2HsEoGTxrMLvKXtf",
  //   "t01234"
  // );

  const randomId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  console.log({ retrievalOffer });
  const fileRef = {
    Path: `/home/vasa/Desktop/filecoin/lotus/${payload.cid}-${randomId}.txt`,
    IsCAR: false,
  };
  console.log("clientRetrieve", retrievalOffer, fileRef);
  const result = await nodeClient.clientRetrieve(retrievalOffer, fileRef);

  console.log("Retrieve result", result);
  console.log({
    url:
      `http://localhost:7777/` +
      `0/testplan/downloads/` +
      `${payload.cid}-${randomId}.txt`,
  });
};

export const stateListMiners = () => async (dispatch) => {
  let result = await client.stateListMiners([]);
  result = result.map(async (miner) => {
    let minerPow = await client.stateMinerPower(miner, []);
    return { name: miner, power: minerPow };
  });
  Promise.all(result).then((values) => {
    dispatch({
      type: types.STATE_LIST_MINERS,
      payload: values,
    });
  });
};

export const getChainHead = () => async (dispatch) => {
  const chainHead = await client.chainHead();
  dispatch({
    type: types.GET_CHAIN_HEAD,
    payload: chainHead,
  });
};

export const getMinerAddress = () => async (dispatch) => {
  const minerClient = getClient({ nodeNumber: 0, nodeOrMiner: "miner" });
  const address = await minerClient.actorAddress();
  dispatch({
    type: types.GET_MINER_ADDRESS,
    payload: address,
  });
};

function dynamicsort(property, order) {
  var sort_order = 1;
  if (order === "desc") {
    sort_order = -1;
  }
  return function (a, b) {
    // a should come before b in the sorted order
    if (a[property] < b[property]) {
      return -1 * sort_order;
      // a should come after b in the sorted order
    } else if (a[property] > b[property]) {
      return 1 * sort_order;
      // a and b are the same
    } else {
      return 0 * sort_order;
    }
  };
}
