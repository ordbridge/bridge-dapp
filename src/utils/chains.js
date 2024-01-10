import AvalancheIcon from '../assets/avalanche.png';
import BrcIcon from '../assets/bitcoin.png';
import EthereumIcon from '../assets/ethereum.png';
import ArbitrumIcon from '../assets/arbitrum.png';
import BaseIcon from '../assets/base.svg';
import SolanaIcon from '../assets/solana.png';
import PolygonIcon from '../assets/polygon.png';

export const appChains = [
  {
    isEvm: true,
    name: 'Ethereum',
    key: 'ethchain',
    value: 'ETHEREUM',
    wallet: 'metamask',
    tag: 'ETH',
    tokenTag: 'ERC20',
    chainId: '0x1',
    infuraTag: 'mainnet',
    tokenAddress: '0x6602e9319f2c5ec0ba31ffcdc4301d7ef03b709e',
    tokenLink: 'https://etherscan.io/token/0x6602e9319f2c5ec0ba31ffcdc4301d7ef03b709e',
    contractAddress: '0xa237f89cb12bff9932c7503f854ad881dcead73a',
    contractLink: 'https://etherscan.io/address/0xa237f89cb12bff9932c7503f854ad881dcead73a',
    chain_flag: 'BRC_TO_ETH',
    icon: EthereumIcon
  },
  {
    isEvm: false,
    name: 'Bitcoin',
    value: 'BRC',
    tokenTag: 'BRC20',
    tag: 'BRC',
    wallet: 'unisat',
    icon: BrcIcon
  },
  {
    isEvm: true,
    name: 'Avalanche',
    key: 'avaxchain',
    value: 'AVALANCHE',
    tokenTag: 'ARC20',
    tag: 'AVAX',
    wallet: 'metamask',
    chainId: '0xa86a',
    infuraTag: 'avalanche-mainnet',
    tokenAddress: '0x5f880678320A9445824bB15d18EF67b5ECbAA42a',
    tokenLink:
      'https://snowtrace.io/token/0x5f880678320A9445824bB15d18EF67b5ECbAA42a?chainId=43114',
    contractAddress: '0xD45De358A33e5c8f1DC80CCd771ae411C3fBd384',
    contractLink: 'https://snowtrace.io/address/0xD45De358A33e5c8f1DC80CCd771ae411C3fBd384',
    chainListId: 43114,
    chain_flag: 'BRC_TO_AVAX',
    icon: AvalancheIcon
  },
  {
    isEvm: true,
    name: 'Arbitrum',
    key: 'arbichain',
    value: 'ARBITRUM',
    tokenTag: 'ARB-ERC20',
    infuraTag: 'arbitrum-mainnet',
    wallet: 'metamask',
    tag: 'ARBI',
    chainId: '0xa4b1',
    tokenAddress: '0x6602e9319f2c5ec0ba31ffcdc4301d7ef03b709e',
    tokenLink: 'https://arbiscan.io/token/0x6602e9319f2c5ec0ba31ffcdc4301d7ef03b709e',
    contractAddress: '0xa237f89Cb12bfF9932C7503F854ad881Dcead73a',
    contractLink: 'https://arbiscan.io/address/0xa237f89cb12bff9932c7503f854ad881dcead73a',
    chainListId: 42161,
    chain_flag: 'BRC_TO_ARBI',
    icon: ArbitrumIcon
  },
  {
    isEvm: true,
    name: 'Base',
    key: 'basechain',
    value: 'BASE',
    tokenTag: 'BASE-ERC20',
    wallet: 'metamask',
    tag: 'BASE',
    infuraTag: 'base-goerli',
    chainId: '0x2105',
    tokenAddress: '0x6602e9319f2c5ec0ba31ffcdc4301d7ef03b709e',
    tokenLink: 'https://basescan.org/token/0x6602e9319f2c5ec0ba31ffcdc4301d7ef03b709e',
    contractAddress: '0xa237f89Cb12bfF9932C7503F854ad881Dcead73a',
    contractLink: 'https://basescan.org/address/0xa237f89cb12bff9932c7503f854ad881dcead73a',
    chainListId: 8453,
    chain_flag: 'BRC_TO_BASE',
    icon: BaseIcon
  },
  {
    isEvm: false,
    name: 'Solana',
    value: 'SOLANA',
    tokenTag: 'SPL',
    wallet: 'phantom',
    tag: 'SOL',
    key: 'solchain',
    tokenAddress: '4cCjHnKqLFMMNYQD2NYuRMrw7nXkxVsD85G2MkMA44vM',
    tokenLink: 'https://solscan.io/token/4cCjHnKqLFMMNYQD2NYuRMrw7nXkxVsD85G2MkMA44vM',
    chain_flag: 'BRC_TO_SOL',
    icon: SolanaIcon
  },
  {
    isEvm: true,
    name: 'Polygon',
    key: 'polychain',
    wallet: 'metamask',
    value: 'MATIC',
    tokenTag: 'MATIC-ERC20',
    tag: 'MATIC',
    infuraTag: 'polygon-mainnet',
    chainId: '0x89',
    tokenAddress: '0x6602e9319f2c5ec0ba31ffcdc4301d7ef03b709e',
    contractAddress: '0xdEF327121963E909CF2ee32Dbee62ABC8cc73201',
    contractLink: 'https://polygonscan.com/address/0xdef327121963e909cf2ee32dbee62abc8cc73201',
    chainListId: 137,
    chain_flag: 'BRC_TO_POLY',
    icon: PolygonIcon
  }
];

export const getChainByTag = (tag) => {
  const tagToLower = tag.toLowerCase();
  return appChains.find((chain) => chain.tag.toLowerCase() === tagToLower);
};

export const getWeb3UrlByTag = (tag) => {
  const requestedChain = getChainByTag(tag);

  return tag.toLowerCase() !== 'base'
    ? `https://${requestedChain.infuraTag}.infura.io/v3/18b346ece35742b2948e73332f85ad86`
    : 'https://base-mainnet.g.alchemy.com/v2/MiFWZXgXz9fVhntEMJ3qZzti8RCGh9bP';
};

export const getWalletStringForType = (chainType) => {
  if (chainType === 'b') {
    return 'unisat';
  }
  if (chainType === 'e') {
    return 'metamask';
  }
  if (chainType === 's') {
    return 'phantom';
  }
};
