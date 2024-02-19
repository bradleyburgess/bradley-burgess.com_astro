import { useRef } from "preact/hooks";

interface Props {
  src: string;
  subtitlesSrc: string;
  height: number;
  width: number;
}

export default function Video({ src, subtitlesSrc, height, width }: Props) {
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
      width={width}
      height={height}
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
