import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20Token__factory, ERC20Token } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("ERC20Token", function () {
  const TOKEN = { NAME: 'test token', SYMBOL: 'TST', DECIMALS: 18 };
  const SOME_TOKENS_AMOUNT = 999;

  let erc20Token: ERC20Token;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  before(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
  //   erc20Token = await new ERC20Token__factory(owner).deploy(TOKEN.NAME, TOKEN.SYMBOL);
  //   await erc20Token.deployed();
  });

  describe("Token deploy", function () {
    it("Should deploy token contract with given params and default data", async function () {
      erc20Token = await new ERC20Token__factory(owner).deploy(TOKEN.NAME, TOKEN.SYMBOL);
      await erc20Token.deployed();

      expect(await erc20Token.owner()).to.be.equal(owner.address);
      expect(await erc20Token.name()).to.be.equal(TOKEN.NAME);
      expect(await erc20Token.symbol()).to.be.equal(TOKEN.SYMBOL);
      expect(await erc20Token.decimals()).to.be.equal(TOKEN.DECIMALS);
      expect(await erc20Token.totalSupply()).to.be.equal(0);
    });

    it("Should revert with empty args error", async function () {
      await expect(new ERC20Token__factory(owner).deploy(TOKEN.NAME, ''))
        .to.be.revertedWith("args shouldn't be empty");
      await expect(new ERC20Token__factory(owner).deploy('', ''))
        .to.be.revertedWith("args shouldn't be empty");
    });
  })

  describe("Mint", function () {
    beforeEach(async function () {
      erc20Token = await new ERC20Token__factory(owner).deploy(TOKEN.NAME, TOKEN.SYMBOL);
      await erc20Token.deployed();
    });

    it("Should mint tokens to user 1", async function () {
      const balance = await erc20Token.balanceOf(user1.address);
      await expect(erc20Token.mint(user1.address, SOME_TOKENS_AMOUNT))
        .to.emit(erc20Token, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, SOME_TOKENS_AMOUNT);;;
      expect(await erc20Token.balanceOf(user1.address))
        .to.be.equal(balance.add(BigNumber.from(SOME_TOKENS_AMOUNT)));
    })

    it("Should revert with zero address error", async function () {
      await expect(erc20Token.mint(ethers.constants.AddressZero, SOME_TOKENS_AMOUNT))
        .to.be.revertedWith("address shouldn't be zero");
    })

    it("Should revert with not owner error", async function () {
      await expect(erc20Token.connect(user1).mint(user1.address, SOME_TOKENS_AMOUNT))
        .to.be.revertedWith("not owner");
    })
  })

  describe("Burn", function () {
    beforeEach(async function () {
      erc20Token = await new ERC20Token__factory(owner).deploy(TOKEN.NAME, TOKEN.SYMBOL);
      await erc20Token.deployed();
      await erc20Token.mint(user1.address, SOME_TOKENS_AMOUNT);
    });

    it("Should mint tokens to user 1", async function () {
      const balance = await erc20Token.balanceOf(user1.address);
      await expect(erc20Token.burn(user1.address, SOME_TOKENS_AMOUNT))
        .to.emit(erc20Token, "Transfer").withArgs(user1.address, ethers.constants.AddressZero, SOME_TOKENS_AMOUNT);;
      expect(await erc20Token.balanceOf(user1.address))
        .to.be.equal(balance.sub(BigNumber.from(SOME_TOKENS_AMOUNT)));
    })

    it("Should revert with zero address error", async function () {
      await expect(erc20Token.burn(user1.address, SOME_TOKENS_AMOUNT + 100))
        .to.be.revertedWith("not enough balance");
    })

    it("Should revert with not owner error", async function () {
      await expect(erc20Token.connect(user1).burn(user1.address, SOME_TOKENS_AMOUNT))
        .to.be.revertedWith("not owner");
    })
  })

  describe("Transfer", function () {
    beforeEach(async function () {
      erc20Token = await new ERC20Token__factory(owner).deploy(TOKEN.NAME, TOKEN.SYMBOL);
      await erc20Token.deployed();
      await erc20Token.mint(user1.address, SOME_TOKENS_AMOUNT);
    });

    it("Should transfer tokens from user 1 to user 2", async function () {
      const user1Balance = await erc20Token.balanceOf(user1.address);
      const user2Balance = await erc20Token.balanceOf(user2.address);
      await expect(erc20Token.connect(user1).transfer(user2.address, SOME_TOKENS_AMOUNT))
        .to.emit(erc20Token, "Transfer").withArgs(user1.address, user2.address, SOME_TOKENS_AMOUNT);;
      expect(await erc20Token.balanceOf(user1.address))
        .to.be.equal(user1Balance.sub(BigNumber.from(SOME_TOKENS_AMOUNT)));
      expect(await erc20Token.balanceOf(user2.address))
        .to.be.equal(user2Balance.add(BigNumber.from(SOME_TOKENS_AMOUNT)));
    })

    it("Should revert with zero address error", async function () {
      const user1Balance = await erc20Token.balanceOf(user1.address);
      await expect(erc20Token.connect(user1).transfer(ethers.constants.AddressZero, SOME_TOKENS_AMOUNT))
        .to.be.revertedWith("address shouldn't be zero");
      expect(await erc20Token.balanceOf(user1.address)).to.be.equal(user1Balance);
    })

    it("Should revert with not enough balance error", async function () {
      const user1Balance = await erc20Token.balanceOf(user1.address);
      const user2Balance = await erc20Token.balanceOf(user2.address);
      await expect(erc20Token.connect(user1).transfer(user2.address, SOME_TOKENS_AMOUNT + 1))
        .to.be.revertedWith("not enough balance");
      expect(await erc20Token.balanceOf(user1.address)).to.be.equal(user1Balance);
      expect(await erc20Token.balanceOf(user2.address)).to.be.equal(user2Balance);
    })
  })

  describe("Approve", function () {
    beforeEach(async function () {
      erc20Token = await new ERC20Token__factory(owner).deploy(TOKEN.NAME, TOKEN.SYMBOL);
      await erc20Token.deployed();
      await erc20Token.mint(user1.address, SOME_TOKENS_AMOUNT);
    });

    it("Should approve user 2 to send tokens of user 1", async function () {
      await expect(erc20Token.connect(user1).approve(user2.address, SOME_TOKENS_AMOUNT))
        .to.emit(erc20Token, "Approval").withArgs(user1.address, user2.address, SOME_TOKENS_AMOUNT);
      expect(await erc20Token.allowance(user1.address, user2.address))
        .to.be.equal(SOME_TOKENS_AMOUNT);
    })

    it("Should revert with zero address error", async function () {
      await expect(erc20Token.connect(user1).approve(ethers.constants.AddressZero, SOME_TOKENS_AMOUNT))
        .to.be.revertedWith("address shouldn't be zero");
    })
  })

  describe("TransferFrom", function () {
    beforeEach(async function () {
      erc20Token = await new ERC20Token__factory(owner).deploy(TOKEN.NAME, TOKEN.SYMBOL);
      await erc20Token.deployed();
      await erc20Token.mint(user1.address, SOME_TOKENS_AMOUNT);
      erc20Token.connect(user1).approve(user3.address, SOME_TOKENS_AMOUNT);
    });

    it("Should transfer tokens from user 1 to user 2 (user 3 is signer)", async function () {
      const user1Balance = await erc20Token.balanceOf(user1.address);
      const user2Balance = await erc20Token.balanceOf(user2.address);
      await expect(erc20Token.connect(user3).transferFrom(user1.address, user2.address, SOME_TOKENS_AMOUNT))
        .to.emit(erc20Token, "Transfer").withArgs(user1.address, user2.address, SOME_TOKENS_AMOUNT)
        .and.to.emit(erc20Token, "Approval").withArgs(user1.address, user3.address, 0);
      expect(await erc20Token.balanceOf(user1.address))
        .to.be.equal(user1Balance.sub(BigNumber.from(SOME_TOKENS_AMOUNT)));
      expect(await erc20Token.balanceOf(user2.address))
        .to.be.equal(user2Balance.add(BigNumber.from(SOME_TOKENS_AMOUNT)));
      expect(await erc20Token.allowance(user1.address, user3.address))
        .to.be.equal(0);
    })

    it("Should revert with zero address error", async function () {
      const user1Balance = await erc20Token.balanceOf(user1.address);
      await expect(erc20Token.connect(user3).transferFrom(user1.address, ethers.constants.AddressZero, SOME_TOKENS_AMOUNT))
        .to.be.revertedWith("address shouldn't be zero");
      expect(await erc20Token.balanceOf(user1.address)).to.be.equal(user1Balance);
    })

    it("Should revert with not allowed amount error", async function () {
      const user1Balance = await erc20Token.balanceOf(user1.address);
      await expect(erc20Token.connect(user3).transferFrom(user1.address, ethers.constants.AddressZero, SOME_TOKENS_AMOUNT + 1))
        .to.be.revertedWith("not allowed amount");
      expect(await erc20Token.balanceOf(user1.address)).to.be.equal(user1Balance);
    })

    it("Should revert with not enough balance error when user 1 have less balance than needed", async function () {
      erc20Token.connect(user1).approve(user3.address, SOME_TOKENS_AMOUNT + 100);
      const user1Balance = await erc20Token.balanceOf(user1.address);
      await expect(erc20Token.connect(user3).transferFrom(user1.address, ethers.constants.AddressZero, SOME_TOKENS_AMOUNT + 1))
        .to.be.revertedWith("not enough balance");
      expect(await erc20Token.balanceOf(user1.address)).to.be.equal(user1Balance);
    })
  })
});
