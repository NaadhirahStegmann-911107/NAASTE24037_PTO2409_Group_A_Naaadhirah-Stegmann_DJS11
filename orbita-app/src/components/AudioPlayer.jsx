import React from "react";

function AudioPlayer({ currentEpisode }) {
  const [progress, setProgress] = React.useState(0);
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      const listenedEpisodes = JSON.parse(
        localStorage.getItem("listenedEpisodes") || "[]"
      );
      if (
        currentEpisode &&
        !listenedEpisodes.includes(String(currentEpisode.id))
      ) {
        localStorage.setItem(
          "listenedEpisodes",
          JSON.stringify([...listenedEpisodes, String(currentEpisode.id)])
        );
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentEpisode]);

  React.useEffect(() => {
    window.onbeforeunload = currentEpisode
      ? () => "Are you sure you want to leave while audio is playing?"
      : null;
    return () => {
      window.onbeforeunload = null;
    };
  }, [currentEpisode]);

  return (
    <div className="audio-player">
      {currentEpisode ? (
        <>
          <p>{currentEpisode.title}</p>
          <audio ref={audioRef} src={currentEpisode.file} controls autoPlay />
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </>
      ) : (
        <p>No episode playing</p>
      )}
    </div>
  );
}

export default AudioPlayer;
