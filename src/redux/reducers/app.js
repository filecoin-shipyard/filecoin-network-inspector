import types from "../constants";

const initialState = {
  chain: [],
  miner: {},
  chainHead: null,
  wallet: null,
  minerAddress: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CHAIN_STATS:
      return { ...state, chain: [...state.chain, action.payload] };
    case types.STATE_MINER_POWER:
      return {
        ...state,
        miner: { ...state.miner, minerPower: action.payload },
      };
    case types.STATE_LIST_MINERS:
      return {
        ...state,
        miner: { ...state.miner, minerList: action.payload },
      };
    case types.GET_CHAIN_HEAD:
      return {
        ...state,
        chainHead: action.payload,
      };
    case types.GET_MINER_ADDRESS:
      return {
        ...state,
        minerAddress: action.payload,
      };
    case types.GET_WALLET_DETAILS:
      return {
        ...state,
        wallet: action.payload,
      };
    default:
      return state;
  }
};
