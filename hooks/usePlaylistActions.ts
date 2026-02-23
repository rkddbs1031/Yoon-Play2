'use client';

import { useAtom } from 'jotai';

import { PlaylistItem } from '@/types/playlist';
import { playlistTargetTrackAtom } from '@/store/playlist/atoms';
import { useAddTrackToPlaylistMutation, useCreatePlaylistMutation } from '@/services/playlists';

/**
 * - 유저가 만든 플레이리스트만 조회
 * - 플레이리스트 생성 (a.k.a. 폴더)
 * - targetTrack 관리 (어떤 트랙을 추가할지)
 * - 트랙 추가
 *
 * - 플레이리스트 목록 조회 (likedPlaylist, userPlaylist)
 * - 플레이리스트 생성 (재생목록 폴더)
 */

export const usePlaylistActions = () => {
  const [targetTrack, setTargetTrack] = useAtom(playlistTargetTrackAtom);

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
    targetTrack,
    setTargetTrack: (track: PlaylistItem) => setTargetTrack(track), // setPlaylistTargetTrack
    clearTargetTrack: () => setTargetTrack(null), //clearPlaylistTargetTrack

    onCreatePlaylist: handleCreatePlaylist,
    onAddTrack: handleAddTrack,

    isCreating: createMutation.isPending,
    isAdding: addTrackMutation.isPending,
  };
};
