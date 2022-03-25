// import { Fetcher, Route, Token } from '@uniswap/sdk';
//import { Fetcher as FetcherSpirit, Token as TokenSpirit } from '@spiritswap/sdk';
import { Fetcher, Price, Route, Token } from '@traderjoe-xyz/sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, iSkeenSwapperStat } from './types';
import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';

import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { AVAX_TICKER, SPOOKY_ROUTER_ADDR, KEEN_TICKER } from '../utils/constants';
/**
 * An API module of Keen Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class KeenFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;

  KEENAVAX_LP: Contract;
  KEEN: ERC20;
  iSKEEN: ERC20;
  AVAX: ERC20;
  iBKEEN: ERC20;
  ISKEENKEEN_LP: Contract;
  ISKEENAVAX_LP: Contract;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.KEEN = new ERC20(deployments.Keen.address, provider, 'KEEN');
    this.iSKEEN = new ERC20(deployments.iSkeen.address, provider, 'iSKEEN');
    this.iBKEEN = new ERC20(deployments.iBKEEN.address, provider, 'iBKEEN');

    this.AVAX = this.externalTokens['AVAX'];

    // Uniswap V2 Pair

    this.KEENAVAX_LP = new Contract(externalTokens['KEEN-AVAX-LP'][0], IUniswapV2PairABI, provider);
    this.ISKEENAVAX_LP = new Contract(externalTokens['iSKEEN-AVAX-LP'][0], IUniswapV2PairABI, provider);
    //this.ISKEENKEEN_LP = new Contract(externalTokens['iSKEEN-KEEN-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.KEEN, this.iSKEEN, this.iBKEEN, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.KEENAVAX_LP = this.KEENAVAX_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM APE TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getKeenStat(): Promise<TokenStat> {
    const { KeenGenesisRewardPool } = this.contracts;
    const supply = await this.KEEN.totalSupply();
    const keenRewardPoolSupply = await this.KEEN.balanceOf(KeenGenesisRewardPool.address);
    //const keenRewardPoolSupply2 = await this.KEEN.balanceOf(KeenRewardPool.address);
    const keenCirculatingSupply = supply.sub(keenRewardPoolSupply); //.sub(keenRewardPoolSupply2);
    //  const priceInAVAX = await this.getTokenPriceFromPancakeswap(this.KEEN);
    //const priceInAVAXstring = priceInAVAX.toString();
    const priceInAVAX = await this.getTokenPriceFromPancakeswapAVAX(this.KEEN);
    // const priceOfOneAVAX = await this.getAVAXPriceFromPancakeswap();
    const priceOfOneAVAX = await this.getAVAXPriceFromPancakeswap();
    //const priceInDollars = await this.getTokenPriceFromPancakeswapKEENUSD();
    const priceOfKeenInDollars = (Number(priceInAVAX) * Number(priceOfOneAVAX)).toFixed(2);
    //console.log('priceOfKeenInDollars', priceOfKeenInDollars);
    return {
      //  tokenInFtm: (Number(priceInAVAX) * 100).toString(),
      tokenInFtm: priceInAVAX.toString(),
      priceInDollars: priceOfKeenInDollars,
      totalSupply: getDisplayBalance(supply, this.KEEN.decimal, 0),
      circulatingSupply: getDisplayBalance(keenCirculatingSupply, this.KEEN.decimal, 0),
    };
  }

  async getAVAXPriceUSD(): Promise<Number> {
    const priceOfOneAVAX = await this.getAVAXPriceFromPancakeswap();
    return Number(priceOfOneAVAX);
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    // console.log('NAME', name);

    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('KEEN') ? this.KEEN : this.iSKEEN;
    // console.log('NAME', name);

    const isKeen = name.startsWith('KEEN');
    console.log(isKeen);
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const ftmAmountBN = await this.AVAX.balanceOf(lpToken.address);
    const ftmAmount = getDisplayBalance(ftmAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isKeen);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  async getLPStatAVAX(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('KEEN') ? this.KEEN : this.iSKEEN;
    const isKeen = name.startsWith('KEEN');
    console.log(isKeen);
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const avaxAmountBN = await this.AVAX.balanceOf(lpToken.address);
    const avaxAmount = getDisplayBalance(avaxAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(avaxAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isKeen);

    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();

    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();

    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(5).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }
  /**
   * Use this method to get price for Keen
   * @returns TokenStat for iBKEEN
   * priceInAVAX
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const keenStat = await this.getKeenStat();
    const bondKeenRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondKeenRatioBN / 1e14 > 1 ? bondKeenRatioBN / 1e14 : 1;
    const bondPriceInAVAX = (Number(keenStat.tokenInFtm) * modifier).toFixed(4);
    const priceOfBBondInDollars = (Number(keenStat.priceInDollars) * modifier).toFixed(4);
    const supply = await this.iBKEEN.displayedTotalSupply();
    return {
      tokenInFtm: bondPriceInAVAX,
      priceInDollars: priceOfBBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for iSKEEN
   * priceInAVAX
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { iSkeenRewardPool } = this.contracts;

    const supply = await this.iSKEEN.totalSupply();

    const priceInAVAX = await this.getTokenPriceFromPancakeswap(this.iSKEEN);
    const keenRewardPoolSupply = 0; //await this.iSKEEN.balanceOf(iSkeenRewardPool.address);
    const tShareCirculatingSupply = supply.sub(keenRewardPoolSupply);
    const priceOfOneAVAX = await this.getAVAXPriceFromPancakeswap();
    const priceOfSharesInDollars = (Number(priceInAVAX) * Number(priceOfOneAVAX)).toFixed(2);

    return {
      tokenInFtm: priceInAVAX,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.iSKEEN.decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.iSKEEN.decimal, 0),
    };
  }

  async getKeenStatInEstimatedTWAP(): Promise<TokenStat> {
    const { Oracle, KeenRewardPool } = this.contracts;
    const expectedPrice = await Oracle.twap(this.KEEN.address, ethers.utils.parseEther('10000'));

    const supply = await this.KEEN.totalSupply();
    const keenRewardPoolSupply = await this.KEEN.balanceOf(KeenRewardPool.address);
    const keenCirculatingSupply = supply.sub(keenRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.KEEN.decimal, 0),
      circulatingSupply: getDisplayBalance(keenCirculatingSupply, this.KEEN.decimal, 0),
    };
  }

  async getKeenPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getKeenUpdatedPrice();
  }

  // async getKeenPegTWAP(): Promise<any> {
  //   const { Treasury } = this.contracts;
  //   const updatedPrice = Treasury.getKeenUpdatedPrice();
  //   const updatedPrice2 = updatedPrice * 10000;
  //   return updatedPrice2;
  // }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    // const burnableKeen = (Number(Treasury.getBurnableKeenLeft()) * 1000).toFixed(2).toString();
    return Treasury.getBurnableKeenLeft();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    console.log(depositTokenPrice);
    const stakeInPool = await depositToken.balanceOf(bank.address);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));

    const stat = bank.earnTokenName === 'KEEN' ? await this.getKeenStat() : await this.getShareStat();

    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      bank.contract,
      poolContract,
      bank.depositTokenName,
    );

    const tokenPerHour = tokenPerSecond.mul(60).mul(60);
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }

  /**
   * Method to return the whitelist status of the address
   * @param address the address to check
   * @returns boolean, true or false
   */
  async getWhitelistedStatus(address: string): Promise<boolean> {
    const { Whitelist } = this.contracts;
    return (await Whitelist.balanceOf(address)).gte(1);
  }
  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === 'KEEN') {
      if (!contractName.endsWith('GenesisRewardPool')) {
        const rewardPerSecond = await poolContract.keenPerSecond();
        if (depositTokenName.startsWith('iSKEEN-AVAX')) {
          return rewardPerSecond.mul(30000).div(100000);
        } else if (depositTokenName.startsWith('KEEN-AVAX')) {
          return rewardPerSecond.mul(40000).div(100000);
        } else if (depositTokenName.startsWith('KEEN')) {
          return rewardPerSecond.mul(30000).div(100000);
        }
        return rewardPerSecond.div(24);
      }

      const poolStartTime = await poolContract.poolStartTime();
      const startDateTime = new Date(poolStartTime.toNumber() * 1000);

      return await poolContract.epochKeenPerSecond(0);
    }
    if (earnTokenName === 'iSKEEN') {
      if (contractName.endsWith('iSkeenRewardPool')) {
        const rewardPerSecond = await poolContract.iSKEENPerSecond();

        if (depositTokenName.startsWith('iSKEEN-AVAX')) {
          return rewardPerSecond.mul(45000).div(100000);
        } else if (depositTokenName.startsWith('KEEN-AVAX')) {
          return rewardPerSecond.mul(30000).div(100000);
        } else if (depositTokenName.startsWith('KEEN')) {
          return rewardPerSecond.mul(30000).div(100000);
        }
      }
    }

    // 0.017361111 per second in total

    // if (depositTokenName.startsWith('KEEN-AVAX')) {
    //   return rewardPerSecond.mul(41650).div(10000);
    // } else if (depositTokenName.startsWith('KEEN-iSKEEN')) {
    //   return rewardPerSecond.mul(0).div(119000);
    // } else if (depositTokenName.startsWith('KEEN')) {
    //   return rewardPerSecond.mul(59500).div(10000);
    // } else {
    //   return rewardPerSecond.mul(17850).div(10000);
    // }
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    const priceOfOneFtmInDollars = await this.getAVAXPriceFromPancakeswap();
    if (tokenName === 'AVAX') {
      tokenPrice = priceOfOneFtmInDollars;
    } else {
      if (tokenName === 'KEEN-AVAX-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.KEEN, true);
      } else if (tokenName === 'KEEN-iSKEEN-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.KEEN, true);
      } else if (tokenName === 'iSKEEN-AVAX-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.iSKEEN, false);
      } else {
        tokenPrice = await this.getTokenPriceFromPancakeswap(token);
        tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
      }
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryKeenPrice = await Treasury.getKeenPrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryKeenPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForKeen = await Treasury.getKeenPrice();

    return await Treasury.redeemBonds(decimalToBalance(amount), priceForKeen);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      if (pool == undefined) {
        console.log('YOOOO ERROR');
        console.dir(bankInfo);
      }
      const token = this.externalTokens[bankInfo.depositTokenName];

      const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      const tokenAmountInPool = await token.balanceOf(pool.address);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }

    const iSKEENPrice = (await this.getShareStat()).priceInDollars;
    const KEENPrice = (await this.getKeenStat()).priceInDollars;

    const boardroomtShareBalanceOf = await this.iSKEEN.balanceOf(this.currentBoardroom().address);

    const boardroomTVL = Number(getDisplayBalance(boardroomtShareBalanceOf, this.iSKEEN.decimal)) * Number(iSKEENPrice);

    return totalValue + boardroomTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be AVAX in most cases)
   * @param isKeen sanity check for usage of keen token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isKeen: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);

    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isKeen === true ? await this.getKeenStat() : await this.getShareStat();

    const priceOfToken = stat.priceInDollars;

    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'KEEN') {
        return await pool.pendingKEEN(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      // @ts-ignore
      console.error(`Failed to call pendingShare() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      // @ts-ignore
      console.error(`Failed to call userInfo() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.deposit(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return await pool.withdraw(poolId, 0);
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Boardroom;
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async getTokenPriceFromPancakeswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    // this shouldn't happen, but tokenContract is somehow undefined
    if (tokenContract == undefined) {
      return;
    }
    //const { chainId } = this.config;
    const { AVAX } = this.config.externalTokens;

    const wavax = new Token(43114, AVAX[0], AVAX[1], 'AVAX');
    const token = new Token(43114, tokenContract.address, tokenContract.decimal, tokenContract.symbol);

    try {
      if (token.address == wavax.address) {
        return await this.getAVAXPriceFromPancakeswap();
      }
      const wavaxToToken = await Fetcher.fetchPairData(wavax, token, this.provider);

      const priceInWAVAX = new Route([wavaxToToken], token);

      return priceInWAVAX.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromPancakeswapAVAX(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    return this.getTokenPriceFromPancakeswap(tokenContract);
  }

  async getTokenPriceFromPancakeswapKEENUSD(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    //const { chainId } = this.config;
    //const {AVAX} = this.config.externalTokens;

    //  const wbnb = new Token(43114, AVAX[0], AVAX[1]);
    const avaxb = new Token(43114, this.AVAX.address, this.AVAX.decimal, 'AVAX', 'AVAX');
    const token = new Token(43114, this.KEEN.address, this.KEEN.decimal, this.KEEN.symbol);
    try {
      const wftmToToken = await Fetcher.fetchPairData(avaxb, token, this.provider);
      const priceInBUSD = new Route([wftmToToken], token);
      // console.log('test', priceInBUSD.midPrice.toFixed(12));

      const priceForPeg = Number(priceInBUSD.midPrice.toFixed(12)) * 10000;
      return priceForPeg.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${this.KEEN.symbol}: ${err}`);
    }
  }

  // async getTokenPriceFromSpiritswap(tokenContract: ERC20): Promise<string> {
  //   const ready = await this.provider.ready;
  //   if (!ready) return;
  //   const { chainId } = this.config;

  //   const { AVAX } = this.externalTokens;

  //   const wftm = new TokenSpirit(chainId, AVAX.address, AVAX.decimal);
  //   const token = new TokenSpirit(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
  //   try {
  //     const wftmToToken = await FetcherSpirit.fetchPairData(wftm, token, this.provider);
  //     const liquidityToken = wftmToToken.liquidityToken;
  //     let ftmBalanceInLP = await AVAX.balanceOf(liquidityToken.address);
  //     let ftmAmount = Number(getFullDisplayBalance(ftmBalanceInLP, AVAX.decimal));
  //     let shibaBalanceInLP = await tokenContract.balanceOf(liquidityToken.address);
  //     let shibaAmount = Number(getFullDisplayBalance(shibaBalanceInLP, tokenContract.decimal));
  //     const priceOfOneFtmInDollars = await this.getAVAXPriceFromPancakeswap();
  //     let priceOfShiba = (ftmAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
  //     return priceOfShiba.toString();
  //   } catch (err) {
  //     console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
  //   }
  // }

  async getAVAXPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;

    const { AVAX, MIM } = this.externalTokens;

    const token = new Token(43114, MIM.address, MIM.decimal, 'MIM');
    const wavax = new Token(43114, AVAX.address, AVAX.decimal, 'WAVAX');

    try {
      const wavaxToToken = await Fetcher.fetchPairData(wavax, token, this.provider);

      const priceInMIM = new Route([wavaxToToken], wavax);
      return priceInMIM.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch AVAX price: ${err}`);
    }
  }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getBoardroomAPR() {
    const Boardroom = this.currentBoardroom();
    const latestSnapshotIndex = await Boardroom.latestSnapshotIndex();
    const lastHistory = await Boardroom.boardroomHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const iSKEENPrice = (await this.getShareStat()).priceInDollars;
    const KEENPrice = (await this.getKeenStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(KEENPrice) * 4;
    const boardroomtShareBalanceOf = await this.iSKEEN.balanceOf(Boardroom.address);
    const boardroomTVL = Number(getDisplayBalance(boardroomtShareBalanceOf, this.iSKEEN.decimal)) * Number(iSKEENPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / boardroomTVL) * 365;
    return realAPR;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromBoardroom(): Promise<boolean> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromBoardroom(): Promise<boolean> {
    const Boardroom = this.currentBoardroom();
    const canWithdraw = await Boardroom.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnBoardroom();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.iSKEEN.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromBoardroom(): Promise<BigNumber> {
    // const Boardroom = this.currentBoardroom();
    // const mason = await Boardroom.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.totalSupply();
  }

  async stakeShareToBoardroom(amount: string): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error("you're using old boardroom. please withdraw and deposit the iSKEEN again.");
    }
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async stakeToKeen(amount: string): Promise<TransactionResponse> {
    const Xkeen = this.contracts.xKEEN;
    return await Xkeen.enter(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getShareOf(this.myAccount);
    }
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getStakedKeen(): Promise<BigNumber> {
    const Xkeen = this.contracts.xKEEN;
    return await Xkeen.balanceOf(this.myAccount);
  }

  async getTotalStakedKeen(): Promise<BigNumber> {
    const Xkeen = this.contracts.xKEEN;
    const keen = this.KEEN;
    return await keen.balanceOf(Xkeen.address);
  }

  async getEarningsOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getCashEarningsOf(this.myAccount);
    }
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.claimDividends();
    }
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    const nextEpochTimestamp = await Boardroom.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Boardroom.epoch();
    const mason = await Boardroom.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Boardroom.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    const nextEpochTimestamp = await Boardroom.nextEpochPoint();
    const currentEpoch = await Boardroom.epoch();
    const mason = await Boardroom.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Boardroom.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnBoardroom();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === 'KEEN') {
        asset = this.KEEN;
      } else if (assetName === 'iSKEEN') {
        asset = this.iSKEEN;
      } else if (assetName === 'iBKEEN') {
        asset = this.iBKEEN;
      } else if (assetName === 'AVAX') {
        asset = this.AVAX;
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryBoardroomFundedFilter = Treasury.filters.BoardroomFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let boardroomFundEvents = await Treasury.queryFilter(treasuryBoardroomFundedFilter);
    var events: any[] = [];
    boardroomFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].boardroomFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });

    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === AVAX_TICKER) {
      estimate = await zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      const token = tokenName === KEEN_TICKER ? this.KEEN : this.iSKEEN;
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === AVAX_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
      };
      return await zapper.zapIn(lpToken.address, SPOOKY_ROUTER_ADDR, this.myAccount, overrides);
    } else {
      const token = tokenName === KEEN_TICKER ? this.KEEN : this.iSKEEN;
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    }
  }
  async swapBBondToiSkeen(bbondAmount: BigNumber): Promise<TransactionResponse> {
    const { iSkeenSwapper } = this.contracts;
    return await iSkeenSwapper.swapBBondToiSkeen(bbondAmount);
  }
  async estimateAmountOfiSkeen(bbondAmount: string): Promise<string> {
    const { iSkeenSwapper } = this.contracts;
    try {
      const estimateBN = await iSkeenSwapper.estimateAmountOfiSkeen(parseUnits(bbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate iskeen amount: ${err}`);
    }
  }

  async getiSkeenSwapperStat(address: string): Promise<iSkeenSwapperStat> {
    const { iSkeenSwapper } = this.contracts;
    const iskeenBalanceBN = await iSkeenSwapper.getiSkeenBalance();
    const bbondBalanceBN = await iSkeenSwapper.getBBondBalance(address);
    // const keenPriceBN = await iSkeenSwapper.getKeenPrice();
    // const iskeenPriceBN = await iSkeenSwapper.getiSkeenPrice();
    const rateiSkeenPerKeenBN = await iSkeenSwapper.getiSkeenAmountPerKeen();
    const iskeenBalance = getDisplayBalance(iskeenBalanceBN, 18, 5);
    const bbondBalance = getDisplayBalance(bbondBalanceBN, 18, 5);
    return {
      iskeenBalance: iskeenBalance.toString(),
      bbondBalance: bbondBalance.toString(),
      // keenPrice: keenPriceBN.toString(),
      // iskeenPrice: iskeenPriceBN.toString(),
      rateiSkeenPerKeen: rateiSkeenPerKeenBN.toString(),
    };
  }
}
