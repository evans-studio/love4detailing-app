import { ReactNode } from 'react'
import { responsiveClasses } from '@/lib/constants/breakpoints'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  fluid?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  noPadding?: boolean
  centerContent?: boolean
}

// Mobile-first max-width classes
const maxWidthClasses = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1280px]',
  '2xl': 'max-w-[1440px]',
  full: 'max-w-full',
}

// Mobile-first padding classes
const paddingClasses = {
  default: 'px-4 sm:px-6 lg:px-8',
  none: '',
}

export default function Container({
  children,
  className = '',
  as: Component = 'div',
  fluid = false,
  maxWidth = '2xl',
  noPadding = false,
  centerContent = false,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full',
        fluid ? 'max-w-full' : maxWidthClasses[maxWidth],
        noPadding ? paddingClasses.none : paddingClasses.default,
        centerContent && 'mx-auto',
        className
      )}
    >
      {children}
    </Component>
  )
}

// Section container with mobile-first vertical padding
export function Section({
  children,
  className = '',
  as: Component = 'section',
  fluid = false,
  maxWidth = '2xl',
  noPadding = false,
  centerContent = true,
}: ContainerProps) {
  return (
    <Container
      as={Component}
      className={cn(responsiveClasses.section, className)}
      fluid={fluid}
      maxWidth={maxWidth}
      noPadding={noPadding}
      centerContent={centerContent}
    >
      {children}
    </Container>
  )
}

// Enhanced grid container with mobile-first responsive columns
interface GridContainerProps extends ContainerProps {
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  autoFit?: boolean
  minChildWidth?: string
}

// Mobile-first gap classes
const gapClasses = {
  none: 'gap-0',
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-10',
}

export function GridContainer({
  children,
  className = '',
  as: Component = 'div',
  fluid = false,
  maxWidth = '2xl',
  noPadding = false,
  centerContent = true,
  cols = {
    xs: 1,
    sm: 2,
    lg: 3,
  },
  gap = 'md',
  autoFit = false,
  minChildWidth,
}: GridContainerProps) {
  // Build mobile-first responsive grid columns
  const gridCols = autoFit && minChildWidth
    ? `grid-cols-[repeat(auto-fit,minmax(${minChildWidth},1fr))]`
    : Object.entries(cols)
        .map(([bp, count]) => {
          if (bp === 'xs') return `grid-cols-${count}`
          return `${bp}:grid-cols-${count}`
        })
        .join(' ')

  return (
    <Container
      as={Component}
      className={cn(
        'grid',
        gridCols,
        gapClasses[gap],
        className
      )}
      fluid={fluid}
      maxWidth={maxWidth}
      noPadding={noPadding}
      centerContent={centerContent}
    >
      {children}
    </Container>
  )
}

// Enhanced flex container with mobile-first responsive properties
interface FlexContainerProps extends ContainerProps {
  direction?: {
    xs?: 'row' | 'col'
    sm?: 'row' | 'col'
    md?: 'row' | 'col'
    lg?: 'row' | 'col'
    xl?: 'row' | 'col'
  }
  reverse?: boolean
  wrap?: boolean | 'reverse'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function FlexContainer({
  children,
  className = '',
  as: Component = 'div',
  fluid = false,
  maxWidth = '2xl',
  noPadding = false,
  centerContent = true,
  direction = { xs: 'col', md: 'row' },
  reverse = false,
  wrap = false,
  justify = 'start',
  items = 'start',
  gap = 'md',
}: FlexContainerProps) {
  // Build mobile-first flex direction classes
  const flexDirection = Object.entries(direction)
    .map(([bp, dir]) => {
      const baseClass = dir === 'col' ? 'flex-col' : 'flex-row'
      if (bp === 'xs') return baseClass
      return `${bp}:${baseClass}`
    })
    .join(' ')

  return (
    <Container
      as={Component}
      className={cn(
        'flex',
        flexDirection,
        reverse && 'flex-row-reverse',
        wrap === true && 'flex-wrap',
        wrap === 'reverse' && 'flex-wrap-reverse',
        `justify-${justify}`,
        `items-${items}`,
        gapClasses[gap],
        className
      )}
      fluid={fluid}
      maxWidth={maxWidth}
      noPadding={noPadding}
      centerContent={centerContent}
    >
      {children}
    </Container>
  )
} 