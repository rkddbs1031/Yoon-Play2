'use client';

import { useEffect, useState } from 'react';

import * as playlistDB from '@/lib/indexedDB/playlistDB';
import { PlaylistDB } from '@/types/playlist';

export const usePlaylist = () => {
  const [playlists, setPlaylists] = useState<PlaylistDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const data = await playlistDB.getPlaylists();
      setPlaylists(data);
    } catch (e) {
      console.error('Failed to fetch playlists', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return {
    playlists,
    isLoading,
    refetch: fetchPlaylists,
  };
};
