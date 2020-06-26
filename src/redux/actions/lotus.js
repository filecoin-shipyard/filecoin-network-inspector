import types from "../constants";
import { FilecoinNumber } from "@openworklabs/filecoin-number";
import { getClient } from "../../utils/lotus";
import IpfsHttpClient from "ipfs-http-client";
const client = getClient();

export const getChainStats = (payload) => async (dispatch) => {
  client.chainNotify((changes) => {
    dispatch({
      type: types.GET_CHAIN_STATS,
      payload: changes,
    });
  });
};
export const getWalletDetails = (payload) => async (dispatch) => {
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
  //const ipfs = IpfsHttpClient("http://localhost:5001");
  const ipfs = IpfsHttpClient({
    host: "lotus.testground.ipfs.team",
    port: 443,
    protocol: "https",
    apiPath: `/api/0/ipfs/api/v0`,
  });
  console.log(payload.fileBuffer);
  for await (const result of ipfs.add(payload.fileBuffer)) {
    // Creating a Storage Deal with a Miner
    console.log("Sending Deal");
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
    console.log(dataRef);
    const deal = await nodeClient.clientStartDeal(dataRef);
    console.log(deal);
  }
};
export const getClientDeals = (payload) => async (dispatch) => {
  const nodeClient = getClient({ nodeNumber: 0, nodeOrMiner: "node" });
  const clientDeals = await nodeClient.clientListDeals();
  console.log(clientDeals);
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
  const hasLocal = await nodeClient.clientHasLocal({ "/": payload.cid });
  console.log({ hasLocal });
  const offers = await nodeClient.clientFindData({ "/": payload.cid });
  console.log({ offers });
};

export const stateListMiners = (payload) => async (dispatch) => {
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

export const getChainHead = (payload) => async (dispatch) => {
  const chainHead = await client.chainHead();
  dispatch({
    type: types.GET_CHAIN_HEAD,
    payload: chainHead,
  });
};

export const getMinerAddress = (payload) => async (dispatch) => {
  const minerClient = getClient({ nodeNumber: 0, nodeOrMiner: "miner" });
  console.log(minerClient);
  const address = await minerClient.actorAddress();
  dispatch({
    type: types.GET_CHAIN_HEAD,
    payload: address,
  });
};
