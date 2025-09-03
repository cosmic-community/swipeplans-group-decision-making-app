// app/matches/[code]/page.tsx
import { getTileSetByAccessCode, getMatchesForTileSet } from '@/lib/cosmic'
import MatchesList from '@/components/MatchesList'
import { redirect } from 'next/navigation'
import { TileSet, Match } from '@/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface MatchesPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  const tileSet = await getTileSetByAccessCode(code);
  
  if (!tileSet) {
    return {
      title: 'Matches Not Found - SwipePlans',
      description: 'The access code you entered was not found.',
    };
  }

  const typedTileSet = tileSet as TileSet;
  
  return {
    title: `${typedTileSet.metadata.title} Matches - SwipePlans`,
    description: `View all the matches for: ${typedTileSet.metadata.description || typedTileSet.metadata.title}`,
  };
}

export default async function MatchesPage({ params }: MatchesPageProps) {
  // Await the params promise
  const { code } = await params;
  
  // Fetch tile set by access code
  const tileSet = await getTileSetByAccessCode(code);
  
  if (!tileSet) {
    redirect('/join?error=invalid_code');
  }

  const typedTileSet = tileSet as TileSet;

  // Fetch matches for this tile set
  const matches = await getMatchesForTileSet(typedTileSet.id);
  const typedMatches = matches as Match[];

  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href={`/swipe/${code}`} 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Swiping
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {typedTileSet.metadata.title} Matches
            </h1>
            <p className="text-gray-600">
              Here are all the options everyone in your group agreed on!
            </p>
          </div>

          {/* Matches List */}
          <MatchesList matches={typedMatches} />
          
          {/* Share Section */}
          {typedMatches.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Share Your Matches
              </h2>
              <p className="text-gray-600 mb-4">
                Let your group know about these unanimous decisions!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    // Could add toast notification here
                  }}
                  className="btn-secondary flex-1"
                >
                  Copy Link
                </button>
                <button 
                  onClick={() => {
                    const text = `Check out our group matches on SwipePlans! ${window.location.href}`;
                    if (navigator.share) {
                      navigator.share({ text, url: window.location.href });
                    }
                  }}
                  className="btn-primary flex-1"
                >
                  Share Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}