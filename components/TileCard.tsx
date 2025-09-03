import { Tile } from '@/types'
import { ExternalLink, Tag } from 'lucide-react'

interface TileCardProps {
  tile: Tile
}

export default function TileCard({ tile }: TileCardProps) {
  return (
    <div className="swipe-card w-full h-full flex flex-col">
      {/* Image */}
      {tile.metadata.image && (
        <div className="h-64 bg-gray-200 overflow-hidden">
          <img
            src={`${tile.metadata.image.imgix_url}?w=800&h=512&fit=crop&auto=format,compress`}
            alt={tile.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {tile.metadata.title}
          </h2>
          
          {tile.metadata.description && (
            <div 
              className="text-gray-600 text-sm leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: tile.metadata.description }}
            />
          )}
          
          {/* Tags */}
          {tile.metadata.tags && tile.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tile.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* External Link */}
        {tile.metadata.external_link && (
          <div className="pt-4 border-t border-gray-100">
            <a
              href={tile.metadata.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              onClick={(e) => e.stopPropagation()} // Prevent drag interference
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More
            </a>
          </div>
        )}
      </div>
    </div>
  )
}