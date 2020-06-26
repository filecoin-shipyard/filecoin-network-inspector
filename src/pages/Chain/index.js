import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getChainStats, getChainHead } from "../../redux/actions/lotus";

function Chain(props) {
  const { chain, chainHead, getChainHead, getChainStats } = props;
  if (chain.length === 0) {
    getChainStats();
    getChainHead();
  }
  return (
    <Fragment>
      <h1>Chain Stats</h1>
      <button
        onClick={() => {
          getChainStats();
          getChainHead();
        }}
      >
        Refresh
      </button>
      <h3>Chain Head</h3>
      {JSON.stringify(chainHead)}
      <div></div>
      <h3>Blocks</h3>
      <div>
        {chain.map((block, index) => (
          <p key={index}>{JSON.stringify(block)}</p>
        ))}
      </div>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  chain: state.app.chain,
  chainHead: state.app.chainHead,
});

const mapDispatchToProps = (dispatch) => ({
  getChainStats: () => dispatch(getChainStats()),
  getChainHead: () => dispatch(getChainHead()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chain);
