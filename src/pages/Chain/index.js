import React from "react";
import { connect } from "react-redux";
import { getChainStats, getChainHead } from "../../redux/actions/lotus";
import { Link } from "react-router-dom";
import FilecoinGIF from "../../assets/filecoin.gif";
import ReactJson from "react-json-view";

function Chain(props) {
  const { chain, chainHead, getChainHead, getChainStats } = props;
  if (chain.length === 0) {
    getChainStats();
    getChainHead();
  }
  return (
    <div style={{ margin: "18px" }}>
      <h1>Chain Explorer</h1>
      <div>
        {chain.length === 0 ? (
          <center>
            <img src={FilecoinGIF} />
          </center>
        ) : (
          chain.map((block, index) => (
            <div key={index} className="card" style={{ width: "52rem" }}>
              <div className="card-body">
                <h5 className="card-title">
                  Block {block[0].Val.Blocks[0].Height}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {block[0].Val.Cids[0]["/"]}
                </h6>
                <p className="card-text">
                  <b>TimeStamp: </b> {block[0].Val.Blocks[0].Timestamp} <br />
                  <b>Parent Block: </b> {block[0].Val.Blocks[0].Parents[0]["/"]}{" "}
                  <br />
                  <b>ParentWeight: </b> {block[0].Val.Blocks[0].ParentWeight}{" "}
                  <br />
                  <b>Miner: </b>
                  <Link
                    to={`/miner/${block[0].Val.Blocks[0].Miner}`}
                    className="card-link"
                  >
                    {block[0].Val.Blocks[0].Miner}
                  </Link>
                </p>
                <br />
                <ReactJson src={block} collapsed={true} name="Block JSON" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
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
