'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, PanInfo, AnimatePresence } from 'framer-motion'
import { TileSet, Tile, SwipeAction, ParticipantInfo } from '@/types'
import { createSession, recordSwipeResult, completeSession, checkForMatches } from '@/lib/cosmic'
import { X, Heart, ArrowLeft, Trophy } from 'lucide-react'
import Link from 'next/link'
import TileCard from './TileCard'
import SwipeButtons from './SwipeButtons'
import ProgressBar from './ProgressBar'
import MatchCelebration from './MatchCelebration'

interface SwipeInterfaceProps {
  tileSet: TileSet
  tiles: Tile[]
  participantId: string
  participantName?: string
  sessionId?: string
}

export default function SwipeInterface({
  tileSet,
  tiles,
  participantId,
  participantName,
  sessionId: initialSessionId,
}: SwipeInterfaceProps) {
  const [currentTileIndex, setCurrentTileIndex] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null)
  const [swipeResults, setSwipeResults] = useState<SwipeAction[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(!initialSessionId)
  const [matches, setMatches] = useState<any[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  // Initialize session
  useEffect(() => {
    if (!sessionId) {
      initializeSession()
    }
  }, [sessionId])

  const initializeSession = async () => {
    try {
      const session = await createSession({
        tileSetId: tileSet.id,
        participantId,
        participantName,
      })
      setSessionId(session.id)
    } catch (error) {
      console.error('Failed to create session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (!sessionId || currentTileIndex >= tiles.length) return

    const currentTile = tiles[currentTileIndex]
    if (!currentTile) return

    const decision = direction === 'right' ? 'Yes' : 'No'
    
    try {
      // Record the swipe result
      await recordSwipeResult({
        sessionId,
        tileId: currentTile.id,
        decision,
      })

      // Update local state
      setSwipeResults(prev => [...prev, { tileId: currentTile.id, direction }])

      // Move to next tile
      const nextIndex = currentTileIndex + 1
      setCurrentTileIndex(nextIndex)

      // Check if completed
      if (nextIndex >= tiles.length) {
        await handleCompletion()
      }
    } catch (error) {
      console.error('Failed to record swipe:', error)
    }
  }, [sessionId, currentTileIndex, tiles])

  const handleCompletion = async () => {
    if (!sessionId) return

    try {
      // Mark session as complete
      await completeSession(sessionId)
      
      // Check for matches
      const newMatches = await checkForMatches(tileSet.id)
      
      if (newMatches.length > 0) {
        setMatches(newMatches)
        setShowCelebration(true)
      }
      
      setIsComplete(true)
    } catch (error) {
      console.error('Failed to complete session:', error)
      setIsComplete(true) // Still mark as complete even if match check fails
    }
  }

  const handleManualSwipe = (direction: 'left' | 'right') => {
    handleSwipe(direction)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100
    
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left'
      handleSwipe(direction)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your session...</p>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Session Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            You've swiped through all {tiles.length} options. 
            {matches.length > 0 ? 
              ` Great news - you have ${matches.length} match${matches.length === 1 ? '' : 'es'}!` :
              ' Matches will appear when everyone in your group finishes swiping.'
            }
          </p>
          
          <div className="flex flex-col gap-3">
            {matches.length > 0 && (
              <Link 
                href={`/matches/${tileSet.metadata.access_code}`}
                className="btn-primary"
              >
                View Matches
              </Link>
            )}
            <Link 
              href="/"
              className="btn-secondary"
            >
              Back to Home
            </Link>
          </div>
        </div>
        
        {/* Match Celebration */}
        <AnimatePresence>
          {showCelebration && matches.length > 0 && (
            <MatchCelebration 
              matches={matches}
              onClose={() => setShowCelebration(false)}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  const currentTile = tiles[currentTileIndex]
  if (!currentTile) return null

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Exit
          </Link>
          
          <div className="text-center">
            <h1 className="font-medium text-gray-900">{tileSet.metadata.title}</h1>
            <p className="text-sm text-gray-500">
              {currentTileIndex + 1} of {tiles.length}
            </p>
          </div>
          
          <Link 
            href={`/matches/${tileSet.metadata.access_code}`}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Trophy className="w-5 h-5" />
          </Link>
        </div>
        
        <ProgressBar 
          current={currentTileIndex + 1} 
          total={tiles.length} 
        />
      </div>

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-sm mx-auto relative" style={{ height: '600px' }}>
          <AnimatePresence>
            <motion.div
              key={currentTile.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={{ x: 0, rotate: 0, scale: 1 }}
              exit={{ 
                x: swipeResults[swipeResults.length - 1]?.direction === 'right' ? 300 : -300,
                rotate: swipeResults[swipeResults.length - 1]?.direction === 'right' ? 25 : -25,
                opacity: 0,
                transition: { duration: 0.3 }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <TileCard tile={currentTile} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        <SwipeButtons 
          onPass={() => handleManualSwipe('left')}
          onLike={() => handleManualSwipe('right')}
        />
      </div>
    </div>
  )
}