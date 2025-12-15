'use client';

import { useSearchParams } from 'next/navigation';

import { LibraryListType } from '@/constants/library';
import LikedPlaylist from '@/components/Library/Playlist/LikedPlaylist';

export default function LibraryPlaylist() {
  const searchParams = useSearchParams();
  const listParam = searchParams.get('list');

  if (listParam === LibraryListType.Like) return <LikedPlaylist />;
}
