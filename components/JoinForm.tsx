'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateParticipantId } from '@/lib/cosmic'

export default function JoinForm() {
  const router = useRouter()
  const [accessCode, setAccessCode] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accessCode.trim()) {
      setError('Please enter an access code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Generate unique participant ID
      const participantId = generateParticipantId()
      
      // Create URL with participant info
      const params = new URLSearchParams({
        participant: participantId,
      })
      
      if (participantName.trim()) {
        params.set('name', participantName.trim())
      }
      
      // Navigate to swipe page
      router.push(`/swipe/${accessCode.toUpperCase()}?${params.toString()}`)
      
    } catch (err) {
      setError('Failed to join session. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
          Access Code *
        </label>
        <input
          type="text"
          id="accessCode"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          placeholder="e.g., WEEKEND2024"
          className="input-field uppercase tracking-wider"
          maxLength={20}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter the code shared with you by the tile set creator
        </p>
      </div>

      <div>
        <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="participantName"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          placeholder="e.g., Sarah"
          className="input-field"
          maxLength={50}
        />
        <p className="text-sm text-gray-500 mt-1">
          This helps identify you in the session (optional)
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Joining...' : 'Start Swiping'}
      </button>
    </form>
  )
}