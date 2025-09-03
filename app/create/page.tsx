'use client'

import { useState } from 'react'
import { generateAccessCode, cosmic } from '@/lib/cosmic'
import { Plus, Sparkles, X, Upload, Link as LinkIcon, Tag, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { TileSetCategory, TileTag, CreateTileSetFormData, CreateTileFormData } from '@/types'

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<'tileSet' | 'tiles' | 'preview'>('tileSet')
  const [tileSet, setTileSet] = useState<CreateTileSetFormData & { accessCode: string }>({
    title: '',
    description: '',
    category: 'Activities',
    expiresDate: '',
    accessCode: generateAccessCode()
  })
  const [tiles, setTiles] = useState<(CreateTileFormData & { tempId: string })[]>([])
  const [currentTile, setCurrentTile] = useState<CreateTileFormData>({
    title: '',
    description: '',
    externalLink: '',
    tags: [],
    order: 0
  })
  const [isCreating, setIsCreating] = useState(false)
  const [showTileForm, setShowTileForm] = useState(false)
  const [editingTileId, setEditingTileId] = useState<string | null>(null)

  const categories: TileSetCategory[] = ['Movies', 'Activities', 'Restaurants', 'Date Night', 'Travel', 'Books', 'Other']
  const availableTags: TileTag[] = ['Indoor', 'Outdoor', 'Free', 'Paid', 'Quick', 'All Day', 'Popular', 'New']

  const handleTileSetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tileSet.title.trim()) {
      setCurrentStep('tiles')
    }
  }

  const handleAddTile = () => {
    setCurrentTile({
      title: '',
      description: '',
      externalLink: '',
      tags: [],
      order: tiles.length
    })
    setEditingTileId(null)
    setShowTileForm(true)
  }

  const handleEditTile = (tile: CreateTileFormData & { tempId: string }) => {
    setCurrentTile({ ...tile })
    setEditingTileId(tile.tempId)
    setShowTileForm(true)
  }

  const handleSaveTile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentTile.title.trim()) return

    const tileWithId = {
      ...currentTile,
      tempId: editingTileId || `tile_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    }

    if (editingTileId) {
      setTiles(prev => prev.map(t => t.tempId === editingTileId ? tileWithId : t))
    } else {
      setTiles(prev => [...prev, tileWithId])
    }

    setShowTileForm(false)
    setCurrentTile({
      title: '',
      description: '',
      externalLink: '',
      tags: [],
      order: tiles.length
    })
  }

  const handleDeleteTile = (tempId: string) => {
    setTiles(prev => prev.filter(t => t.tempId !== tempId))
  }

  const toggleTileTag = (tag: TileTag) => {
    setCurrentTile(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }))
  }

  const handleCreateTileSet = async () => {
    setIsCreating(true)
    try {
      // Create the tile set
      const tileSetResponse = await cosmic.objects.insertOne({
        type: 'tile-sets',
        title: tileSet.title,
        status: 'published',
        metadata: {
          title: tileSet.title,
          description: tileSet.description || '',
          creator_id: `creator_${Date.now()}`,
          access_code: tileSet.accessCode,
          category: {
            key: tileSet.category.toLowerCase().replace(' ', '_'),
            value: tileSet.category
          },
          created_date: new Date().toISOString().split('T')[0],
          expires_date: tileSet.expiresDate || undefined,
          is_active: true
        }
      })

      // Create each tile
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i]
        await cosmic.objects.insertOne({
          type: 'tiles',
          title: tile.title,
          status: 'published',
          metadata: {
            title: tile.title,
            description: tile.description || '',
            external_link: tile.externalLink || '',
            tags: tile.tags || [],
            tile_set: tileSetResponse.object.id,
            order: i + 1
          }
        })
      }

      // Redirect to the created tile set
      window.location.href = `/swipe/${tileSet.accessCode}?created=true`
    } catch (error) {
      console.error('Failed to create tile set:', error)
      alert('Failed to create tile set. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (currentStep === 'tileSet') {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Tile Set
              </h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Start by setting up the basic information for your tile set.
              </p>
            </div>

            {/* Tile Set Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleTileSetSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={tileSet.title}
                    onChange={(e) => setTileSet(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Weekend Activities, Date Night Ideas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={tileSet.description}
                    onChange={(e) => setTileSet(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what this tile set is for..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={tileSet.category}
                    onChange={(e) => setTileSet(prev => ({ ...prev, category: e.target.value as TileSetCategory }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="expiresDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Expires Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="expiresDate"
                    value={tileSet.expiresDate}
                    onChange={(e) => setTileSet(prev => ({ ...prev, expiresDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave blank for no expiration
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Access Code:</strong> {tileSet.accessCode}
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    Share this code with your group to let them join
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link href="/" className="btn-secondary flex-1">
                    Cancel
                  </Link>
                  <button type="submit" className="btn-primary flex-1">
                    Next: Add Tiles
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (currentStep === 'tiles') {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Add Tiles to "{tileSet.title}"
              </h1>
              <p className="text-gray-600">
                Create options for your group to swipe through. Add at least 2 tiles to continue.
              </p>
            </div>

            {/* Tiles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {tiles.map((tile) => (
                <div key={tile.tempId} className="bg-white rounded-lg border border-gray-200 p-4 relative group">
                  <button
                    onClick={() => handleDeleteTile(tile.tempId)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  <h3 className="font-medium text-gray-900 mb-2 pr-8">{tile.title}</h3>
                  {tile.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tile.description}</p>
                  )}
                  
                  {tile.tags && tile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tile.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {tile.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{tile.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleEditTile(tile)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              ))}

              {/* Add Tile Button */}
              <button
                onClick={handleAddTile}
                className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 p-8 flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 transition-colors group"
              >
                <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Add Tile</span>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep('tileSet')}
                className="btn-secondary"
              >
                ← Back to Details
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('preview')}
                  disabled={tiles.length < 2}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={handleCreateTileSet}
                  disabled={tiles.length < 2 || isCreating}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Tile Set
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tile Form Modal */}
        {showTileForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingTileId ? 'Edit Tile' : 'Add New Tile'}
                  </h2>
                  <button
                    onClick={() => setShowTileForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveTile} className="p-6 space-y-4">
                <div>
                  <label htmlFor="tileTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="tileTitle"
                    value={currentTile.title}
                    onChange={(e) => setCurrentTile(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Try New Italian Restaurant"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tileDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="tileDescription"
                    value={currentTile.description}
                    onChange={(e) => setCurrentTile(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this option..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="tileLink" className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    External Link
                  </label>
                  <input
                    type="url"
                    id="tileLink"
                    value={currentTile.externalLink}
                    onChange={(e) => setCurrentTile(prev => ({ ...prev, externalLink: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTileTag(tag)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          currentTile.tags?.includes(tag)
                            ? 'bg-primary-100 border-primary-300 text-primary-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTileForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingTileId ? 'Update Tile' : 'Add Tile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    )
  }

  // Preview step
  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Preview Your Tile Set
            </h1>
            <p className="text-gray-600">
              Review your tile set before creating it and sharing with your group.
            </p>
          </div>

          {/* Tile Set Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">{tileSet.title}</h2>
              {tileSet.description && (
                <p className="text-gray-600 mt-1">{tileSet.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>Category: {tileSet.category}</span>
                <span>Access Code: {tileSet.accessCode}</span>
                <span>{tiles.length} Tiles</span>
              </div>
            </div>

            <div className="space-y-3">
              {tiles.map((tile, index) => (
                <div key={tile.tempId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{tile.title}</h3>
                      {tile.description && (
                        <p className="text-gray-600 text-sm mt-1">{tile.description}</p>
                      )}
                      {tile.externalLink && (
                        <p className="text-primary-600 text-sm mt-1 truncate">{tile.externalLink}</p>
                      )}
                      {tile.tags && tile.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tile.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep('tiles')}
              className="btn-secondary flex-1"
            >
              ← Edit Tiles
            </button>
            <button
              onClick={handleCreateTileSet}
              disabled={isCreating}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>Creating Tile Set...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create & Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}