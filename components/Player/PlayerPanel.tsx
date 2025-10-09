import { usePlayer } from '@/hooks/usePlayer';
import { MusicInfoWrapper } from './MusicInfo';
import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { TRANSITION_DURATION, usePlayerBackground } from '@/hooks/usePlayerBackground';
import { DownIcon, MoreVerticalIcon } from '@/states/icon/svgs';

const ANIMATION_DURATION = 400;

const PlayerPanel = () => {
  const { isPlaylistPanelOpen, playlist, currentVideo, togglePlaylistPanel } = usePlayer();
  const { shouldRender, animation } = useAnimatedMount(isPlaylistPanelOpen, {
    open_transform: 'translate-y-0',
    closed_transform: 'translate-y-full',
    duration: ANIMATION_DURATION,
  });
  const { displayImage, isTransitioning } = usePlayerBackground(currentVideo?.thumbnail?.medium?.url);

  if (!shouldRender || !currentVideo) return null;

  return (
    <section
      className={`fixed top-0 left-0 w-full h-full transition-all duration-${ANIMATION_DURATION} ${animation} flex flex-col items-center p-5 md:py-[32px] md:px-[24px]`}
    >
      {displayImage && (
        <div
          className={`absolute inset-0 bg-cover bg-center transform scale-[1.1] filter blur-[10px] brightness-[0.8] 
            transition-opacity duration-${TRANSITION_DURATION} ease-in-out
            ${isTransitioning ? 'opacity-50' : 'opacity-100'}
          `}
          style={{ backgroundImage: `url(${displayImage})` }}
        />
      )}
      <div
        className={`absolute inset-0 transition-all duration-500 ${displayImage ? 'bg-white/20 backdrop-blur-[10px]' : 'bg-white/60 backdrop-blur-[30px]'} `}
      />

      <div className='player-panel-container border relative z-10 w-[calc(100%-32px)] lg:w-full max-w-[960px] mx-auto'>
        <div className='top-button flex justify-between w-full'>
          <button type='button' onClick={togglePlaylistPanel} className='down-btn cursor-pointer'>
            <DownIcon color='white' size={20} />
          </button>
          <button type='button' className='more-btn cursor-pointer'>
            <MoreVerticalIcon color='white' size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
export default PlayerPanel;
