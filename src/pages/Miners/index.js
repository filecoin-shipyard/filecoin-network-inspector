import React, { Fragment } from "react";
import { connect } from "react-redux";
import { stateListMiners } from "../../redux/actions/lotus";
import FilecoinGIF from "../../assets/filecoin.gif";
import ReactJson from "react-json-view";

function Miners(props) {
  const { miner, stateListMiners } = props;
  if (Object.keys(miner).length === 0) {
    stateListMiners();
  }

  return (
    <Fragment>
      <h1>Miner Stats</h1>
      {miner.minerList ? (
        miner.minerList.map((miner, index) => (
          <div key={index} className="card" style={{ width: "42rem" }}>
            <div className="card-body">
              <h5 className="card-title">Name: {miner.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">Miner Details</h6>
              <ReactJson src={miner} collapsed={true} name="Miner Details" />
            </div>
          </div>
        ))
      ) : (
        <img src={FilecoinGIF} />
      )}
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  miner: state.app.miner,
});

const mapDispatchToProps = (dispatch) => ({
  stateListMiners: () => dispatch(stateListMiners()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Miners);
