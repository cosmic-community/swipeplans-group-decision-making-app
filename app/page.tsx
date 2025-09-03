import Link from 'next/link'
import { Sparkles, Users, Heart, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Group Decisions,
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Made Easy
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
              No more endless group chats or hurt feelings. Create custom options, 
              share access codes, and let everyone swipe. Only unanimous matches are revealed!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Join with Code
              </Link>
              <Link href="/create" className="btn-secondary bg-primary-400/20 text-white hover:bg-primary-400/30 border-primary-300">
                Create Tile Set
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SwipePlans Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fun, and drama-free group decision making in three easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                1. Create Options
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Build custom tile sets with movies, restaurants, activities, or anything you want to decide on as a group.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-6">
                <Users className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                2. Share & Swipe
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share your unique access code with friends, family, or partners. Everyone swipes privately on the options.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                <Heart className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                3. Celebrate Matches
              </h3>
              <p className="text-gray-600 leading-relaxed">
                When everyone swipes right on the same option, it's a match! No hurt feelings, just unanimous fun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Perfect for Any Group Decision
              </h2>
              <p className="text-xl text-gray-600">
                From date nights to family activities, SwipePlans makes group planning effortless
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Anonymous & Private</h3>
                </div>
                <p className="text-gray-600">
                  No one knows what you swiped on. Only mutual matches are revealed, protecting everyone's preferences.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-6 h-6 text-success-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Rich Content</h3>
                </div>
                <p className="text-gray-600">
                  Add images, descriptions, external links, and tags to make your options compelling and informative.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-yellow-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Easy Sharing</h3>
                </div>
                <p className="text-gray-600">
                  Simple access codes make it easy to invite anyone to participate. No accounts or apps to download.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">No Drama</h3>
                </div>
                <p className="text-gray-600">
                  Eliminate awkward conversations and hurt feelings. Only see what everyone agrees on.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Make Better Group Decisions?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of groups making drama-free decisions with SwipePlans
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Get Started Now
              </Link>
              <Link href="/create" className="btn-secondary bg-primary-400/20 text-white hover:bg-primary-400/30 border-primary-300">
                Create Your First Set
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}