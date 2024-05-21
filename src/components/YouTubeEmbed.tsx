import { useEffect, useRef, useState } from "preact/hooks";
import { useInView } from "react-intersection-observer";
import { Suspense, lazy } from "preact/compat";
// const Plyr = lazy(() => import("plyr-react"));

type Props = {
  src: string;
};
const YouTubeEmbed = ({ src }: Props) => {
  const { inView, ref } = useInView({
    triggerOnce: true,
  });

  return (
    <Suspense fallback={() => <div>Loading player ...</div>}>
      <div className="full-bleed aspect-video" ref={ref}>
        {inView && (
          <iframe
            className="h-full w-full"
            width="100%"
            src={src}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </Suspense>
  );
};

export default YouTubeEmbed;
