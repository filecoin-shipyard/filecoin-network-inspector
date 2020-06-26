import React, { Fragment } from "react";
import { connect } from "react-redux";
import { stateListMiners, getMinerAddress } from "../../redux/actions/lotus";

function Miners(props) {
  const { miner, minerAddress, stateListMiners, getMinerAddress } = props;
  if (Object.keys(miner).length === 0) {
    stateListMiners();
    getMinerAddress();
  }

  return (
    <Fragment>
      <h1>Miner Stats</h1>
      <button
        onClick={() => {
          stateListMiners();
          getMinerAddress();
        }}
      >
        Refresh
      </button>
      <h3>List Miners and their Power</h3>
      {miner.minerList
        ? miner.minerList.map((miner, index) => (
            <p key={index}>
              <b>Name:</b> {miner.name} <br />
              <b>Power:</b> {JSON.stringify(miner.power)}
            </p>
          ))
        : null}
    </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Miners);
