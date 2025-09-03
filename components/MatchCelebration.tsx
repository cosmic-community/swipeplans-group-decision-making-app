'use client'

import { motion } from 'framer-motion'
import { X, Trophy, Sparkles } from 'lucide-react'

interface MatchCelebrationProps {
  matches: any[]
  onClose: () => void
}

export default function MatchCelebration({ matches, onClose }: MatchCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Trophy className="w-8 h-8 text-yellow-600" />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 It's a Match!
          </h2>
          <p className="text-gray-600 mb-6">
            Everyone in your group agreed on {matches.length} option{matches.length === 1 ? '' : 's'}!
          </p>

          <div className="flex items-center justify-center text-primary-600 mb-6">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="font-medium">Time to make it happen!</span>
            <Sparkles className="w-5 h-5 ml-2" />
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            View Matches
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}