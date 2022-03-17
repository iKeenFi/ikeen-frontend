import React from 'react';

//Graveyard ecosystem logos
import keenLogo from '~src/assets/img/keen1.png';
import tShareLogo from '~src/assets/img/keen2.png';

import tBondLogo from '~src/assets/img/keen3.png';

import keenAvaxLpLogo from '~src/assets/img/keen-avax.png';
import iskeenAvaxLpLogo from '~src/assets/img/iskeen-avax.png';
import iskeenKeenLpLogo from '~src/assets/img/iskeen-keen.png';
import avaxLogo from '~src/assets/img/avax.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  KEEN: keenLogo,
  iSKEEN: tShareLogo,
  iBKEEN: tBondLogo,
  AVAX: avaxLogo,
  'KEEN-AVAX-LP': keenAvaxLpLogo,
  'iSKEEN-KEEN-LP': iskeenKeenLpLogo,
  'iSKEEN-AVAX-LP': iskeenAvaxLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
