// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Tile Set - Main containers with access codes
interface TileSet extends CosmicObject {
  type: 'tile-sets';
  metadata: {
    title: string;
    description?: string;
    creator_id: string;
    access_code: string;
    category: {
      key: string;
      value: TileSetCategory;
    };
    created_date: string;
    expires_date?: string;
    is_active: boolean;
  };
}

// Individual swipeable tiles
interface Tile extends CosmicObject {
  type: 'tiles';
  metadata: {
    title: string;
    description?: string;
    image?: {
      url: string;
      imgix_url: string;
    };
    external_link?: string;
    tags?: TileTag[];
    tile_set: TileSet;
    order?: number;
  };
}

// User participation sessions
interface Session extends CosmicObject {
  type: 'sessions';
  metadata: {
    tile_set: TileSet;
    participant_id: string;
    participant_name?: string;
    started_date: string;
    completed_date?: string;
    is_complete: boolean;
  };
}

// Individual swipe decisions
interface SwipeResult extends CosmicObject {
  type: 'swipe-results';
  metadata: {
    session: Session;
    tile: Tile;
    decision: SwipeDecision;
    timestamp: string;
  };
}

// Successful matches when everyone agrees
interface Match extends CosmicObject {
  type: 'matches';
  metadata: {
    tile_set: TileSet;
    tile: Tile;
    match_date: string;
    participant_count: number;
    is_notified: boolean;
  };
}

// Type literals for select-dropdown values
type TileSetCategory = 'Movies' | 'Activities' | 'Restaurants' | 'Date Night' | 'Travel' | 'Books' | 'Other';
type SwipeDecision = 'Yes' | 'No';
type TileTag = 'Indoor' | 'Outdoor' | 'Free' | 'Paid' | 'Quick' | 'All Day' | 'Popular' | 'New';

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Client-side types
interface SwipeAction {
  tileId: string;
  direction: 'left' | 'right';
}

interface ParticipantInfo {
  id: string;
  name?: string;
  sessionId?: string;
}

interface MatchNotification {
  tile: Tile;
  participantCount: number;
  matchDate: string;
}

// Form types
interface JoinSessionFormData {
  accessCode: string;
  participantName?: string;
}

interface CreateTileSetFormData {
  title: string;
  description?: string;
  category: TileSetCategory;
  expiresDate?: string;
}

interface CreateTileFormData {
  title: string;
  description?: string;
  externalLink?: string;
  tags?: TileTag[];
  order?: number;
}

// Utility types
type OptionalMetadata<T> = Partial<T['metadata']>;
type CreateTileSetData = Omit<TileSet, 'id' | 'created_at' | 'modified_at'>;
type CreateTileData = Omit<Tile, 'id' | 'created_at' | 'modified_at'>;
type CreateSessionData = Omit<Session, 'id' | 'created_at' | 'modified_at'>;

// Type guards for runtime validation
function isTileSet(obj: CosmicObject): obj is TileSet {
  return obj.type === 'tile-sets';
}

function isTile(obj: CosmicObject): obj is Tile {
  return obj.type === 'tiles';
}

function isSession(obj: CosmicObject): obj is Session {
  return obj.type === 'sessions';
}

function isSwipeResult(obj: CosmicObject): obj is SwipeResult {
  return obj.type === 'swipe-results';
}

function isMatch(obj: CosmicObject): obj is Match {
  return obj.type === 'matches';
}

// Export all types
export type {
  CosmicObject,
  TileSet,
  Tile,
  Session,
  SwipeResult,
  Match,
  TileSetCategory,
  SwipeDecision,
  TileTag,
  CosmicResponse,
  SwipeAction,
  ParticipantInfo,
  MatchNotification,
  JoinSessionFormData,
  CreateTileSetFormData,
  CreateTileFormData,
  OptionalMetadata,
  CreateTileSetData,
  CreateTileData,
  CreateSessionData,
};

export {
  isTileSet,
  isTile,
  isSession,
  isSwipeResult,
  isMatch,
};