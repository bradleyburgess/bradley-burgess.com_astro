import { useEffect, useRef, useState } from "preact/hooks";
import { useInView } from "react-intersection-observer";
import { Suspense, lazy } from "preact/compat";
const Plyr = lazy(() => import("plyr-react"));
import "plyr-react/plyr.css";

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
  const [hasJavascript, setHasJavascript] = useState(false);
  const {
    inView,
    ref: inViewRef,
    entry,
  } = useInView({
    triggerOnce: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function handlePlaylistItemClick(item: IPlaylistItem) {
    setCurrentTrack(item);
    if (!isPlaying) setIsPlaying(true);
    containerRef.current?.scrollIntoView();
  }

  function handleDetailsClick(e: MouseEvent) {
    if (window.innerWidth >= 1536) {
      e.preventDefault();
      (e.target as HTMLElement).setAttribute("open", "true");
    }
  }

  useEffect(() => {
    setHasJavascript(true);
  }, []);

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
  }, [maxWidths, hasJavascript]);

  useEffect(() => {
    if (detailsRef.current && window.innerWidth >= 1536) {
      detailsRef.current.setAttribute("open", "true");
    }
  });

  function handleResize(e: Event) {
    if (window.innerWidth >= 1536)
      detailsRef.current?.setAttribute("open", "true");
    if (window.innerWidth < 1024)
      detailsRef.current?.setAttribute("open", "false");
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return hasJavascript ? (
    <div
      className="grid gap-y-16"
      ref={containerRef}
      style={{
        "--composer-width": maxWidths
          ? maxWidths.get("composer") + "px"
          : "auto",
        "--title-width": maxWidths ? maxWidths.get("title") + "px" : "auto",
        "--tags-width": maxWidths ? maxWidths.get("tags") + "px" : "auto",
      }}
    >
      <div
        className={`relative grid place-items-center after:absolute after:-left-[1rem] after:left-[-1rem] after:top-[20%] after:-z-10 after:h-[60%] after:w-[calc(100%_+_2rem)] after:overflow-hidden ${currentTrack.type === "youtube" ? "after:bg-[url('/img/backgrounds/filmstrip.png')]" : "after:bg-[url('/img/backgrounds/soundwave.png')]"} after:bg-neutral-800 after:bg-contain after:bg-center`}
      >
        <div
          className={`aspect-video w-[calc(100%_+_2rem)] 2xl:w-full 2xl:max-w-2xl ${currentTrack.type === "audio" ? "flex flex-col items-stretch justify-center" : ""}`}
          ref={inViewRef}
        >
          {inView && (
            <Suspense fallback={() => <div>Loading player ...</div>}>
              {/* @ts-ignore-next-line */}
              <Plyr
                options={{
                  autoplay: isPlaying,
                  clickToPlay: true,
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
          )}
        </div>
      </div>
      <div className="grid gap-y-10 2xl:grid-cols-12 2xl:gap-x-6">
        <div className="lg::max-xl:grid-cols-2 order-2 grid gap-y-10 2xl:order-1 2xl:col-span-8">
          {playlists.map((list) => (
            <Playlist
              {...list}
              currentTrack={currentTrack}
              clickHandler={handlePlaylistItemClick}
              key={list.heading}
            />
          ))}
        </div>
        <div className="order-1 flex flex-col gap-y-4 2xl:order-2 2xl:col-span-4">
          <details
            onClick={handleDetailsClick}
            ref={detailsRef}
            className="rounded-3xl border-2 border-gray-300 p-4 2xl:border-0 [&_svg]:open:-rotate-180"
          >
            <summary className="flex cursor-pointer list-none justify-between 2xl:cursor-auto">
              <h3 className="font-alternate text-xl font-semibold">
                Now Playing.
              </h3>
              <CaretIcon />
            </summary>
            <div className="prose prose-sm prose-gray prose-invert mt-6">
              <h4>
                {currentTrack.composer}: {currentTrack.title}
                {currentTrack.catalog && `, ${currentTrack.catalog}`}.
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
                className="prose prose-sm prose-gray prose-invert"
                dangerouslySetInnerHTML={{ __html: currentTrack.notes }}
              ></div>
            </div>
          </details>
        </div>
      </div>
    </div>
  ) : (
    <div className="no-js-hidden">This requires Javascript.</div>
  );
}

export function Playlist(props: IPlaylistProps) {
  const { heading, playlist, clickHandler, currentTrack } = props;

  function createClickHandler(item: IPlaylistItem) {
    return function (e: MouseEvent) {
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
            <a
              href={item.url}
              className="flex flex-col items-start 2xl:flex-row 2xl:gap-x-4"
              onClick={createClickHandler(item)}
            >
              <span
                data-composer
                className="inline-block font-semibold 2xl:w-[--composer-width]"
              >
                {currentTrack == item && <NowPlayingIcon />}
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
  <span className="relative mr-2 inline-block 2xl:mr-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="aspect-square h-3 animate-pulse fill-current 2xl:absolute 2xl:-left-5 2xl:-top-3"
    >
      <path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
    </svg>
  </span>
);

const CaretIcon = () => (
  <svg
    class="relative top-2 rotate-0 transform text-gray-200 transition-all duration-300 2xl:hidden"
    fill="none"
    height="20"
    width="20"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
