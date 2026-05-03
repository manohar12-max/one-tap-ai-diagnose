import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationCenter } from '@/components/NotificationCenter'
import { describe, it, expect, vi } from 'vitest'

describe('NotificationCenter', () => {
  const mockUser = { id: '123', name: 'Test User' }

  it('renders the notification bell button', () => {
    render(<NotificationCenter user={mockUser} />)
    const bellButton = screen.getByRole('button')
    expect(bellButton).toBeDefined()
  })

  it('opens the notification panel when clicked', async () => {
    render(<NotificationCenter user={mockUser} />)
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    const title = await screen.findByText(/Clinical Notifications/i)
    expect(title).toBeDefined()
  })
})
