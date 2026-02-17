export const Colors = {
  primary: 'rgb(178, 149, 93)',
  text: 'rgb(68, 68, 68)',
  textLight: 'rgb(161, 161, 161)',
  textGray: 'rgb(158, 158, 158)',
  border: 'rgb(236, 236, 236)',
  white: 'white',
  black: 'black',
  background: 'rgb(245, 245, 247)'
} as const;

export const Spacing = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 12,
  xl: 13,
  xxl: 16,
  xxxl: 20,
  section: 22,
  cardPadding: 40,
  cardRadius: 15,
  inputHeight: 38,
  buttonHeight: 63,
  buttonRadius: 63,
  labelWidth: 140,
  containerMaxWidth: 1200,
  cardMaxWidth: 660
} as const;

export const FontSize = {
  xs: 13,
  sm: 14,
  md: 15,
  base: 16,
  lg: 18,
  xl: 28,
  title: 30
} as const;

export const InputStyles = {
  container: {
    marginBottom: Spacing.section,
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    width: Spacing.labelWidth,
    fontSize: FontSize.base,
    color: Colors.text,
    textAlign: 'center' as const
  },
  inputWrapper: {
    flex: 1
  },
  input: {
    width: '100%',
    height: Spacing.inputHeight,
    fontSize: FontSize.base,
    border: `1px solid ${Colors.border}`,
    borderRadius: 6,
    padding: '0 13px',
    outline: 'none',
    color: Colors.text
  }
} as const;

export const CardStyles = {
  container: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: `${Spacing.cardPadding}px ${Spacing.cardPadding + 20}px`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
  }
} as const;

export const ButtonStyles = {
  primary: {
    width: '100%',
    maxWidth: 546,
    height: Spacing.buttonHeight,
    backgroundColor: Colors.black,
    color: 'rgb(247, 211, 161)',
    borderRadius: Spacing.buttonRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: FontSize.lg,
    cursor: 'pointer',
    fontWeight: 500
  }
} as const;

export const RadioButtonStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: FontSize.base,
    color: Colors.text
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: `2px solid ${Colors.text}`,
    backgroundColor: 'transparent',
    marginRight: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center' as const
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: Colors.white
  }
} as const;
