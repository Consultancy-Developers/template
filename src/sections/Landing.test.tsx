import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Landing from './Landing'

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    to: vi.fn(),
  },
  gsap: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    to: vi.fn(),
  },
}))

describe('Landing', () => {
  it('renders the firm name as heading', () => {
    render(<Landing />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Landing />)
    expect(screen.getByText(/Where Strategy Meets Excellence/i)).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    render(<Landing />)
    expect(screen.getByRole('button', { name: /explore our work/i })).toBeInTheDocument()
  })

  it('has the correct section id', () => {
    const { container } = render(<Landing />)
    expect(container.querySelector('#landing')).toBeInTheDocument()
  })
})
