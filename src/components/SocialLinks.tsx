import MusicIcon from "./MusicIcon";
import SpotifyIcon from "./SpotifyIcon";
import TelegramIcon from "./TelegramIcon";
import TikTokIcon from "./TikTokIcon";
import YouTubeIcon from "./YouTubeIcon";

import { contactLinks } from "../config";

const socialsMap = {
  "Apple Music": <MusicIcon />,
  Spotify: <SpotifyIcon />,
  Telegram: <TelegramIcon />,
  TikTok: <TikTokIcon />,
  YouTube: <YouTubeIcon />,
};

const SocialLinks = () => (
  <ul className="mt-14 flex flex-wrap justify-center gap-6 px-10 lg:justify-start lg:px-0">
    {contactLinks.map((item) => (
      <li style={{ "--brand-color": item.color }}>
        <a href={item.link} title={item.name}>
          <span class="inline-block aspect-square w-14 rounded-full bg-gray-800 p-3 transition-all duration-150 ease-in-out hover:bg-[var(--brand-color)]">
            {socialsMap[item.name]}
          </span>
          <span class="sr-only">{item.name}</span>
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
