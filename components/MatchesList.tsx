import { Match } from '@/types'
import { Trophy, Users, Calendar, ExternalLink } from 'lucide-react'

interface MatchesListProps {
  matches: Match[]
}

export default function MatchesList({ matches }: MatchesListProps) {
  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          No Matches Yet
        </h2>
        <p className="text-gray-600 mb-4">
          Matches appear when everyone in your group swipes right on the same option. 
          Keep swiping or wait for others to finish!
        </p>
        <p className="text-sm text-gray-500">
          Only unanimous decisions become matches - no hurt feelings! 😊
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <Trophy className="w-5 h-5 text-success-600 mr-2" />
          <h2 className="font-bold text-success-800">
            🎉 {matches.length} Match{matches.length === 1 ? '' : 'es'} Found!
          </h2>
        </div>
        <p className="text-success-700 text-sm">
          Everyone in your group agreed on these options. Time to make it happen!
        </p>
      </div>

      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Match Tile Image */}
          {match.metadata.tile?.metadata?.image && (
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={`${match.metadata.tile.metadata.image.imgix_url}?w=600&h=384&fit=crop&auto=format,compress`}
                alt={match.metadata.tile.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {match.metadata.tile?.metadata?.title || match.metadata.tile?.title}
                </h3>
                
                {match.metadata.tile?.metadata?.description && (
                  <div 
                    className="text-gray-600 text-sm leading-relaxed mb-3"
                    dangerouslySetInnerHTML={{ 
                      __html: match.metadata.tile.metadata.description 
                    }}
                  />
                )}
              </div>
            </div>

            {/* Match Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {match.metadata.participant_count} participant{match.metadata.participant_count === 1 ? '' : 's'}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(match.metadata.match_date).toLocaleDateString()}
              </div>
            </div>

            {/* Tags */}
            {match.metadata.tile?.metadata?.tags && match.metadata.tile.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {match.metadata.tile.metadata.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* External Link */}
            {match.metadata.tile?.metadata?.external_link && (
              <a
                href={match.metadata.tile.metadata.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn More
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}