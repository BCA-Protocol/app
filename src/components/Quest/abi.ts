export const cUSDCv3Abi = [
 {
  type: "function",
  name: "balanceOf", // https://docs.compound.finance/helper-functions/#supplied-base-balance
  stateMutability: "view",
  inputs: [{ name: "account", type: "address" }],
  outputs: [{ type: "uint256" }],
},
 {
   type: "function",
   name: "borrowBalanceOf", // https://docs.compound.finance/helper-functions/#supplied-base-balance
   stateMutability: "view",
   inputs: [{ name: "account", type: "address" }],
   outputs: [{ type: "uint256" }],
 },
 {
   type: "function",
   name: "decimals", // Return decimal point of the token
   stateMutability: "view",
   inputs: [],
   outputs: [{ type: "uint" }],
 },
 {
   type: "function",
   name: "baseTokenPriceFeed", // Return the price feed smart contract address
   stateMutability: "view",
   inputs: [],
   outputs: [{ type: "address" }],
 },
 {
   type: "function",
   name: "getPrice", // get the price of the token
   stateMutability: "view",
   inputs: [{ name: "priceFeed", type: "address" }],
   outputs: [{ type: "uint128" }],
 },
 {
  type: "function",
  name: "collateralBalanceOf", // get the price of the token
  stateMutability: "view",
  inputs: [{ name: "account", type: "address" },{ name: "asset", type: "address" }],
  outputs: [{ type: "uint128" }],
},
] as const;