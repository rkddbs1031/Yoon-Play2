'use client';

import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useVirtualizer } from '@tanstack/react-virtual';

import { currentVideoAtom } from '@/store/playerAtom';
import { PlaylistItem } from '@/types/playlist';
import { QueueContext } from '@/types/queue';

import { PlayerQueueItem } from '@/components/PlayerQueueItem';

interface TrackListProps {
  tracks: PlaylistItem[];
  context: QueueContext;
}

export default function TrackList({ tracks, context }: TrackListProps) {
  const currentVideo = useAtomValue(currentVideoAtom);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 2,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const handleClick = () => {
    console.log('TODO: handleClick TrackList');
  };

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
              className={`${index + 1} absolute left-0 top-0 z-[1] w-full border-t border-white/15 last:border-b last:border-white/20`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <PlayerQueueItem
                item={track}
                isActive={track.videoId === currentVideo?.videoId}
                onClick={handleClick}
                context={context}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
