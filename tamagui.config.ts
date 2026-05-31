import { defaultConfig, themes as defaultThemes, tokens as defaultTokens } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'

const tokens = createTokens({
  radius: defaultTokens.radius,
  zIndex: defaultTokens.zIndex,
  space:  defaultTokens.space,
  size:   defaultTokens.size,
})

const darkTheme = {
  ...defaultThemes.dark,
  background:      '#1a1520',
  backgroundHover: '#241d2e',
  borderColor:     '#3a2f47',
  color:           '#f0eaf7',
  colorMuted:      '#a096b0',
  primary:         '#aa83d4',
  primaryDark:     '#8d7b9f',
  accent:          '#bfe0a6',
  soft:            '#d0bedd',
  subtle:          '#cfdac3',
}

const lightTheme = {
  ...defaultThemes.light,
  background:      '#f5f2f8',
  backgroundHover: '#ffffff',
  borderColor:     '#e8dff0',
  color:           '#1a1520',
  colorMuted:      '#a096b0',
  primary:         '#8d7b9f',
  primaryDark:     '#aa83d4',
  accent:          '#bfe0a6',
  soft:            '#d0bedd',
  subtle:          '#cfdac3',
}

const config = createTamagui({
  ...defaultConfig,
  tokens,
  themes: {
    dark:  darkTheme,
    light: lightTheme,
  },
})

export default config

export type Conf = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}