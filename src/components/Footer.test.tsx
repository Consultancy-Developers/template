import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders OmniDen logo text', () => {
    render(<Footer />)
    expect(screen.getAllByText('OmniDen').length).toBeGreaterThan(0)
  })

  it('renders copyright notice', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
