'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { PlaylistItem } from '@/types/playlist';
import { QueueContext } from '@/types/queue';
import { usePlayerCore } from '@/hooks/usePlayer';

import { PlayerQueueItem } from '@/components/PlayerQueueItem';

interface TrackListProps {
  tracks: PlaylistItem[];
  context: QueueContext;
}

export default function TrackList({ tracks, context }: TrackListProps) {
  const { currentVideoId, setPlayerListFromContext, setPlaylistSource } = usePlayerCore();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 2,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const handlePlay = (clickedItem: PlaylistItem) => setPlayerListFromContext(tracks, clickedItem);

  return (
    <div
      ref={parentRef}
      className='playlist-track-list-container overflow-auto mt-[50px]'
      style={{ height: 'calc(100vh - 400px - 80px)' }}
    >
      <ul className='playlist-track-list relative w-full' style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {virtualItems.map(virtualRow => {
          const { index } = virtualRow;
          const track = tracks[index];

          return (
            <li
              key={track.videoId}
              className={`${index + 1} absolute left-0 top-0 w-full border-t border-[#66666610] last:border-b last:border-white/20`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <PlayerQueueItem
                item={track}
                isActive={track.videoId === currentVideoId}
                onClick={() => handlePlay(track)}
                context={context}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
