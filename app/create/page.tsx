import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Create Tile Set - SwipePlans',
  description: 'Create a new tile set with custom options for your group to swipe on.',
}

export default function CreatePage() {
  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
              Create New Tile Set
            </h1>
            <p className="text-gray-600">
              Build a collection of options for your group to swipe on. Perfect for date nights, 
              weekend activities, movie choices, and more.
            </p>
          </div>

          {/* Create Form Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Coming Soon!
              </h2>
              <p className="text-gray-600 mb-6">
                The tile set creation interface is currently being built. 
                For now, you can create tile sets directly in your Cosmic CMS dashboard.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h3 className="font-medium text-blue-900 mb-2">
                  Create Tile Sets in Cosmic CMS:
                </h3>
                <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Log into your Cosmic dashboard</li>
                  <li>Create a new "Tile Set" object</li>
                  <li>Add a title, description, and unique access code</li>
                  <li>Set it as active and choose a category</li>
                  <li>Create individual "Tile" objects linked to your set</li>
                  <li>Share the access code with your group!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Example Tile Sets */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Try These Example Tile Sets
            </h2>
            <div className="grid gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Weekend Activities</h3>
                    <p className="text-sm text-gray-600">Fun activities to do together this weekend</p>
                  </div>
                  <div className="text-right">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      WEEKEND2024
                    </code>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Date Night Ideas</h3>
                    <p className="text-sm text-gray-600">Romantic activities for your next date night</p>
                  </div>
                  <div className="text-right">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      DATENIGHT
                    </code>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Use these access codes to try out the swiping experience!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}