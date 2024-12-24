import { assets } from 'chain-registry'
import { type Asset, type AssetList, type Chain } from '@chain-registry/types'
import { type Coin } from '@cosmjs/amino'
import { shiftDigits } from './calc'

export const getCoin = (chainName: string): Asset => {
  const chainAssets = getChainAssets(chainName)
  return chainAssets.assets[0]
}

export const getExponent = (chainName: string): number => {
  const unit = getCoin(chainName).denom_units.find((unit) => unit.denom === getCoin(chainName).display)
  return unit?.exponent ?? 6
}

export const getChainLogoByChainName = (chainName: string): string => {
  const asset = assets.find(({ chain_name }) => chain_name === chainName)
    ?.assets?.[0]

  return Object.values(asset?.logo_URIs ?? {})[0] ?? ''
}

export const getChainLogoFromChain = (chain: Chain): string => {
  return Object.values(chain?.logo_URIs ?? {})[0] ?? ''
}

export const getChainAssets = (chainName: string): AssetList => {
  return assets.find((chain) => chain.chain_name === chainName) as AssetList
}

export const getTokenByChainName = (chainName: string): Asset => {
  const chainAssets = getChainAssets(chainName)
  return chainAssets.assets[0]
}

export const getExponentByChainName = (chainName: string): number => {
  return (
    getTokenByChainName(chainName).denom_units.find(
      (unit) => unit.denom === getTokenByChainName(chainName).display
    )?.exponent ?? 6
  )
}

export const getExponentByDenom = (denom: string): number => {
  const asset = assets.find((chain) => chain.assets[0].base === denom)
    ?.assets[0]
  const exponent = asset?.denom_units.find(
    (unit) => unit.denom === asset.display
  )?.exponent
  return exponent ?? 6
}

export const getSymbolByDenom = (denom: string): string => {
  const asset = assets.find((chain) => chain.assets[0].base === denom)
    ?.assets[0]
  return asset?.symbol ?? ''
}

export const formatTokenAmount = (token: Coin): string => {
  const symbol = getSymbolByDenom(token.denom)
  const exponent = getExponentByDenom(token.denom)
  const displayAmount = shiftDigits(token.amount, -exponent)
  return `${displayAmount} ${symbol}`
}
