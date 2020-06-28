import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
import { BrowserProvider } from "@filecoin-shipyard/lotus-client-provider-browser";
import { testnet } from "@filecoin-shipyard/lotus-client-schema";

export const getClient = (options = { nodeOrMiner: "node", nodeNumber: 0 }) => {
  // API endpoint for local Lotus devnet
  const API = "ws://localhost:7777";

  // Websocket endpoint for local Lotus devnet
  const wsUrl = API + `/${options.nodeNumber}/${options.nodeOrMiner}/rpc/v0`;

  // Creating and returning a Lotus client that can be used anywhere in the app
  const provider = new BrowserProvider(wsUrl);
  return new LotusRPC(provider, {
    schema:
      options.nodeOrMiner === "node" ? testnet.fullNode : testnet.storageMiner,
  });
};
