import { useRef } from "preact/hooks";

interface Props {
  src: string;
  subtitlesSrc: string;
}

export default function Video({ src, subtitlesSrc }: Props) {
  const ref = useRef(null);
  function handleClick(e: Event) {
    const target = e.target as HTMLVideoElement;
    if (target.paused) return target.play();
    return target.pause();
  }

  return (
    <video
      disableRemotePlayback
      autoPlay
      muted
      onClick={handleClick}
      ref={ref}
      loop
    >
      <source src={src} />
      <track
        label="English"
        kind="subtitles"
        srclang="en"
        default
        src={subtitlesSrc}
      />
    </video>
  );
}
