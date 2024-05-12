import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Slider,
  withStyles,
  Select,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import {
  FastForward,
  FastRewind,
  Pause,
  PlayArrow,
  SkipPrevious,
  SkipNext,
  VolumeUp,
  VolumeOff,
  Fullscreen,
} from "@material-ui/icons";
import PictureInPictureIcon from "@mui/icons-material/PictureInPicture";
import "./Control.css";

const useStyles = makeStyles({
  volumeSlider: {
    width: "100px",
    color: "#9556CC",
    marginRight: 30,
  },
});

const PrettoSlider = withStyles({
  root: {
    height: "20px",
    color: "#9556CC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#9556CC",
    border: "2px solid currentColor",
    marginTop: -3,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 5,
    borderRadius: 4,
    width: "100%",
  },
  rail: {
    height: 5,
    borderRadius: 4,
  },
})(Slider);

const Control = ({
  onPlayPause,
  playing,
  onRewind,
  onForward,
  played,
  onSeek,
  onSeekMouseUp,
  onVolumeChangeHandler,
  onVolumeSeekUp,
  volume,
  mute,
  onMute,
  duration,
  currentTime,
  onMouseSeekDown,
  controlRef,
  onPrevious,
  onNext,
  playRate,
  onPlayRateChange,
  onMaximize,
  onMinimize,
  buffer,
}) => {
  const classes = useStyles();
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case " ":
          onPlayPause();
          break;
        case "ArrowUp":
          if (volume < 1) {
            onVolumeChangeHandler(null, volume * 100 + 5);
          }
          break;
        case "ArrowDown":
          if (volume > 0) {
            onVolumeChangeHandler(null, volume * 100 - 5);
          }
          break;
        case "ArrowRight":
          onForward();
          break;
        case "ArrowLeft":
          onRewind();
          break;
        case "m":
          onMute();
          break;
        case "f":
          onMaximize();
          break;
        case "Escape":
          document.exitFullscreen();
          break;
        case "w":
          onMinimize();
          break;
        case "n":
          onNext();
          break;
        case "p":
          onPrevious();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    onPlayPause,
    onVolumeChangeHandler,
    volume,
    onForward,
    onRewind,
    onMute,
    onMaximize,
    onNext,
    onPrevious,
    onMinimize,
  ]);

  return (
    <div
      className={`control_Container ${showControls || !playing ? "show" : ""}`}
      ref={controlRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {buffer ? (
        <div className="buffering icon__btn">
          <CircularProgress fontSize="medium" />
        </div>
      ) : (
        <div className="mid__container">
          <div className="icon__btn" onClick={onPrevious}>
            <SkipPrevious fontSize="medium" />
          </div>
          <div className="icon__btn" onClick={onRewind}>
            <FastRewind fontSize="medium" />
          </div>

          <div className="icon__btn" onClick={onPlayPause}>
            {playing ? (
              <Pause fontSize="medium" />
            ) : (
              <PlayArrow fontSize="medium" />
            )}{" "}
          </div>

          <div className="icon__btn">
            <FastForward fontSize="medium" onClick={onForward} />
          </div>
          <div className="icon__btn" onClick={onNext}>
            <SkipNext fontSize="medium" />
          </div>
        </div>
      )}
      <div className="bottom__container">
        <div className="slider__container">
          <PrettoSlider
            min={0}
            max={100}
            value={played * 100}
            onChange={onSeek}
            onChangeCommitted={onSeekMouseUp}
            onMouseDown={onMouseSeekDown}
          />
        </div>
        <div className="control__box">
          <div className="inner__controls">
            <div className="leftSide">
            <div className="icon__btn" onClick={onPlayPause}>
              {playing ? (
                <Pause fontSize="medium" />
              ) : (
                <PlayArrow fontSize="medium" />
              )}{" "}
            </div>

            <div className="icon__btn" onClick={onMute}>
              {mute ? (
                <VolumeOff fontSize="medium" />
              ) : (
                <VolumeUp fontSize="medium" />
              )}
            </div>

            <Slider
              className={`${classes.volumeSlider}`}
              onChange={onVolumeChangeHandler}
              value={volume * 100}
              onChangeCommitted={onVolumeSeekUp}
            />
            <span>
              {currentTime} / {duration}
            </span>
            </div>
            <div className="rightSide">
              <div className="icon__btn" onClick={onMaximize}>
                <Fullscreen fontSize="medium" />
              </div>
              <div className="icon__btn" onClick={onMinimize}>
                <PictureInPictureIcon fontSize="medium" />
              </div>
              <Select
                value={playRate}
                onChange={(e) => onPlayRateChange(parseFloat(e.target.value))}
                style={{ color: "white", marginRight: 10 }}
              >
                {[...Array(15)].map((_, index) => (
                  <MenuItem key={index} value={(index + 2) / 4}>
                    {((index + 2) / 4).toFixed(2)}x
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Control;
