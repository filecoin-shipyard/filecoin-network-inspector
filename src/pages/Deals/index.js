import React from "react";
import { connect } from "react-redux";
import { getClientDeals } from "../../redux/actions/lotus";
import FilecoinGIF from "../../assets/filecoin.gif";
import ReactJson from "react-json-view";
import { Link } from "react-router-dom";

function Deals(props) {
  const { deals, getClientDeals } = props;

  setInterval(getClientDeals, 10000);

  return (
    <div style={{ margin: "18px" }}>
      <h1>Deals</h1>
      {deals ? (
        deals.length > 0 ? (
          deals.map((deal, index) => (
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
                  {/* <p><b>CID: </b><a href={} target="_blank">{deal.Provider}</a></p> */}
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
                    <Link to={`/miner/${deal.Provider}`}>{deal.Provider}</Link>
                  </p>
                  <p>
                    <b>File Size: </b>
                    {deal.Size}
                  </p>
                </div>
                <ReactJson src={deal} collapsed={true} name="Deal Details" />
              </div>
            </div>
          ))
        ) : (
          <div>
            <h6>
              No recent deals! <Link to="/market">Try adding a file</Link> to
              Filecoin!
            </h6>
          </div>
        )
      ) : (
        <img src={FilecoinGIF} />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  deals: state.app.deals,
});

const mapDispatchToProps = (dispatch) => ({
  getClientDeals: () => dispatch(getClientDeals()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Deals);
