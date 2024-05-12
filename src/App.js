import "./App.css";
import ReactPlayer from "react-player";
import { Container } from "@material-ui/core";
import Control from "./Components/Control";
import { useState, useRef } from "react";
import { formatTime } from "./format";
import { useSelector, useDispatch } from "react-redux";
import screenfull from 'screenfull';
import { setMediaUrls, setCurrentMediaIndex } from "./Redux/actions";

function App() {
  const videoPlayerRef = useRef(null);
  const controlRef = useRef(null);
  const dispatch = useDispatch();

  // Redux state
  const mediaUrls = useSelector((state) => state.mediaUrls);
  const currentMediaIndex = useSelector((state) => state.currentMediaIndex);

  const [videoState, setVideoState] = useState({
    playing: true,
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    buffer: true,
  });

  const { playing, muted, volume, playbackRate, played, seeking, buffer } =
    videoState;

  const currentTime = videoPlayerRef.current
    ? videoPlayerRef.current.getCurrentTime()
    : "00:00";
  const duration = videoPlayerRef.current
    ? videoPlayerRef.current.getDuration()
    : "00:00";

  const formatCurrentTime = formatTime(currentTime);
  const formatDuration = formatTime(duration);

  const playPauseHandler = () => {
    setVideoState({ ...videoState, playing: !videoState.playing });
  };

  const rewindHandler = () => {
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() - 10);
  };

  const handleFastFoward = () => {
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() + 10);
  };

  const progressHandler = (state) => {
    setVideoState({ ...videoState, ...state });
  };

  const seekHandler = (e, value) => {
    setVideoState({ ...videoState, played: parseFloat(value / 100) });
    videoPlayerRef.current.seekTo(parseFloat(value / 100));
  };

  const seekMouseUpHandler = (e, value) => {
    setVideoState({ ...videoState, seeking: false });
    videoPlayerRef.current.seekTo(value / 100);
  };

  const volumeChangeHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: Number(newVolume) === 0 ? true : false,
    });
  };

  const volumeSeekUpHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: newVolume === 0 ? true : false,
    });
  };

  const muteHandler = () => {
    setVideoState({ ...videoState, muted: !videoState.muted });
  };

  const onSeekMouseDownHandler = (e) => {
    setVideoState({ ...videoState, seeking: true });
  };

  const mouseMoveHandler = () => {
    controlRef.current.style.visibility = "visible";
  };

  const bufferStartHandler = () => {
    setVideoState({ ...videoState, buffer: true });
  };

  const bufferEndHandler = () => {
    setVideoState({ ...videoState, buffer: false });
  };

  const previousMedia = () => {
    dispatch(setCurrentMediaIndex(currentMediaIndex === 0 ? mediaUrls.length - 1 : currentMediaIndex - 1));
  };

  const nextMedia = () => {
    dispatch(setCurrentMediaIndex((currentMediaIndex + 1) % mediaUrls.length));
  };

  const onPlayRateChange = (rate) => {
    setVideoState({ ...videoState, playbackRate: rate });
  };

  const handleMaximize = () => {
    if (screenfull.isEnabled && videoPlayerRef.current) {
      screenfull.request(videoPlayerRef.current.wrapper);
    }
  };

  const handleMinimize = () => {
    if (videoPlayerRef.current) {
      const videoElement = videoPlayerRef.current.getInternalPlayer();
      if (document.pictureInPictureEnabled && videoElement) {
        videoElement.requestPictureInPicture()
          .then(() => {
            console.log('Entered Picture-in-Picture mode');
          })
          .catch((error) => {
            console.error('Failed to enter Picture-in-Picture mode:', error);
          });
      } else {
        console.error('Picture-in-Picture mode is not supported in this browser');
      }
    }
  };

  const isAudioOnly =
    mediaUrls[currentMediaIndex].endsWith('.mp3') ||
    mediaUrls[currentMediaIndex].endsWith('.wav')

  return (
    <div className="video_container">
      <div>
        <h2>Audio/Video Player</h2>
      </div>
      <Container maxWidth="md" justify="center">
        <div className="player__wrapper" onMouseMove={mouseMoveHandler}>
        {isAudioOnly ? ( 
                <img
                  src='black_background.png'
                  alt="Blank"
                  style={{ width: '100%', height: '100%' }}
                  className='border-yellow-100'
                />
              ) : (
                <></>
              )}
          <ReactPlayer
            ref={videoPlayerRef}
            className="player"
            url={mediaUrls[currentMediaIndex]}
            width="100%"
            height="auto"
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onProgress={progressHandler}
            onBuffer={bufferStartHandler}
            onBufferEnd={bufferEndHandler}
          />

          <Control
            controlRef={controlRef}
            onPlayPause={playPauseHandler}
            playing={playing}
            onRewind={rewindHandler}
            onForward={handleFastFoward}
            played={played}
            onSeek={seekHandler}
            onSeekMouseUp={seekMouseUpHandler}
            volume={volume}
            onVolumeChangeHandler={volumeChangeHandler}
            onVolumeSeekUp={volumeSeekUpHandler}
            mute={muted}
            onMute={muteHandler}
            playRate={playbackRate}
            duration={formatDuration}
            currentTime={formatCurrentTime}
            onMouseSeekDown={onSeekMouseDownHandler}
            onPrevious={previousMedia}
            onNext={nextMedia}
            onPlayRateChange={onPlayRateChange}
            onMaximize={handleMaximize}
            onMinimize={handleMinimize}
            buffer={buffer}
          />
        </div>
      </Container>
    </div>
  );
}

export default App;
