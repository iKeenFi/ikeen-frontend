import { Configuration } from './keen-finance/config';
import { BankInfo } from './keen-finance';
import deploymentsMainnet from './keen-finance/deployments/deployments.mainnet';

const configurations: { [env: string]: Configuration } = {
  // development: {
  //   chainId: 97,
  //   networkName: 'BSC Testnet',
  //   ftmscanUrl: 'https://testnet.bscscan.com/',
  //   defaultProvider: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  //   deployments: require('./keen-finance/deployments/deployments.testing.json'),
  //   externalTokens: {
  //     WBNB: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18],
  //     FUSDT: ['0x55d398326f99059fF775485246999027B3197955', 18], // This is actually BUSD on mainnet not fusdt
  //     AVAX: ['0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18],
  //     ZOO: ['0x09e145a1d53c0045f41aeef25d8ff982ae74dd56', 0],
  //     SHIBA: ['0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', 9],
  //     'USDT-BNB-LP': ['0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16', 18],
  //     'KEEN-AVAX-LP': ['0x2A651563C9d3Af67aE0388a5c8F89b867038089e', 18],
  //     'iSKEEN-AVAX-LP': ['0x1303246855b5B5EbC71F049Fdb607494e97218f8', 18],
  //   },
  //   baseLaunchDate: new Date('2021-11-21 1:00:00Z'),
  //   bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
  //   boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
  //   refreshInterval: 10000,
  // },
  development: {
    chainId: 43114,
    networkName: 'Avalanche C-Chain',
    ftmscanUrl: 'https://snowtrace.io',
    defaultProvider: 'https://api.avax.network/ext/bc/C/rpc',
    deployments: deploymentsMainnet,
    externalTokens: {
      MIM: ['0x130966628846bfd36ff31a822705796e8cb8c18d', 18],
      AVAX: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 18],
      WAVAX: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 18],
      KEEN: ['0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E', 18],
      GRAPE: ['0x5541D83EFaD1f281571B343977648B75d95cdAC2', 18],
      'KEEN-AVAX-LP': ['0xa96C4f4960C43D2649Ac4eDc281e2172d632866f', 18],
      'iSKEEN-AVAX-LP': ['0x01870c499db548c4de0da05180365d32603262a2', 18],
      'iSKEEN-KEEN-LP': ['0xa4439d50f6CCd9E6b859f0434C42AA63882f4AF6', 18],
    },
    baseLaunchDate: new Date('2022-03-23 22:00:00Z'),
    bondLaunchesAt: new Date('2022-03-24 23:00:00Z'),
    boardroomLaunchesAt: new Date('2022-03-24 23:00:00Z'),
    refreshInterval: 10000,
  },
  production: {
    chainId: 43114,
    networkName: 'Avalanche C-Chain',
    ftmscanUrl: 'https://snowtrace.io',
    defaultProvider: 'https://api.avax.network/ext/bc/C/rpc',
    deployments: deploymentsMainnet,
    externalTokens: {
      MIM: ['0x130966628846bfd36ff31a822705796e8cb8c18d', 18],
      WAVAX: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 18],
      AVAX: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 18],
      KEEN: ['0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E', 18],
      GRAPE: ['0x5541D83EFaD1f281571B343977648B75d95cdAC2', 18],
      'KEEN-AVAX-LP': ['0xa96C4f4960C43D2649Ac4eDc281e2172d632866f', 18],
      'iSKEEN-AVAX-LP': ['0x01870c499db548c4de0da05180365d32603262a2', 18],
      'iSKEEN-KEEN-LP': ['0xa4439d50f6CCd9E6b859f0434C42AA63882f4AF6', 18],
    },
    baseLaunchDate: new Date('2022-03-23 22:00:00Z'),
    bondLaunchesAt: new Date('2022-03-24 23:00:00Z'),
    boardroomLaunchesAt: new Date('2022-03-24 23:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding KEEN
        - 2 = LP asset staking rewarding iSKEEN
  contract: the contract name which will be loaded from the deployment file
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */

  AVAXKeenRewardPool: {
    name: 'Earn KEEN by WAVAX',
    poolId: 1,
    sectionInUI: 0,
    contract: 'WAVAXKeenGenesisRewardPool',
    depositTokenName: 'WAVAX',
    earnTokenName: 'KEEN',
    finished: false,
    sort: 3,
    closedForStaking: false,
  },
  KeenAVAXLPKeenRewardPool: {
    name: 'Earn KEEN by KEEN-AVAX LP',
    poolId: 2,
    sectionInUI: 0,
    contract: 'KEENAVAXKeenGenesisRewardPool',
    depositTokenName: 'KEEN-AVAX-LP',
    earnTokenName: 'KEEN',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  GRAPEKeenRewardPool: {
    name: 'Earn KEEN by GRAPE',
    poolId: 3,
    sectionInUI: 0,
    contract: 'GRAPEKeenGenesisRewardPool',
    depositTokenName: 'GRAPE',
    earnTokenName: 'KEEN',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  iSkeenAVAXLPKeenRewardPool: {
    name: 'Earn KEEN by iSKEEN-AVAX LP',
    poolId: 0,
    sectionInUI: 0,
    contract: 'ISKEENAVAXKeenGenesisRewardPool',
    depositTokenName: 'iSKEEN-AVAX-LP',
    earnTokenName: 'KEEN',
    finished: false,
    sort: 0,
    closedForStaking: false,
  },

  // iskeen pools
  KEENSingleStakeiSkeenRewardPool: {
    name: 'Earn iSKEEN by KEEN',
    poolId: 2,
    sectionInUI: 1,
    contract: 'KEENSingleStakeiSkeenRewardPool',
    depositTokenName: 'KEEN',
    earnTokenName: 'iSKEEN',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  KEENAVAXiSkeenRewardPool: {
    name: 'Earn iSKEEN by KEEN-AVAX LP',
    poolId: 1,
    sectionInUI: 1,
    contract: 'KEENAVAXiSkeenRewardPool',
    depositTokenName: 'KEEN-AVAX-LP',
    earnTokenName: 'iSKEEN',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  iSKEENAVAXiSkeenRewardPool: {
    name: 'Earn iSKEEN by iSKEEN-AVAX LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'iSKEENAVAXiSkeenRewardPool',
    depositTokenName: 'iSKEEN-AVAX-LP',
    earnTokenName: 'iSKEEN',
    finished: false,
    sort: 0,
    closedForStaking: false,
  },
  iSKEENKEENiSkeenRewardPool: {
    name: 'Earn iSKEEN by iSKEEN-KEEN LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'iSKEENKEENiSkeenRewardPool',
    depositTokenName: 'iSKEEN-KEEN-LP',
    earnTokenName: 'iSKEEN',
    finished: false,
    sort: 0,
    closedForStaking: false,
  },
};

export default configurations[process.env.NODE_ENV || 'development'];
