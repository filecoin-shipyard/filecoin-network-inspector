import React, { Fragment } from "react";
import { connect } from "react-redux";
import { stateListMiners, getMinerAddress } from "../../redux/actions/lotus";
import FilecoinGIF from "../../assets/filecoin.gif";
import ReactJson from "react-json-view";

function Miner(props) {
  const { miner, stateListMiners, getMinerAddress } = props;
  if (Object.keys(miner).length === 0) {
    stateListMiners();
    getMinerAddress();
  }

  return (
    <div style={{ margin: "18px" }}>
      <h1>Miner {window.location.pathname.split("/").pop()} Stats</h1>

      {miner.minerList ? (
        miner.minerList.map((miner, index) => {
          if (miner.name === window.location.pathname.split("/").pop()) {
            return (
              <div className="card" style={{ width: "42rem" }}>
                <div className="card-body">
                  <h5 className="card-title">Name: {miner.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Miner Details
                  </h6>
                  <ReactJson
                    src={miner}
                    collapsed={false}
                    name="Miner Details"
                  />
                </div>
              </div>
            );
          }
        })
      ) : (
        <img src={FilecoinGIF} />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  miner: state.app.miner,
  minerAddress: state.app.minerAddress,
});

const mapDispatchToProps = (dispatch) => ({
  stateListMiners: () => dispatch(stateListMiners()),
  getMinerAddress: () => dispatch(getMinerAddress()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Miner);
