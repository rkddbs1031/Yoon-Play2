import { TRANSITION_DURATION } from '@/hooks/usePlayerBackground';

interface PlayerPanelBackgroundProps {
  overlayImage?: string | null;
  height: number;
}

export const PlayerPanelBackground = ({ overlayImage, height }: PlayerPanelBackgroundProps) => {
  return (
    <>
      {overlayImage && (
        <div className={`background-image absolute w-full`} style={{ height }}>
          <div
            className={`background-thumbnail h-full transition-opacity duration-${TRANSITION_DURATION} ease-in-out bg-cover bg-center bg-no-repeat blur-[30px] `}
            style={{ backgroundImage: `url(${overlayImage})` }}
          />
        </div>
      )}
      <div className='overlay absolute bottom-0 left-0 transition-all duration-500 bg-[linear-gradient(to_bottom,transparent_20%,rgb(0_0_0_/_40%)_100%)]  backdrop-blur-[30px] w-full h-full'></div>
    </>
  );
};
