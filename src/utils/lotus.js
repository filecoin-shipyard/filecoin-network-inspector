import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
//import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs";
import { BrowserProvider } from "@filecoin-shipyard/lotus-client-provider-browser";
import { testnet } from "@filecoin-shipyard/lotus-client-schema";

export const getClient = (options = {}) => {
  // const url = "http://localhost:7777/rpc/v0";
  // const url = 'wss://lotus.testground.ipfs.team/api/0/node/rpc/v0'
  // const provider = new NodejsProvider(url, { transport: 'http' })
  // const provider = new NodejsProvider(url);
  let wsUrl, tokenUrl;
  if (Object.keys(options).length === 0) {
    // wsUrl = "ws://localhost:7777/rpc/v0";
    options.nodeOrMiner = "node";
    options.nodeNumber = 0;
  }
  wsUrl = "ws://localhost:7777" + `/rpc/v0`;
  // wsUrl =
  //   "ws://localhost:7777" +
  //   `/${options.nodeNumber}/${options.nodeOrMiner}/rpc/v0`;
  // wsUrl =
  //   "wss://lotus.testground.ipfs.team/api" +
  //   `/${options.nodeNumber}/${options.nodeOrMiner}/rpc/v0`;
  // tokenUrl =
  //   "https://" +
  //   "lotus.testground.ipfs.team/api" +
  //   `/${options.nodeNumber}/testplan/` +
  //   (options.nodeOrMiner === "node" ? ".lotus" : ".lotusstorage") +
  //   "/token";

  tokenUrl =
    "http://" +
    "ws://localhost:7777" +
    `/${options.nodeNumber}/testplan/` +
    (options.nodeOrMiner === "node" ? ".lotus" : ".lotusstorage") +
    "/token";

  const provider = new BrowserProvider(
    wsUrl /* , {
    token: async () => {
      const response = await fetch(tokenUrl);
      return await response.text();
    },
  } */
  );
  return new LotusRPC(provider, {
    schema:
      options.nodeOrMiner === "node" ? testnet.fullNode : testnet.storageMiner,
  });
};
