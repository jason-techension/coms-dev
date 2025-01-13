'use server'

import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type UserRole = 'admin' | 'manager' | 'user'

interface MockUser {
  email: string
  role: UserRole
}

const mockUsers: MockUser[] = [
  { email: 'admin@example.com', role: 'admin' },
  { email: 'manager@example.com', role: 'manager' },
  { email: 'user@example.com', role: 'user' },
]

export async function handleLogin(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid email or password' }
  }

  const { email, password } = validatedFields.data

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock authentication logic
  const user = mockUsers.find(u => u.email === email)
  if (user && password === 'password') { // In a real app, you'd use proper password hashing
    return { success: true, message: `Logged in as ${user.role}`, role: user.role }
  }

  return { success: false, message: 'Invalid email or password' }
}

