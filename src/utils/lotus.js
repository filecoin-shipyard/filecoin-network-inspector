import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
//import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs";
import { BrowserProvider } from "@filecoin-shipyard/lotus-client-provider-browser";
import { testnet } from "@filecoin-shipyard/lotus-client-schema";

export const getClient = (options = {}) => {
  // const url = "http://13.233.128.236:7777/rpc/v0";
  // const url = 'wss://lotus.testground.ipfs.team/api/0/node/rpc/v0'
  // const provider = new NodejsProvider(url, { transport: 'http' })
  // const provider = new NodejsProvider(url);
  let wsUrl;
  if (Object.keys(options).length === 0) {
    wsUrl = "ws://13.233.128.236:7777/rpc/v0";
    // wsUrl = "wss://lotus.testground.ipfs.team/api/rpc/v0";
    options.nodeOrMiner = "node";
  } else {
    wsUrl =
      "ws://13.233.128.236:7777" +
      `/${options.nodeNumber}/${options.nodeOrMiner}/rpc/v0`;
    // wsUrl =
    //   "wss://lotus.testground.ipfs.team/api" +
    //   `/${options.nodeNumber}/${options.nodeOrMiner}/rpc/v0`;
  }

  const provider = new BrowserProvider(wsUrl);
  return new LotusRPC(provider, {
    schema:
      options.nodeOrMiner === "node" ? testnet.fullNode : testnet.storageMiner,
  });
};
