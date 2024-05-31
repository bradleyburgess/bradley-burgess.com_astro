import YouTubeIcon from "./YouTubeIcon";
import TelegramIcon from "./TelegramIcon";
import TikTokIcon from "./TikTokIcon";

import { contactLinks } from "../config";

const socialsMap = {
  YouTube: <YouTubeIcon />,
  TikTok: <TikTokIcon />,
  Telegram: <TelegramIcon />,
};

const SocialLinks = () => (
  <ul className="mt-14 flex justify-center gap-6 lg:justify-start">
    {contactLinks.map((item) => (
      <li style={{ "--brand-color": item.color }}>
        <a href={item.link}>
          <span class="inline-block aspect-square w-14 rounded-full bg-gray-800 p-3 transition-all duration-150 ease-in-out hover:bg-[var(--brand-color)]">
            {socialsMap[item.name]}
          </span>
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
