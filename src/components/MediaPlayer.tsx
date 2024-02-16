import { useEffect, useRef, useState, Suspense, lazy } from "react";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
const Plyr = lazy(() => import("plyr-react"));
import "plyr-react/plyr.css";
import FilmStripPng from "@assets/img/backgrounds/filmstrip.png";
import SoundWavePng from "@assets/img/backgrounds/soundwave.png";

interface IPlaylistItem {
  catalog?: string;
  composer: string;
  date?: string;
  list: string;
  live?: boolean;
  location?: string;
  notes: string;
  tags: string[];
  title: string;
  type: "audio" | "youtube";
  url: string;
}

interface IPlaylist {
  heading: string;
  playlist: IPlaylistItem[];
}

interface IMediaPlayerProps {
  playlists: IPlaylist[];
}

interface IPlaylistProps extends IPlaylist {
  clickHandler: (playlistItem: IPlaylistItem) => void;
  currentTrack: IPlaylistItem;
}

type TPlaylistColumn = "composer" | "title" | "tags";
const playlistColumns: TPlaylistColumn[] = ["composer", "title", "tags"];
type TMaxWidthsState = Map<TPlaylistColumn, number>;

export default function MediaPlayer({ playlists }: IMediaPlayerProps) {
  const [maxWidths, setMaxWidths] = useState<TMaxWidthsState>();
  const [currentTrack, setCurrentTrack] = useState<IPlaylistItem>(
    playlists[0].playlist[0],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handlePlaylistItemClick(item: IPlaylistItem) {
    setCurrentTrack(item);
    if (!isPlaying) setIsPlaying(true);
  }

  useEffect(() => {
    if (containerRef.current && !maxWidths) {
      const _widthsMap: TMaxWidthsState = new Map();
      playlistColumns.forEach((column) => {
        const elems = containerRef.current!.querySelectorAll<HTMLSpanElement>(
          `span[data-${column}`,
        );
        const maxWidth = Array.from(elems).reduce<number>(
          (a, c) => (c.offsetWidth > a ? c.offsetWidth : a),
          0,
        );
        _widthsMap.set(column, Math.ceil(maxWidth) + 1);
      });
      setMaxWidths(_widthsMap);
    }
  }, [maxWidths]);

  return (
    <div
      className="grid gap-y-16"
      ref={containerRef}
      style={
        {
          "--composer-width": maxWidths?.get("composer") + "px" ?? "auto",
          "--title-width": maxWidths?.get("title") + "px" ?? "auto",
          "--tags-width": maxWidths?.get("tags") + "px" ?? "auto",
        } as CSSProperties
      }
    >
      <div
        className={`relative grid place-items-center after:absolute after:left-0 after:top-[20%] after:-z-10 after:h-[60%] after:w-full ${currentTrack.type === "youtube" ? "after:bg-[url('/img/backgrounds/filmstrip.png')]" : "after:bg-[url('/img/backgrounds/soundwave.png')]"} after:bg-neutral-800 after:bg-contain after:bg-center`}
      >
        <div
          className={`aspect-video w-full 2xl:max-w-2xl ${currentTrack.type === "audio" ? "2xl:flex 2xl:flex-col 2xl:items-stretch 2xl:justify-center" : ""}`}
        >
          <Suspense fallback={<div>Loading media player...</div>}>
            <Plyr
              options={{
                autoplay: isPlaying,
              }}
              source={
                currentTrack.type === "youtube"
                  ? {
                      type: "video",
                      sources: [
                        {
                          provider: "youtube",
                          src: currentTrack.url.split("=")[1],
                        },
                      ],
                    }
                  : {
                      type: "audio",
                      sources: [
                        {
                          src: currentTrack.url,
                          type: "audio/mp4",
                        },
                      ],
                    }
              }
            />
          </Suspense>
        </div>
      </div>
      <div className="grid 2xl:grid-cols-12 2xl:gap-x-6">
        <div className="grid gap-y-10 2xl:col-span-8">
          {playlists.map((list) => (
            <Playlist
              {...list}
              currentTrack={currentTrack}
              clickHandler={handlePlaylistItemClick}
              key={list.heading}
            />
          ))}
        </div>
        <div className="flex flex-col gap-y-4 2xl:col-span-4">
          <h3 className="font-alternate text-2xl font-semibold">
            Now Playing.
          </h3>
          <h4>
            {currentTrack.composer}: {currentTrack.title}
          </h4>
          {(currentTrack.location || currentTrack.date) && (
            <p>
              Recorded {currentTrack.live && "live"}
              {currentTrack.date && " on " + currentTrack.date}.{" "}
              {currentTrack.location && <br />}
              {currentTrack.location && currentTrack.location + "."}
            </p>
          )}
          <div
            className="prose prose-gray prose-invert"
            dangerouslySetInnerHTML={{ __html: currentTrack.notes }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function Playlist(props: IPlaylistProps) {
  const { heading, playlist, clickHandler, currentTrack } = props;

  function createClickHandler(
    item: IPlaylistItem,
  ): MouseEventHandler<HTMLAnchorElement> {
    return function (e) {
      e.preventDefault();
      clickHandler(item);
    };
  }

  return (
    <div className="grid gap-y-4">
      <h3 className="font-alternate text-2xl font-semibold">{heading}</h3>
      <ul>
        {playlist.map((item, index) => (
          <li className="py-2 xl:py-1" key={item.list + index}>
            {currentTrack == item && <NowPlayingIcon />}
            <a
              href={item.url}
              className="2xl:flex 2xl:gap-x-4"
              onClick={createClickHandler(item)}
            >
              <span
                data-composer
                className="inline-block font-semibold 2xl:w-[--composer-width]"
              >
                {item.composer}:{" "}
              </span>
              <span data-title className="inline-block 2xl:w-[--title-width]">
                {item.title}{" "}
              </span>
              <span
                data-tags
                className="inline-block font-alternate font-extralight italic 2xl:w-[--tags-width]"
              >
                ({item.tags.join(", ")})
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const NowPlayingIcon = () => (
  <span className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="absolute -left-5 top-2 aspect-square h-3 animate-pulse fill-current"
    >
      <path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
    </svg>
  </span>
);

const SoundWaveSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    viewBox="0 0 3273 749"
    className="h-full"
  >
    <path d="M3034.36,368.21h-21.65v8.17h21.65v-8.17Zm29.53,0h-21.65v8.17h21.65v-8.17Zm29.53,0h-21.65v8.17h21.65v-8.17Z" />
    <path d="M2148.46,376.38h-21.65v-8.17h21.65v8.17Zm29.53-45.33h-21.65v82.48h21.65v-82.48Zm29.53-51.19h-21.65v184.86h21.65v-184.86Z" />
    <path d="M2650.47,368.21h-21.65v8.17h21.65v-8.17Zm-29.53-158.13h-21.65v324.42h21.65V210.08Zm-29.53-85.62h-21.65v495.67h21.65V124.46Z" />
    <path d="M2502.82,57.18h-21.65V687.4h21.65V57.18Zm59.06,0h-21.65V687.4h21.65V57.18Zm-29.53-52.6h-21.65V740h21.65V4.59Z" />
    <path d="M2680,325.06h-21.65v94.47h21.65v-94.47Zm59.06-200.6h-21.65v495.67h21.65V124.46Zm-29.53,114.98h-21.65V505.15h21.65V239.44Z" />
    <path d="M2266.58,239.44h-21.65V505.15h21.65V239.44Zm29.53-89.29h-21.65v444.3h21.65V150.15Zm-59.06,71.31h-21.65v301.67h21.65V221.46Z" />
    <path d="M2384.7,368.21h-21.65v8.17h21.65v-8.17Zm-59.06-139.94h-21.65v288.05h21.65V228.27Zm29.53,87.58h-21.65v112.9h21.65v-112.9Z" />
    <path d="M2827.65,267.57h-21.65v209.44h21.65v-209.44Zm-59.06-117.43h-21.65v444.3h21.65V150.15Zm29.53,149.23h-21.65v145.84h21.65v-145.84Z" />
    <path d="M2886.71,267.57h-21.65v209.44h21.65v-209.44Zm-29.53-28.13h-21.65V505.15h21.65V239.44Zm59.06,59.94h-21.65v145.84h21.65v-145.84Z" />
    <path d="M3004.83,353.76h-21.65v37.07h21.65v-37.07Zm-29.53-28.7h-21.65v94.47h21.65v-94.47Zm-29.53-25.69h-21.65v145.84h21.65v-145.84Z" />
    <path d="M2443.76,175.83h-21.65v392.92h21.65V175.83Zm29.53-51.37h-21.65v495.67h21.65V124.46Zm-59.06,174.92h-21.65v145.84h21.65v-145.84Z" />
    <path d="M479.85,379.14h-22.45v-8.48h22.45v8.48Zm30.61-8.48h-22.45v8.48h22.45v-8.48Zm30.61,0h-22.45v8.48h22.45v-8.48Z" />
    <path d="M1122.66,370.67h-22.45v8.48h22.45v-8.48Zm30.61,0h-22.45v8.48h22.45v-8.48Zm30.61,0h-22.45v8.48h22.45v-8.48Z" />
    <path d="M694.12,370.67h-22.45v8.48h22.45v-8.48Zm30.61,0h-22.45v8.48h22.45v-8.48Zm-61.22-62.42h-22.44v133.32h22.44v-133.32Z" />
    <path d="M755.34,370.67h-22.45v8.48h22.45v-8.48Zm30.61,0h-22.45v8.48h22.45v-8.48Zm30.61-62.42h-22.44v133.32h22.44v-133.32Z" />
    <path d="M296.19,227.11h-22.44v295.59h22.44V227.11Zm61.22,0h-22.44v295.59h22.44V227.11Zm-30.61-39.7h-22.44v375h22.44V187.4Z" />
    <path d="M1000.21,227.11h-22.44v295.59h22.44V227.11Zm-61.22-129.47h-22.44V652.17h22.44V97.64Zm30.61-36.25h-22.44V688.42h22.44V61.39Z" />
    <path d="M204.36,25.13h-22.44V724.67h22.44V25.13Zm30.61,36.25h-22.44V688.42h22.44V61.39Zm30.61,210.61h-22.44v205.82h22.44v-205.82Z" />
    <path d="M449.23,308.24h-22.44v133.32h22.44v-133.32Zm-61.22-36.25h-22.44v205.82h22.44v-205.82Zm30.61,0h-22.44v205.82h22.44v-205.82Z" />
    <path d="M571.67,308.24h-22.44v133.32h22.44v-133.32Zm30.61,0h-22.44v133.32h22.44v-133.32Zm30.61-36.25h-22.44v205.82h22.44v-205.82Z" />
    <path d="M908.38,145.97h-22.44v457.86h22.44V145.97Zm-30.61,41.43h-22.44v375h22.44V187.4Zm-30.61,84.59h-22.44v205.82h22.44v-205.82Z" />
    <path d="M1092.04,227.11h-22.44v295.59h22.44V227.11Zm-61.22-39.7h-22.44v375h22.44V187.4Zm30.61,84.59h-22.44v205.82h22.44v-205.82Z" />
    <path d="M1468.25,528.77h-19.72V221.28h19.72v307.49Zm-30.59-388.64h-19.72v469.79h19.72V140.13Zm-30.59-63.76h-19.72V673.69h19.72V76.37Z" />
    <path d="M1315.29,609.92h-19.72V140.13h19.72v469.79Zm30.59-533.55h-19.72V673.69h19.72V76.37Zm30.59-49.85h-19.72V723.54h19.72V26.52Z" />
    <path d="M1682.4,474.28h-19.72v-198.51h19.72v198.51Zm61.18-198.51h-19.72v198.51h19.72v-198.51Zm-30.59-26.66h-19.72v251.84h19.72V249.11Z" />
    <path d="M1590.62,609.92h-19.72V140.13h19.72v469.79Zm30.59-445.45h-19.72v421.1h19.72V164.48Zm30.59,141.44h-19.72v138.23h19.72v-138.23Z" />
    <path d="M1835.36,419.79h-19.72v-89.53h19.72v89.53Zm-61.18-113.88h-19.72v138.23h19.72v-138.23Zm30.59,0h-19.72v138.23h19.72v-138.23Z" />
    <path d="M1957.73,419.79h-19.72v-89.53h19.72v89.53Zm30.59-89.53h-19.72v89.53h19.72v-89.53Zm30.59-24.35h-19.72v138.23h19.72v-138.23Z" />
    <path d="M1284.7,561.23h-19.72V188.82h19.72v372.41Zm-30.59-255.32h-19.72v138.23h19.72v-138.23Zm-30.59,64.89h-19.72v8.45h19.72v-8.45Z" />
    <path d="M1529.44,419.79h-19.72v-89.53h19.72v89.53Zm30.59-170.69h-19.72v251.84h19.72V249.11Zm-61.18,121.7h-19.72v8.45h19.72v-8.45Z" />
    <path d="M1865.95,379.25h-19.72v-8.45h19.72v8.45Zm30.59-8.45h-19.72v8.45h19.72v-8.45Zm30.59,0h-19.72v8.45h19.72v-8.45Z" />
    <path d="M2049.5,419.79h-19.72v-89.53h19.72v89.53Zm61.18-48.99h-19.72v8.45h19.72v-8.45Zm-30.59,0h-19.72v8.45h19.72v-8.45Z" />
  </svg>
);
