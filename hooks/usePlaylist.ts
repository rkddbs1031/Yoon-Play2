'use client';

import { useAtom } from 'jotai';

import { PlaylistItem } from '@/types/playlist';
import { playlistTargetTrackAtom } from '@/store/playlist/atoms';
import { useAddTrackToPlaylistMutation, useCreatePlaylistMutation, usePlaylistsQuery } from '@/services/playlists';

export const usePlaylist = () => {
  const [targetTrack, setTargetTrack] = useAtom(playlistTargetTrackAtom);

  const { data: playlists = [], isLoading, refetch } = usePlaylistsQuery();
  const createMutation = useCreatePlaylistMutation();
  const addTrackMutation = useAddTrackToPlaylistMutation();

  const handleCreatePlaylist = async (data: { title: string; description?: string; initialTrack?: PlaylistItem }) => {
    await createMutation.mutateAsync(data); // 플레이리스트 생성 완료 기다림
    setTargetTrack(null);
  };

  const handleAddTrack = async (playlistId: string) => {
    if (!targetTrack) return;

    await addTrackMutation.mutateAsync({
      playlistId,
      track: targetTrack,
    });

    setTargetTrack(null);
  };

  return {
    playlists,
    isLoading,
    refetch,

    targetTrack,
    setPlaylistTargetTrack: (track: PlaylistItem) => setTargetTrack(track),
    clearPlaylistTargetTrack: () => setTargetTrack(null),

    onCreatePlaylist: handleCreatePlaylist,
    onAddTrack: handleAddTrack,
  };
};
