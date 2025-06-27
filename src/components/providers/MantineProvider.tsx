'use client'

import { MantineProvider as BaseMantineProvider, createTheme } from '@mantine/core'
import { type ReactNode } from 'react'

interface MantineProviderProps {
  children: ReactNode
}

const theme = createTheme({
  primaryColor: 'purple',
  colors: {
    purple: [
      '#F6E6F5',
      '#ECC9EA',
      '#E2ACDF',
      '#D98FD4',
      '#CF72C9',
      '#C555BE',
      '#8A2B85',
      '#701B6C',
      '#561453',
      '#3C0D3A',
    ],
  },
  fontFamily: 'var(--font-sans)',
  defaultRadius: 'md',
  components: {
    TextInput: {
      defaultProps: {
        size: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'md',
      },
    },
  },
})

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme} forceColorScheme="dark">
      {children}
    </BaseMantineProvider>
  )
} 