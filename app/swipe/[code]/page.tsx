// app/swipe/[code]/page.tsx
import { getTileSetByAccessCode, getTilesForTileSet } from '@/lib/cosmic'
import SwipeInterface from '@/components/SwipeInterface'
import { redirect } from 'next/navigation'
import { TileSet, Tile } from '@/types'

interface SwipePageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ participant?: string; name?: string; session?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  const tileSet = await getTileSetByAccessCode(code);
  
  if (!tileSet) {
    return {
      title: 'Tile Set Not Found - SwipePlans',
      description: 'The access code you entered was not found.',
    };
  }

  const typedTileSet = tileSet as TileSet;
  
  return {
    title: `${typedTileSet.metadata.title} - SwipePlans`,
    description: `Swipe on options for: ${typedTileSet.metadata.description || typedTileSet.metadata.title}`,
  };
}

export default async function SwipePage({ params, searchParams }: SwipePageProps) {
  // Await the params and searchParams promises
  const { code } = await params;
  const { participant, name, session } = await searchParams;
  
  // Fetch tile set by access code
  const tileSet = await getTileSetByAccessCode(code);
  
  if (!tileSet) {
    redirect('/join?error=invalid_code');
  }

  const typedTileSet = tileSet as TileSet;

  // Check if tile set is active
  if (!typedTileSet.metadata.is_active) {
    redirect('/join?error=inactive');
  }

  // Check if tile set has expired
  if (typedTileSet.metadata.expires_date) {
    const expiryDate = new Date(typedTileSet.metadata.expires_date);
    if (expiryDate < new Date()) {
      redirect('/join?error=expired');
    }
  }

  // Fetch tiles for this tile set
  const tiles = await getTilesForTileSet(typedTileSet.id);
  const typedTiles = tiles as Tile[];

  if (typedTiles.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎲</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Options Available
          </h1>
          <p className="text-gray-600 mb-6">
            This tile set doesn't have any options to swipe on yet. 
            Ask the creator to add some tiles first.
          </p>
        </div>
      </main>
    );
  }

  // Validate participant info
  if (!participant) {
    redirect(`/join?code=${code}`);
  }

  return (
    <main className="flex-1 bg-gray-50">
      <SwipeInterface 
        tileSet={typedTileSet}
        tiles={typedTiles}
        participantId={participant}
        participantName={name}
        sessionId={session}
      />
    </main>
  );
}