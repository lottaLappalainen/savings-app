// Shortcuts so you never hardcode colors in components
// Use these instead of raw hex anywhere

export const palette = {
  purple:     '$purple',
  green:      '$green',
  lavender:   '$lavender',
  sage:       '$sage',
  deepPurple: '$deepPurple',
} as const

// Semantic tokens — what things mean, not what they look like
export const semantic = {
  primary:    '$primary',       // main brand color
  accent:     '$accent',        // success / positive amounts (green)
  soft:       '$soft',          // cards, subtle backgrounds (lavender)
  subtle:     '$subtle',        // secondary surfaces (sage)
  muted:      '$colorMuted',    // placeholder text, hints
} as const

// Typography scale
export const fontSize = {
  xs:   '$1',   // 11px — captions
  sm:   '$2',   // 13px — labels
  md:   '$3',   // 15px — body
  lg:   '$5',   // 18px — subheadings
  xl:   '$7',   // 22px — headings
  xxl:  '$9',   // 30px — hero numbers (savings amount)
} as const