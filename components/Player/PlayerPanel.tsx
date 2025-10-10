import { usePlayer } from '@/hooks/usePlayer';
import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { TRANSITION_DURATION, usePlayerBackground } from '@/hooks/usePlayerBackground';
import { DownIcon, MoreVerticalIcon } from '@/states/icon/svgs';

import { PlayerControl } from './PlayerControl';

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
      className={`player-panel fixed top-0 left-0 w-full h-full transition-all duration-${ANIMATION_DURATION} ${animation} ease-in-out bg-[linear-gradient(to_bottom,black,white)] backdrop-blur-[0px]`}
    >
      {displayImage && (
        <div className={`background-image absolute h-full w-full`}>
          <div
            className={`background-thumbnail h-[50vh] transition-opacity duration-${TRANSITION_DURATION} ease-in-out bg-cover bg-center bg-no-repeat blur-[30px] `}
            style={{ backgroundImage: `url(${displayImage})` }}
          />
        </div>
      )}
      <div className='overlay background-gradient absolute top-0 left-0 transition-all duration-500 bg-[linear-gradient(to_bottom,rgb(255_255_255/_20%),#f8f0fc80_40%)]  backdrop-blur-[30px] w-full h-full'></div>

      <div className='player-panel-container relative z-10 w-[calc(100%-32px)] lg:w-full max-w-[750px] mx-auto p-5 md:py-[32px] md:px-[24px]'>
        <div className='top-button flex justify-between w-full'>
          <button type='button' onClick={togglePlaylistPanel} className='down-btn cursor-pointer'>
            <DownIcon color='white' size={20} />
          </button>
          <button type='button' className='more-btn cursor-pointer'>
            <MoreVerticalIcon color='white' size={20} />
          </button>
        </div>

        <div className='thumbnail py-7 max-w-[400px] w-full mx-auto'>
          <img
            src={currentVideo.thumbnail.medium.url}
            alt={currentVideo.title}
            className='block w-full rounded-[8px]'
          />
        </div>

        <div className='player-controls flex flex-col gap-5'>
          <div className='music-info flex flex-col gap-[2px]'>
            <h4 className={`text-[14px] text-white font-[600]`}>{currentVideo.title}</h4>
            <span className={`text-[10px] text-white/60 `}>{currentVideo.channelTitle}</span>
          </div>

          <PlayerControl.ProgressBar />

          <div className='player-control-buttons'>
            <PlayerControl.Buttons color='#ffffff' disabledColor={currentVideo && '#ffffff66'} size={28} />
          </div>
        </div>
      </div>
    </section>
  );
};
export default PlayerPanel;
