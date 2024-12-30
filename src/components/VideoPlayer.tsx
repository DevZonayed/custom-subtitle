import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from "lucide-react";
import classNames from "classnames";
// Import the parser
import SRTParser2 from "srt-parser-2";

interface SubtitleTrack {
  src?: string;
  content?: string;
  label: string;
  language: string;
}

interface Props {
  url: string;
  subtitles?: SubtitleTrack[];
}

interface Cue {
  start: number; // in seconds
  end: number; // in seconds
  text: string;
}

/** A helper to convert a "HH:MM:SS.mmm" (WebVTT style) to total seconds. */
function vttTimeToSeconds(timeStr: string): number {
  // Typical VTT format: "00:00:05.000"
  const [hh, mm, rest] = timeStr.split(":");
  const [ss, ms = "0"] = rest.split(".");
  const h = parseInt(hh, 10) || 0;
  const m = parseInt(mm, 10) || 0;
  const s = parseInt(ss, 10) || 0;
  const millis = parseInt(ms, 10) || 0;
  return h * 3600 + m * 60 + s + millis / 1000;
}

/**
 * Renders the current cue (if any) in an absolutely positioned overlay.
 */
const SubtitlesOverlay: React.FC<{
  cues: Cue[];
  currentTime: number; // in seconds
  show: boolean; // whether to show subtitles
}> = ({ cues, currentTime, show }) => {
  if (!show) return null;

  // Find the cue that should be displayed at this time
  const activeCue = cues.find(
    (cue) => currentTime >= cue.start && currentTime <= cue.end
  );

  if (!activeCue) return null;

  return (
    <div className="pointer-events-none absolute bottom-10 w-full text-center">
      <div className="inline-block bg-black/70 text-white px-3 py-2 rounded-md">
        {activeCue.text}
      </div>
    </div>
  );
};

export const VideoPlayer = ({ url, subtitles }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  // "played" is a fraction (0..1), "currentTime" is the actual seconds
  const [played, setPlayed] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [error, setError] = useState(false);

  // Store our manually parsed cues
  const [cues, setCues] = useState<Cue[]>([]);

  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** 1) Load & parse the VTT (or SRT) file, if subtitles are provided */
  useEffect(() => {
    if (!subtitles || subtitles.length === 0) return;

    // This example: just load the first track
    const track = subtitles[0];

    async function loadAndParse() {
      try {
        const parser = new SRTParser2();
        let parsedData: {
          id: string;
          startTime: string;
          endTime: string;
          text: string;
        }[] = [];

        if (track.content) {
          parsedData = parser.fromSrt(track.content);
        } else if (track.src) {
          const response = await fetch(track.src);
          const rawText = await response.text();
          parsedData = parser.fromSrt(rawText);
        }else{
          console.error("No subtitle content or URL provided.");
          return;
        }
        // "parsedData" is an array like:
        // [ { id, startTime, endTime, text }, ... ]
        // Convert start/end times to seconds:
        const converted = parsedData.map((item) => ({
          start: vttTimeToSeconds(item.startTime),
          end: vttTimeToSeconds(item.endTime),
          text: item.text,
        }));

        setCues(converted);
      } catch (err) {
        console.error("Failed to parse subtitles:", err);
      }
    }

    loadAndParse();
  }, [subtitles]);

  /** 2) Handlers */
  const handlePlayPause = () => setPlaying(!playing);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleToggleMute = () => setMuted(!muted);

  /**
   * onProgress gives us { played, playedSeconds }
   * so we can keep both a fraction and an absolute time.
   */
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
    setCurrentTime(state.playedSeconds);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const fraction = parseFloat(e.target.value);
    setPlayed(fraction);
    playerRef.current?.seekTo(fraction);
  };

  const handlePlaybackRateChange = (rate: number) => setPlaybackRate(rate);

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }
  };

  const handleError = () => {
    setError(true);
    console.error("Error loading video:", url);
  };

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        <p className="text-white">Error loading video</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg"
    >
      <div className="absolute inset-0">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onError={handleError}
          /*
           * For raw mp4/hls files, these tracks might work natively,
           * but for YT, they won't. We'll overlay them anyway.
           */
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
              },
              // tracks: subtitles?.map((subtitle) => ({
              //   kind: "subtitles",
              //   src: subtitle.src || "",
              //   label: subtitle.label,
              //   srcLang: subtitle.language,
              //   default: subtitle.language === "bn",
              // })),
            },
          }}
        />

        {/* 3) Our custom subtitles overlay (works even for YouTube) */}
        <SubtitlesOverlay
          cues={cues}
          currentTime={currentTime}
          show={showSubtitles}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 opacity-0 hover:opacity-100">
        <div className="flex items-center space-x-4">
          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {playing ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          {/* Volume + Mute */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleMute}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {muted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-blue-500"
            />
          </div>

          {/* Seek (fraction 0..1) */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={played}
            onChange={handleSeek}
            className="flex-grow accent-blue-500"
          />

          {/* Settings */}
          <div className="relative group">
            <button className="text-white hover:text-blue-400 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-black/95 rounded-lg p-3 shadow-lg">
              <div className="text-white space-y-3 min-w-[140px]">
                {/* Playback rate */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Speed
                  </label>
                  <select
                    value={playbackRate}
                    onChange={(e) =>
                      handlePlaybackRateChange(parseFloat(e.target.value))
                    }
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 w-full text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {[0.5, 1, 1.5, 2].map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}x
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subtitles on/off */}
                {subtitles && subtitles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Subtitles
                    </label>
                    <button
                      onClick={() => setShowSubtitles(!showSubtitles)}
                      className={classNames(
                        "w-full px-3 py-1 rounded text-sm font-medium transition-colors",
                        showSubtitles
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      )}
                    >
                      {showSubtitles ? "On" : "Off"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};