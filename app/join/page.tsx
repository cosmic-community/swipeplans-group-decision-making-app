import JoinForm from '@/components/JoinForm'
import { Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface JoinPageProps {
  searchParams: Promise<{ code?: string; error?: string }>;
}

export const metadata = {
  title: 'Join Tile Set - SwipePlans',
  description: 'Enter your access code to join a tile set and start swiping with your group.',
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const { code, error } = await searchParams;

  const getErrorMessage = (errorType?: string) => {
    switch (errorType) {
      case 'invalid_code':
        return 'Access code not found. Please check the code and try again.';
      case 'inactive':
        return 'This tile set is currently inactive.';
      case 'expired':
        return 'This tile set has expired.';
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-success-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join a Tile Set
            </h1>
            <p className="text-gray-600">
              Enter the access code shared by your group to start swiping together.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Join Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <JoinForm defaultCode={code} />
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Need Help?
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Access codes are typically 8 characters long and contain letters and numbers. 
              Ask the person who created the tile set to share the code with you.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}