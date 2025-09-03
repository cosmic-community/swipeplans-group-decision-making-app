'use client'

import { useState, useRef } from 'react'
import { createBucketClient } from '@cosmicjs/sdk'
import { generateAccessCode } from '@/lib/cosmic'
import { TileSetCategory, TileTag } from '@/types'
import { Upload, X, Plus, Share2, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const cosmic = createBucketClient({
  bucketSlug: process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

interface TileFormData {
  title: string
  description: string
  external_link: string
  tags: TileTag[]
  image?: File
  order: number
}

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Tile Set Form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TileSetCategory>('Activities')
  const [expiresDate, setExpiresDate] = useState('')
  
  // Tiles Form
  const [tiles, setTiles] = useState<TileFormData[]>([
    {
      title: '',
      description: '',
      external_link: '',
      tags: [],
      order: 1
    }
  ])
  
  // Results
  const [createdTileSet, setCreatedTileSet] = useState<any>(null)
  const [accessCode, setAccessCode] = useState('')
  
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const availableTags: TileTag[] = ['Indoor', 'Outdoor', 'Free', 'Paid', 'Quick', 'All Day', 'Popular', 'New']
  const categories: TileSetCategory[] = ['Movies', 'Activities', 'Restaurants', 'Date Night', 'Travel', 'Books', 'Other']

  const addTile = () => {
    setTiles([...tiles, {
      title: '',
      description: '',
      external_link: '',
      tags: [],
      order: tiles.length + 1
    }])
  }

  const removeTile = (index: number) => {
    if (tiles.length > 1) {
      const newTiles = tiles.filter((_, i) => i !== index)
      // Reorder remaining tiles
      newTiles.forEach((tile, i) => {
        tile.order = i + 1
      })
      setTiles(newTiles)
    }
  }

  const updateTile = (index: number, field: keyof TileFormData, value: any) => {
    const newTiles = [...tiles]
    const tile = newTiles[index]
    if (tile) {
      if (field === 'tags') {
        tile[field] = value as TileTag[]
      } else if (field === 'image') {
        tile[field] = value as File
      } else if (field === 'order') {
        tile[field] = value as number
      } else {
        (tile[field] as string) = value as string
      }
      setTiles(newTiles)
    }
  }

  const toggleTag = (tileIndex: number, tag: TileTag) => {
    const tile = tiles[tileIndex]
    if (!tile) return
    
    const currentTags = tile.tags || []
    const hasTag = currentTags.includes(tag)
    
    if (hasTag) {
      updateTile(tileIndex, 'tags', currentTags.filter(t => t !== tag))
    } else {
      updateTile(tileIndex, 'tags', [...currentTags, tag])
    }
  }

  const handleImageUpload = (tileIndex: number, file: File) => {
    updateTile(tileIndex, 'image', file)
  }

  const uploadImageToCosmic = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('media', file)
    formData.append('folder', 'swipeplans')
    
    const response = await fetch(`https://upload.cosmicjs.com/v2/buckets/${process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COSMIC_WRITE_KEY}`,
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const data = await response.json()
    return data.media.name
  }

  const handleSubmit = async () => {
    if (step === 1) {
      if (!title.trim()) {
        alert('Please enter a title for your tile set')
        return
      }
      setStep(2)
      return
    }

    // Validate tiles
    const validTiles = tiles.filter(tile => tile?.title?.trim())
    if (validTiles.length === 0) {
      alert('Please add at least one tile with a title')
      return
    }

    setIsSubmitting(true)

    try {
      // Generate access code
      const code = generateAccessCode()
      
      // Create tile set
      const tileSetResponse = await cosmic.objects.insertOne({
        type: 'tile-sets',
        title,
        metadata: {
          title,
          description,
          creator_id: `creator_${Date.now()}`,
          access_code: code,
          category: {
            key: category.toLowerCase().replace(' ', '_'),
            value: category
          },
          created_date: new Date().toISOString().split('T')[0],
          expires_date: expiresDate || undefined,
          is_active: true
        }
      })

      // Create tiles
      for (let i = 0; i < validTiles.length; i++) {
        const tile = validTiles[i]
        if (!tile) continue
        
        let imageName = undefined
        if (tile.image) {
          try {
            imageName = await uploadImageToCosmic(tile.image)
          } catch (error) {
            console.error('Failed to upload image for tile:', tile.title, error)
          }
        }

        await cosmic.objects.insertOne({
          type: 'tiles',
          title: tile.title,
          metadata: {
            title: tile.title,
            description: tile.description,
            external_link: tile.external_link || undefined,
            tags: tile.tags,
            tile_set: tileSetResponse.object.id,
            order: tile.order,
            ...(imageName && { image: imageName })
          }
        })
      }

      setCreatedTileSet(tileSetResponse.object)
      setAccessCode(code)
      setStep(3)

    } catch (error) {
      console.error('Error creating tile set:', error)
      alert('Failed to create tile set. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const shareLink = `${window.location.origin}/join?code=${accessCode}`

  if (step === 3) {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-success-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tile Set Created! 🎉
              </h1>
              <p className="text-gray-600">
                Your tile set "{title}" is ready to share with your group.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Share Your Access Code</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Access Code</p>
                    <p className="text-2xl font-bold text-primary-600 font-mono tracking-wider">
                      {accessCode}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(accessCode)}
                    className="btn-secondary text-sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <p className="text-sm text-gray-600 mb-1">Share Link</p>
                    <p className="text-sm text-gray-800 break-all">
                      {shareLink}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(shareLink)}
                    className="btn-secondary text-sm whitespace-nowrap"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href={`/swipe/${accessCode}?participant=${encodeURIComponent('creator_preview')}&name=Creator`}
                  className="btn-primary flex-1 text-center"
                >
                  Preview Your Tiles
                </Link>
                <Link 
                  href={`/matches/${accessCode}`}
                  className="btn-secondary flex-1 text-center"
                >
                  View Matches
                </Link>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-bold text-primary-800 mb-2">Next Steps:</h3>
              <ul className="text-primary-700 text-sm space-y-1">
                <li>• Share the access code or link with your group</li>
                <li>• Each person will swipe through your options</li>
                <li>• Only unanimous matches will be revealed</li>
                <li>• Check back later to see what everyone agreed on!</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (step === 2) {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Add Your Options
              </h1>
              <p className="text-gray-600">
                Create tiles for each option you want your group to consider.
              </p>
            </div>

            <div className="space-y-6">
              {tiles.map((tile, index) => {
                // Add null check for tile
                if (!tile) return null
                
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Tile {index + 1}
                      </h3>
                      {tiles.length > 1 && (
                        <button
                          onClick={() => removeTile(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={tile.title || ''}
                          onChange={(e) => updateTile(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., Try the new Italian restaurant"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={tile.description || ''}
                          onChange={(e) => updateTile(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Add details about this option..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          External Link
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={tile.external_link || ''}
                            onChange={(e) => updateTile(index, 'external_link', e.target.value)}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="https://..."
                          />
                          <ExternalLink className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            ref={el => fileInputRefs.current[index] = el}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(index, file)
                            }}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="btn-secondary"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {tile.image ? 'Change Image' : 'Upload Image'}
                          </button>
                          {tile.image && (
                            <span className="text-sm text-gray-600">
                              {tile.image.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => {
                            const isSelected = tile.tags?.includes(tag) || false
                            return (
                              <button
                                key={tag}
                                onClick={() => toggleTag(index, tag)}
                                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                  isSelected
                                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                {tag}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={addTile}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Tile
              </button>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Creating...' : 'Create Tile Set'}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Tile Set
            </h1>
            <p className="text-gray-600">
              Set up your group decision-making session by creating a collection of options for everyone to swipe through.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Weekend Date Night Ideas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell your group what this is about..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TileSetCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expires Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiresDate}
                  onChange={(e) => setExpiresDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty if you don't want an expiration date
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Next: Add Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}