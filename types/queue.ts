export enum QueueContext {
  CurrentQueue = 'CURRENT_QUEUE',
  LikedList = 'LIKED_LIST',
  Playlist = 'PLAYLIST',
}
// PlayerQueueItem
// 현재 재생되고있는 플레이리스트에서 사용 => CURRENT_QUEUE
// 좋아요 목록에서 사용 => LIKED_LIST
// 유저가 직접 만든 재생목록에서 사용 => PLAYLIST
