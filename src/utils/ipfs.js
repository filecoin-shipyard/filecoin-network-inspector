import IpfsHttpClient from "ipfs-http-client";
const IPFS_API_ENDPOINT = "http://localhost:5001"; // you can replace this with any other IPFS endpoint
export const ipfs = IpfsHttpClient(IPFS_API_ENDPOINT);
