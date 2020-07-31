import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  getWalletDetails,
  uploadToFilecoin,
  getDataFromFilecoinNetwork,
  getStorageDealStatus,
  getAllStorageDealsStatus,
  getClientDeals,
} from "../../redux/actions/lotus";
import ReactJson from "react-json-view";
import { Link } from "react-router-dom";

function StorageMarket(props) {
  const {
    miner,
    wallet,
    market,
    deals,
    getWalletDetails,
    uploadToFilecoin,
    getDataFromFilecoinNetwork,
    getStorageDealStatus,
    getAllStorageDealsStatus,
    getClientDeals,
  } = props;

  if (!wallet) {
    setInterval(() => {
      getClientDeals();
      getWalletDetails();
    }, 3000);
  }
  let recentProposalCIDs = [],
    proposalCidToCID = {};
  if (market.length !== 0) {
    recentProposalCIDs = market.map((deal) => {
      proposalCidToCID[deal.id] = deal.cid;
      return deal.id;
    });
  }

  console.log({ recentProposalCIDs, proposalCidToCID, deals });

  return (
    <Fragment>
      <h1>StorageMarket</h1>
      <br />
      <br />
      <h3>Your Balance</h3>
      {/* <button onClick={getWalletDetails}>Refresh Balance</button> */}
      {wallet ? (
        <div>
          <b>Wallet Address: </b> {wallet.address} <br />
          <b>Balance: </b> {wallet.balance} {" FIL"}
        </div>
      ) : (
        <span>Loading...</span>
      )}
      <br />
      <br />
      <h3>Store File on Filecoin Network</h3>
      <input type="file" id="fileToUpload"></input>
      <button
        id="uploadToFilecoin"
        onClick={() => {
          const file = document.getElementById("fileToUpload").files[0];
          var arrayBuffer, uint8Array;
          var fileReader = new FileReader();
          fileReader.onload = function () {
            arrayBuffer = this.result;
            uint8Array = new Uint8Array(arrayBuffer);
            uploadToFilecoin({
              fileBuffer: uint8Array,
              defaultWalletAddress: wallet.address,
              targetMiner: miner.minerList ? miner.minerList[0].name : "t01000",
              epochPrice: "2500",
            });
            document.getElementById("uploadToFilecoin").innerText =
              "Sending Deal...";
          };
          fileReader.readAsArrayBuffer(file);
        }}
      >
        Upload to Filecoin Network
      </button>
      <br />
      <br />
      <h3>Deal Status</h3>
      {market.length !== 0 ? (
        deals.map((deal, index) => {
          if (recentProposalCIDs.includes(deal.ProposalCid["/"])) {
            return (
              <div key={index} className="card" style={{ width: "48rem" }}>
                <div className="card-body">
                  <h5 className="card-title">DealID: {deal.DealID}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Status: <font color={deal.color}>{deal.stateName}</font>
                  </h6>
                  <div className="card-text">
                    {deal.Message.length !== 0 ? (
                      <p>
                        <font color="red">
                          <b>Error: {deal.Message}</b>
                        </font>
                      </p>
                    ) : null}
                    <p>
                      <b>CID: </b>
                      <a
                        href={`http://localhost:8080/ipfs/${
                          proposalCidToCID[deal.ProposalCid["/"]]
                        }`}
                        target="_blank"
                      >
                        {proposalCidToCID[deal.ProposalCid["/"]]}
                      </a>
                    </p>
                    <p>
                      <b>Piece CID: </b>
                      {deal.PieceCID["/"]}
                    </p>
                    <p>
                      <b>Duration: </b>
                      {deal.Duration}
                    </p>
                    <p>
                      <b>Price Per Epoch: </b>
                      {deal.PricePerEpoch}
                    </p>
                    <p>
                      <b>Provider: </b>
                      <Link to={`/miner/${deal.Provider}`}>
                        {deal.Provider}
                      </Link>
                    </p>
                    <p>
                      <b>File Size: </b>
                      {deal.Size}
                    </p>
                  </div>
                  <ReactJson src={deal} collapsed={true} name="Deal Details" />
                  <br />
                  <br />
                  {deal.stateName === "Active" ? (
                    <button
                      className="btn btn-primary mb-2"
                      id="fetchData"
                      onClick={() => {
                        document.getElementById("fetchData").innerText =
                          "Creating retrieval deal...";
                        getDataFromFilecoinNetwork({
                          cid: proposalCidToCID[deal.ProposalCid["/"]],
                          walletAddress: wallet.address,
                        });
                      }}
                    >
                      Get Data from Filecoin
                    </button>
                  ) : null}
                </div>
              </div>
            );
          }
        })
      ) : (
        <p>
          No Recent Deals. Upload something to Filecoin Network to see
          sweet-sweet deals :)
        </p>
      )}
      <br />
      <br />
      <br />
      <br />
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  wallet: state.app.wallet,
  miner: state.app.miner,
  market: state.app.market,
  deals: state.app.deals,
});

const mapDispatchToProps = (dispatch) => ({
  getWalletDetails: () => dispatch(getWalletDetails()),
  uploadToFilecoin: (payload) => dispatch(uploadToFilecoin(payload)),
  getDataFromFilecoinNetwork: (payload) =>
    dispatch(getDataFromFilecoinNetwork(payload)),
  getStorageDealStatus: (payload) => dispatch(getStorageDealStatus(payload)),
  getAllStorageDealsStatus: () => dispatch(getAllStorageDealsStatus()),
  getClientDeals: () => dispatch(getClientDeals()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageMarket);
