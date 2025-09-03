import { createBucketClient } from '@cosmicjs/sdk'
import { Tile, TileSet } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch tile set by access code
export async function getTileSetByAccessCode(accessCode: string) {
  try {
    const response = await cosmic.objects.findOne({
      type: 'tile-sets',
      'metadata.access_code': accessCode
    }).depth(1);
    
    if (!response.object) {
      return null;
    }
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch tile set: ${error}`);
  }
}

// Get all tiles for a tile set
export async function getTilesForTileSet(tileSetId: string) {
  try {
    const response = await cosmic.objects.find({
      type: 'tiles',
      'metadata.tile_set': tileSetId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    const tiles = response.objects.sort((a: any, b: any) => {
      const orderA = a.metadata?.order || 0;
      const orderB = b.metadata?.order || 0;
      return orderA - orderB;
    });
    
    return tiles;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch tiles: ${error}`);
  }
}

// Create a new session
export async function createSession(data: {
  tileSetId: string;
  participantId: string;
  participantName?: string;
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'sessions',
      title: `Session-${data.participantId}`,
      metadata: {
        tile_set: data.tileSetId,
        participant_id: data.participantId,
        participant_name: data.participantName || '',
        started_date: new Date().toISOString(),
        is_complete: false
      }
    });
    
    return response.object;
  } catch (error) {
    throw new Error(`Failed to create session: ${error}`);
  }
}

// Record a swipe result
export async function recordSwipeResult(data: {
  sessionId: string;
  tileId: string;
  decision: 'Yes' | 'No';
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'swipe-results',
      title: `${data.sessionId}-${data.tileId}-swipe`,
      metadata: {
        session: data.sessionId,
        tile: data.tileId,
        decision: data.decision,
        timestamp: new Date().toISOString()
      }
    });
    
    return response.object;
  } catch (error) {
    throw new Error(`Failed to record swipe result: ${error}`);
  }
}

// Complete a session
export async function completeSession(sessionId: string) {
  try {
    const response = await cosmic.objects.updateOne(sessionId, {
      metadata: {
        completed_date: new Date().toISOString(),
        is_complete: true
      }
    });
    
    return response.object;
  } catch (error) {
    throw new Error(`Failed to complete session: ${error}`);
  }
}

// Get swipe results for a tile set
export async function getSwipeResultsForTileSet(tileSetId: string) {
  try {
    const response = await cosmic.objects.find({
      type: 'swipe-results',
      'metadata.session.metadata.tile_set': tileSetId
    }).depth(2);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch swipe results: ${error}`);
  }
}

// Check for matches and create match records
export async function checkForMatches(tileSetId: string) {
  try {
    // Get all completed sessions for this tile set
    const sessionsResponse = await cosmic.objects.find({
      type: 'sessions',
      'metadata.tile_set': tileSetId,
      'metadata.is_complete': true
    }).depth(1);
    
    const sessions = sessionsResponse.objects;
    
    if (sessions.length < 2) {
      return []; // Need at least 2 participants for a match
    }
    
    // Get all swipe results for these sessions
    const swipeResults = await getSwipeResultsForTileSet(tileSetId);
    
    // Group swipe results by tile
    const swipesByTile: Record<string, Array<{ decision: string; sessionId: string }>> = {};
    
    swipeResults.forEach((swipe: any) => {
      const tileId = swipe.metadata?.tile?.id || swipe.metadata?.tile;
      const sessionId = swipe.metadata?.session?.id || swipe.metadata?.session;
      
      if (!tileId || !sessionId) return;
      
      if (!swipesByTile[tileId]) {
        swipesByTile[tileId] = [];
      }
      
      swipesByTile[tileId].push({
        decision: swipe.metadata.decision,
        sessionId
      });
    });
    
    const matches = [];
    
    // Check each tile for unanimous "Yes" votes
    for (const [tileId, swipes] of Object.entries(swipesByTile)) {
      const participantSessions = new Set(swipes.map(s => s.sessionId));
      
      // Only consider tiles that all participants swiped on
      if (participantSessions.size === sessions.length) {
        const allYes = swipes.every((swipe: any) => swipe.decision === 'Yes');
        
        if (allYes) {
          // Check if match already exists
          const existingMatch = await cosmic.objects.findOne({
            type: 'matches',
            'metadata.tile_set': tileSetId,
            'metadata.tile': tileId
          });
          
          if (!existingMatch.object) {
            // Create new match
            const matchResponse = await cosmic.objects.insertOne({
              type: 'matches',
              title: `Match-${tileSetId}-${tileId}`,
              metadata: {
                tile_set: tileSetId,
                tile: tileId,
                match_date: new Date().toISOString(),
                participant_count: sessions.length,
                is_notified: false
              }
            });
            
            matches.push(matchResponse.object);
          }
        }
      }
    }
    
    return matches;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error(`Failed to check for matches: ${error}`);
  }
}

// Get matches for a tile set
export async function getMatchesForTileSet(tileSetId: string) {
  try {
    const response = await cosmic.objects.find({
      type: 'matches',
      'metadata.tile_set': tileSetId
    }).depth(2);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch matches: ${error}`);
  }
}

// Generate unique access code
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate unique participant ID
export function generateParticipantId(): string {
  return `participant_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}