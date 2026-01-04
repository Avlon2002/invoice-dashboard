'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const signIn = async () => {
    if (!email) {
      setError('Please enter an email address')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for the login link!')
        setEmail('')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 border border-gray-200 rounded-lg w-96 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Invoice Login</h1>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full p-2 border border-gray-300 rounded mb-4 disabled:bg-gray-100"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <button
          onClick={signIn}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </div>
    </main>
  )
}

