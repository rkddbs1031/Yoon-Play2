'use client';

import { useAtom, useAtomValue } from 'jotai';

import { PlaylistItem } from '@/types/playlist';
import { currentVideoPlaylistIdAtom, playlistTargetTrackAtom } from '@/store/playlist/atoms';
import {
  useAddTrackToPlaylistMutation,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useRemoveTrackFromPlaylistMutation,
  useUpdatePlaylistMutation,
} from '@/services/playlists';

/**
 * - 유저가 만든 플레이리스트만 조회
 * - 플레이리스트 생성 (a.k.a. 폴더)
 * - targetTrack 관리 (어떤 트랙을 추가할지)
 * - 트랙 추가
 *
 * - 플레이리스트 목록 조회 (likedPlaylist, userPlaylist)
 * - 플레이리스트 생성 (재생목록 폴더)
 *
 * - 플레이리스트 내 특정 트랙 제거
 */

export const usePlaylistActions = () => {
  const [targetTrack, setTargetTrack] = useAtom(playlistTargetTrackAtom);
  const currentPlaylistId = useAtomValue(currentVideoPlaylistIdAtom);

  const createMutation = useCreatePlaylistMutation();
  const addTrackMutation = useAddTrackToPlaylistMutation();
  const removeTrackMutation = useRemoveTrackFromPlaylistMutation();
  const updatePlaylistMutation = useUpdatePlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();

  const handleCreatePlaylist = async (data: { title: string; description?: string; initialTrack?: PlaylistItem }) => {
    await createMutation.mutateAsync(data); // 플레이리스트 생성 완료 기다림
    setTargetTrack(null);
  };

  const handleAddTrack = async (playlistId: string) => {
    if (!targetTrack) return;

    await addTrackMutation.mutateAsync({ playlistId, track: targetTrack });

    setTargetTrack(null);
  };

  const handleRemoveTrack = async (trackId: string) => {
    // TODO: 이 재생목록에서 곡을 삭제하시겠습니까?

    if (!currentPlaylistId) return;

    await removeTrackMutation.mutateAsync({
      playlistId: currentPlaylistId,
      trackId,
    });
  };

  const handleUpdatePlaylist = async ({ id, data }: { id: string; data: { title: string; description?: string } }) => {
    await updatePlaylistMutation.mutateAsync({ id, data });
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    await deletePlaylistMutation.mutate(playlistId);
  };

  return {
    targetTrack,
    setTargetTrack: (track: PlaylistItem) => setTargetTrack(track),
    clearTargetTrack: () => setTargetTrack(null),

    onCreatePlaylist: handleCreatePlaylist,
    onAddTrack: handleAddTrack,
    onRemoveTrack: handleRemoveTrack,
    onUpdatePlaylist: handleUpdatePlaylist,
    onDeletePlaylist: handleDeletePlaylist,

    isCreating: createMutation.isPending,
    isAdding: addTrackMutation.isPending,
    isRemoving: removeTrackMutation.isPending,
  };
};
