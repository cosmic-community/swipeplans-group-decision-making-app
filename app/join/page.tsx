import JoinForm from '@/components/JoinForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Join Swipe Session - SwipePlans',
  description: 'Enter your access code to join a group decision session and start swiping on options.',
}

export default function JoinPage() {
  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Swipe Session
            </h1>
            <p className="text-gray-600">
              Enter the access code shared with you to start swiping on options.
            </p>
          </div>

          {/* Join Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <JoinForm />
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">
              Don't have an access code?
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Ask the person who created the tile set to share their access code with you. 
              It's usually something like "WEEKEND2024" or "DATENIGHT".
            </p>
            <Link 
              href="/create" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Or create your own tile set →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}