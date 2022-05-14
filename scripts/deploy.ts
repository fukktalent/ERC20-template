
import { ethers } from "hardhat";
import { ERC20Token__factory } from "../typechain-types";

import "dotenv/config";

const TOKEN_NAME: string = process.env.TOKEN_NAME || 'sample token';
const TOKEN_SYMBOL: string = process.env.TOKEN_SYMBOL || 'SAMPLE';

async function main() {
  const [owner] = await ethers.getSigners();
  const voting = await new ERC20Token__factory(owner).deploy(TOKEN_NAME, TOKEN_SYMBOL);
  await voting.deployed();
  console.log("Voting deployed to:", voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});