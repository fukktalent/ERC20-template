import { task } from 'hardhat/config'


task("transfer", "Transfer tokens")
    .addParam("contract", "token address")
    .addParam("to", "recipient address")
    .addParam("amount", "amount of tokens")
    .setAction(async ({ contract, to, amount }, { ethers }) => {
        const [signer] = await ethers.getSigners();

        const erc20token = await ethers.getContractAt("ERC20Token", contract, signer);

        await erc20token.transfer(to, BigInt(amount));
        console.log('tokens were transfered');
    });

task("approve", "Approve tokens")
    .addParam("contract", "token address")
    .addParam("to", "recipient address")
    .addParam("amount", "amount of tokens")
    .setAction(async ({ contract, to, amount }, { ethers }) => {
        const [signer] = await ethers.getSigners();

        const erc20token = await ethers.getContractAt("ERC20Token", contract, signer);

        await erc20token.approve(to, BigInt(amount));
        console.log('tokens were approved');
    });

task("transferFrom", "Transfer tokens from chosen address")
    .addParam("contract", "token address")
    .addParam("from", "owner address")
    .addParam("to", "recipient address")
    .addParam("amount", "amount of tokens")
    .setAction(async ({ contract, from, to, amount }, { ethers }) => {
        const [signer] = await ethers.getSigners();

        const erc20token = await ethers.getContractAt("ERC20Token", contract, signer);

        await erc20token.transferFrom(from, to, BigInt(amount));
        console.log('tokens were transfered');
    });

task("mint", "Mint tokens")
    .addParam("contract", "token address")
    .addParam("to", "mint address")
    .addParam("amount", "amount of tokens")
    .setAction(async ({ contract, to, amount }, { ethers }) => {
        const [signer] = await ethers.getSigners();

        const erc20token = await ethers.getContractAt("ERC20Token", contract, signer);

        await erc20token.mint(to, BigInt(amount));
        console.log('tokens were minted');
    });

task("burn", "Burn tokens")
    .addParam("contract", "token address")
    .addParam("from", "burn address")
    .addParam("amount", "amount of tokens")
    .setAction(async ({ contract, from, amount }, { ethers }) => {
        const [signer] = await ethers.getSigners();

        const erc20token = await ethers.getContractAt("ERC20Token", contract, signer);

        await erc20token.burn(from, BigInt(amount));
        console.log('tokens were burned');
    });