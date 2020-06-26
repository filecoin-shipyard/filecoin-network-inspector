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

function StorageMarket(props) {
  const {
    miner,
    wallet,
    getWalletDetails,
    uploadToFilecoin,
    getDataFromFilecoinNetwork,
    getStorageDealStatus,
    getAllStorageDealsStatus,
    getClientDeals,
  } = props;

  if (!wallet) {
    getWalletDetails();
  }

  return (
    <Fragment>
      <h1>StorageMarket</h1>
      <h3>Your Balance</h3>
      <button onClick={getWalletDetails}>Refresh Balance</button>
      {wallet ? (
        <div>
          <b>Wallet Address: </b> {wallet.address} <br />
          <b>Balance: </b> {wallet.balance} {" FIL"}
        </div>
      ) : (
        <span>Loading...</span>
      )}
      <h3>Store File on Filecoin Network</h3>
      <input type="file" id="fileToUpload"></input>
      <button
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
          };
          fileReader.readAsArrayBuffer(file);
        }}
      >
        Upload to Filecoin Network
      </button>
      <h3>Get Deal Info</h3>
      <button onClick={getClientDeals}>Get Deals List</button>
      <h3>Get Deal Info</h3>
      <input type="text" id="cid_deal" />
      <button
        onClick={() => {
          const cid = document.getElementById("cid_deal").value;
          getStorageDealStatus({ cid: cid });
        }}
      >
        Get Status
      </button>
      <h3>Get All Deals</h3>

      <h3>Fetch Data back from Filecoin Network</h3>
      <input type="text" id="cid" />
      <button
        onClick={() => {
          const cid = document.getElementById("cid").value;
          getDataFromFilecoinNetwork({ cid: cid });
        }}
      >
        Fetch Data
      </button>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  wallet: state.app.wallet,
  miner: state.app.miner,
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
