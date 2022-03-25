import { Boardroom, iBkeen, iSkeen, iSkeenRewardPool, Keen, KeenGenesisRewardPool, Treasury, Whitelist } from './abi';
let deployments = {
  // Tokens
  iSkeen: {
    address: '0xac53b3dfb93ccceae015e7b5c1cef4681a2d3d9e',
    abi: iSkeen,
  },
  iBKEEN: {
    address: '0x1b5195c40adb6d1d3fdb17e6fb98b80726d1aa9e',
    abi: iBkeen,
  },
  Keen: {
    address: '0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E',
    abi: Keen,
  },
  // Core (not all, see full list on docs)
  Boardroom: {
    address: '0x74FDfe319eedF8b44e97E5d9FE2f5fea97d16de2',
    abi: Boardroom,
  },
  Treasury: {
    address: '0xdf2127a8099af98f401ef7cb8d5eae68d7f2716c',
    abi: Treasury,
  },

  // Extras
  Whitelist: {
    address: '0x463791e15ccae33de02c2b247aa75e8d4c2d9980',
    abi: Whitelist,
  },

  // Genesis Pools

  KeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPool,
  },
  GRAPEKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPool,
  },
  ISKEENAVAXKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPool,
  },
  KEENAVAXKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPool,
  },
  WAVAXKeenGenesisRewardPool: {
    address: '0x2d3cd5090d1a2af7d5e1f49c5171cf170c65b98d',
    abi: KeenGenesisRewardPool,
  },

  // Regular Pools
  iSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPool,
  },
  KEENAVAXiSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPool,
  },
  iSKEENAVAXiSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPool,
  },
  KEENSingleStakeiSkeenRewardPool: {
    address: '0x8863bEe7aeb94A17fb4a4d603b301733Aa06d3A5',
    abi: iSkeenRewardPool,
  },
};

export default deployments;
