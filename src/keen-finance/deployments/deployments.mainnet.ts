import {
  BoardroomABI,
  iBkeenABI,
  iSkeenABI,
  iSkeenRewardPoolABI,
  KeenABI,
  KeenGenesisRewardPoolABI,
  OracleABI,
  TreasuryABI,
  WhitelistABI,
} from './abi';
let deployments = {
  // Tokens
  iSkeen: {
    address: '0xac53b3dfb93ccceae015e7b5c1cef4681a2d3d9e',
    abi: iSkeenABI,
  },
  iBKEEN: {
    address: '0x1b5195c40adb6d1d3fdb17e6fb98b80726d1aa9e',
    abi: iBkeenABI,
  },
  Keen: {
    address: '0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E',
    abi: KeenABI,
  },
  // Core (not all, see full list on docs)
  Boardroom: {
    address: '0x74FDfe319eedF8b44e97E5d9FE2f5fea97d16de2',
    abi: BoardroomABI,
  },
  Treasury: {
    address: '0xdf2127a8099af98f401ef7cb8d5eae68d7f2716c',
    abi: TreasuryABI,
  },

  // Extras
  Whitelist: {
    address: '0x463791e15ccae33de02c2b247aa75e8d4c2d9980',
    abi: WhitelistABI,
  },

  // Genesis Pools

  KeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPoolABI,
  },
  GRAPEKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPoolABI,
  },
  ISKEENAVAXKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPoolABI,
  },
  KEENAVAXKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPoolABI,
  },
  WAVAXKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPoolABI,
  },

  // Regular Pools
  iSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPoolABI,
  },
  KEENAVAXiSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPoolABI,
  },
  iSKEENAVAXiSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPoolABI,
  },
  KEENSingleStakeiSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPoolABI,
  },
  Oracle: {
    address: '0x2734d6557c2dd7c65448334b1ff98525609917b0',
    // 0xCaaddD0154a53fC5C59839960B32E33D448637Fb is used
    // by the treasury as the oracle, but it proxies
    // data to the real contract.

    abi: OracleABI,
  },
  iSKEENKEENiSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPoolABI,
  },
};

export default deployments;

let {
  Keen,
  iSkeen,
  iSkeenRewardPool,
  KeenGenesisRewardPool,
  KEENAVAXKeenGenesisRewardPool,
  KEENSingleStakeiSkeenRewardPool,
  iBKEEN,
  GRAPEKeenGenesisRewardPool,
  WAVAXKeenGenesisRewardPool,
  Treasury,
  Whitelist,
  ISKEENAVAXKeenGenesisRewardPool,
  KEENAVAXiSkeenRewardPool,
  Oracle,
  iSKEENKEENiSkeenRewardPool,
} = deployments;
export {
  Keen,
  iSkeen,
  iSkeenRewardPool,
  KeenGenesisRewardPool,
  KEENAVAXKeenGenesisRewardPool,
  KEENSingleStakeiSkeenRewardPool,
  iBKEEN,
  GRAPEKeenGenesisRewardPool,
  WAVAXKeenGenesisRewardPool,
  Treasury,
  Whitelist,
  ISKEENAVAXKeenGenesisRewardPool,
  KEENAVAXiSkeenRewardPool,
  Oracle,
  iSKEENKEENiSkeenRewardPool,
};
