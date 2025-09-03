'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getTileSetByAccessCode } from '@/lib/cosmic'
import { generateParticipantId } from '@/lib/cosmic'
import { Users, AlertCircle, Loader } from 'lucide-react'
import { TileSet } from '@/types'

export default function JoinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [accessCode, setAccessCode] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tileSet, setTileSet] = useState<TileSet | null>(null)

  // Get code from URL params if present
  useEffect(() => {
    const codeParam = searchParams.get('code')
    const errorParam = searchParams.get('error')
    
    if (codeParam) {
      setAccessCode(codeParam.toUpperCase())
    }
    
    if (errorParam) {
      switch (errorParam) {
        case 'invalid_code':
          setError('Invalid access code. Please check and try again.')
          break
        case 'inactive':
          setError('This tile set is no longer active.')
          break
        case 'expired':
          setError('This tile set has expired.')
          break
        default:
          setError('An error occurred. Please try again.')
      }
    }
  }, [searchParams])

  // Validate access code when it changes
  useEffect(() => {
    if (accessCode && accessCode.length >= 6) {
      validateAccessCode(accessCode)
    } else {
      setTileSet(null)
      setError('')
    }
  }, [accessCode])

  const validateAccessCode = async (code: string) => {
    try {
      setIsLoading(true)
      setError('')
      
      const foundTileSet = await getTileSetByAccessCode(code)
      
      if (!foundTileSet) {
        setError('Access code not found. Please check and try again.')
        setTileSet(null)
        return
      }

      const typedTileSet = foundTileSet as TileSet

      // Check if tile set is active
      if (!typedTileSet.metadata.is_active) {
        setError('This tile set is no longer active.')
        setTileSet(null)
        return
      }

      // Check if tile set has expired
      if (typedTileSet.metadata.expires_date) {
        const expiryDate = new Date(typedTileSet.metadata.expires_date)
        if (expiryDate < new Date()) {
          setError('This tile set has expired.')
          setTileSet(null)
          return
        }
      }

      setTileSet(typedTileSet)
      setError('')
    } catch (err) {
      console.error('Error validating access code:', err)
      setError('Failed to validate access code. Please try again.')
      setTileSet(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accessCode.trim()) {
      setError('Please enter an access code')
      return
    }

    if (!tileSet) {
      setError('Please wait for access code validation')
      return
    }

    try {
      setIsLoading(true)
      
      // Generate participant ID
      const participantId = generateParticipantId()
      
      // Navigate to swipe page
      const params = new URLSearchParams({
        participant: participantId,
        ...(participantName.trim() && { name: participantName.trim() })
      })
      
      router.push(`/swipe/${accessCode}?${params.toString()}`)
      
    } catch (err) {
      console.error('Error joining session:', err)
      setError('Failed to join session. Please try again.')
      setIsLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
    setAccessCode(value)
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join a Session
            </h1>
            <p className="text-gray-600">
              Enter the access code to join your group's decision-making session.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Code *
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={handleCodeChange}
                  className="w-full px-3 py-2 text-center text-lg font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
                  placeholder="ABCD1234"
                  maxLength={8}
                />
                <p className="text-sm text-gray-500 mt-1">
                  8-character code shared by the session creator
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Helps identify your participation (optional)
                </p>
              </div>

              {/* Tile Set Preview */}
              {tileSet && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                    <h3 className="font-medium text-success-800">Valid Access Code</h3>
                  </div>
                  <p className="text-success-700 font-medium">{tileSet.metadata.title}</p>
                  {tileSet.metadata.description && (
                    <p className="text-success-600 text-sm mt-1">{tileSet.metadata.description}</p>
                  )}
                  <p className="text-success-600 text-sm mt-2">
                    Category: {tileSet.metadata.category.value}
                  </p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !accessCode.trim() || !tileSet}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Session'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an access code?{' '}
              <a href="/create" className="text-primary-600 hover:text-primary-700 font-medium">
                Create your own session
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}