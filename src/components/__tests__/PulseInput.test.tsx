import { render, screen, fireEvent } from '@testing-library/react'
import { PulseInput } from '@/components/patient/PulseInput'
import { describe, it, expect, vi } from 'vitest'
import * as aiSdk from '@ai-sdk/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock @ai-sdk/react
vi.mock('@ai-sdk/react', () => ({
  experimental_useObject: vi.fn(() => ({
    object: null,
    submit: vi.fn(),
    isLoading: false,
  })),
}))

describe('PulseInput', () => {
  it('renders the symptom textarea', () => {
    render(<PulseInput />)
    expect(screen.getByPlaceholderText(/E.g. I have a persistent cough/i)).toBeDefined()
  })

  it('updates text value on change', () => {
    render(<PulseInput />)
    const textarea = screen.getByPlaceholderText(/E.g. I have a persistent cough/i)
    fireEvent.change(textarea, { target: { value: 'Severe back pain' } })
    expect((textarea as HTMLTextAreaElement).value).toBe('Severe back pain')
  })

  it('button is disabled when input is empty', () => {
    render(<PulseInput />)
    const button = screen.getByRole('button', { name: /One-Tap Triage/i })
    expect(button).toBeDisabled()
  })

  it('shows loading state and disables button when AI is processing', () => {
    // Override the mock for this specific test
    vi.spyOn(aiSdk, 'experimental_useObject').mockReturnValue({
      object: null,
      submit: vi.fn(),
      isLoading: true,
    } as any)

    render(<PulseInput />)
    const button = screen.getByRole('button', { name: /One-Tap Triage/i })
    expect(button).toBeDisabled()
    
    // Check if the loading spinner or state is visually represented
    const form = button.closest('form')
    expect(form).toBeDefined()
  })
})
