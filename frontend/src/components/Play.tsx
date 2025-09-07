import { faPauseCircle, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

interface PlayProps {
  titulo: string;
  views: number;
  id_youtube: string;
  apiReady: boolean;
  isActive: boolean;
  setActivePlayer: (id: string | null) => void;
}

const Play: React.FC<PlayProps> = ({
  titulo,
  views,
  id_youtube,
  apiReady,
  isActive,
  setActivePlayer,
}) => {
  const playerRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playerInitialized = useRef(false);

  useEffect(() => {
    if (!apiReady || playerInitialized.current) return;

    playerRef.current = new window.YT.Player(`youtube-player-${id_youtube}`, {
      height: "0",
      width: "0",
      videoId: id_youtube,
      playerVars: { controls: 0, autoplay: 0 },
      events: {
        onReady: () => {
          setReady(true);
        },
        onStateChange: (event: any) => {
          const YT = window.YT;
          if (event.data === YT.PlayerState.PLAYING) setPlaying(true);
          else if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED
          )
            setPlaying(false);
        },
      },
    });

    playerInitialized.current = true;
  }, [apiReady, id_youtube]);

  useEffect(() => {
    let interval: any;
    if (playing && playerRef.current) {
      interval = setInterval(() => {
        const duration = playerRef.current.getDuration?.();
        const current = playerRef.current.getCurrentTime?.();
        if (duration) setProgress(current / duration);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [playing]);

  // Quando não é mais ativo, pausa o player
  useEffect(() => {
    if (!isActive && playerRef.current && playing) {
      playerRef.current.pauseVideo();
    }
  }, [isActive, playing]);

  const playAudio = () => {
    if (!ready || !playerRef.current) return;

    if (!playing) {
      setActivePlayer(id_youtube);
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
      setActivePlayer(null);
    }
  };

  return (
    <div className={`d-flex rounded rounded-2 justify-content-around align-items-center flex-wrap p-2 ${!playing ? (""):("bg-warning")}`}>
      <div className="col-12 d-flex justify-content-around">
        <div
          onClick={playAudio}
          className="col-3 p-0 d-flex align-items-center justify-content-center img-fluid rounded rounded-2 border border-white"
          style={{
            backgroundImage: `url('https://img.youtube.com/vi/${id_youtube}/hqdefault.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span role="button" className="fs-3">
            {!playing ? (
              <FontAwesomeIcon icon={faPlayCircle} />
            ) : (
              <FontAwesomeIcon icon={faPauseCircle} />
            )}
          </span>
        </div>
        <div className="col-9 ms-2">
          <h6 className="m-0">{titulo}</h6>
          <p className="m-0">Views {views}</p>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-around align-items-center mt-2">
        <div id={`youtube-player-${id_youtube}`}></div>
        <div className="col-12">
          <div
            className="progress rounded rounded-2"
            role="progressbar"
            aria-label="Example 1px high"
            aria-valuenow={progress * 100}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ height: "3px" }}
          >
            <div
              className="progress-bar"
              style={{ width: `${(progress * 100).toFixed(2)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Play;
