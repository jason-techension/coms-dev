import LoginForm from '@/app/components/pages/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mock Login System',
  description: 'Login to your account with different user roles',
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account (Mock System)
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
