import {
  FaYoutube,
  FaItunesNote,
  FaTiktok,
  FaTelegram,
  FaBluesky,
  FaSpotify,
} from "react-icons/fa6";

import { contactLinks } from "../config";

const socialsMap = {
  "Apple Music": <FaItunesNote size={30} />,
  BlueSky: <FaBluesky size={30} />,
  Spotify: <FaSpotify size={30} />,
  Telegram: <FaTelegram size={30} />,
  TikTok: <FaTiktok size={30} />,
  YouTube: <FaYoutube size={30} />,
};

const SocialLinks = () => (
  <ul className="mt-14 flex flex-wrap justify-center gap-6 px-10 lg:justify-start lg:px-0">
    {contactLinks.map((item) => (
      <li style={{ "--brand-color": item.color }}>
        <a href={item.link} title={item.name}>
          <span class="inline-block flex aspect-square w-14 items-center justify-center rounded-full bg-gray-800 p-3 transition-all duration-150 ease-in-out hover:bg-[var(--brand-color)]">
            {socialsMap[item.name]}
          </span>
          <span class="sr-only">{item.name}</span>
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
