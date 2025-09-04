
import { faPauseCircle, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

export default function Play() {

  const playerRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {


    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "dQw4w9WgXcQ",
        playerVars: {
          controls: 0,
          autoplay: 0,
        },
        events: {
          onReady: () => {
            setReady(true);
            console.log("Player pronto");
          },
          onStateChange: onPlayerStateChange,
        },
      });
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (playing && playerRef.current) {
      interval = setInterval(() => {
        const duration = playerRef.current.getDuration();
        const current = playerRef.current.getCurrentTime();
        if (duration) {
          setProgress(current / duration);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const onPlayerStateChange = (event: any) => {
    const YT = (window as any).YT;
    if (event.data === YT.PlayerState.PLAYING) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  const playAudio = () => {
    if (!playing) {
      if (ready && playerRef.current && playerRef.current.playVideo) {
        playerRef.current.playVideo();
      }
    } else {

      if (ready && playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
      }
    }
  };


  return (
    <div className="d-flex rounded rounded-2 justify-content-around align-items-center flex-wrap">
      <div className="col-12 d-flex justify-content-around">
        <div className="col-3 p-0 d-flex align-items-center justify-content-center img-fluid rounded rounded-2 border border-white" style={{backgroundImage:`url('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg')`,backgroundRepeat: "no-repeat",backgroundSize: 'cover',backgroundPosition:"center"}}>
          <span role="button" className="fs-3">
            {(!playing) ? <FontAwesomeIcon icon={faPlayCircle} onClick={playAudio} /> : <FontAwesomeIcon icon={faPauseCircle} onClick={playAudio} />}
          </span>
        </div>
        <div className="col-9 ms-2">
          <h3 className="m-0">Titulo do Video</h3>
          <p className="m-0">Views 8451545</p>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-around align-items-center mt-2">
        <div id="youtube-player"></div>
        <div className="col-12">
          <div
            className="progress rounded rounded-2"
            role="progressbar"
            aria-label="Example 1px high"
            aria-valuenow={25}
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
}
