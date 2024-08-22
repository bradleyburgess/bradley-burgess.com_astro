import TelegramIcon from "./components/TelegramIcon";
import YouTubeIcon from "./components/YouTubeIcon";
import TikTokIcon from "./components/TikTokIcon";

export const siteTitle = "Bradley Burgess";

export const siteTagline = "pianist & organist";

export const siteBaseUrl = "https://bradley-burgess.com";

export const siteDescription =
  "Bradley Burgess is a South African-born, Raleigh-based pianist, organist, and church musician, whose playing has been described as “spell-binding”.";

export const mainNavList = [
  { name: "bio", href: "/#section-bio" },
  { name: "music", href: "/#section-music" },
  { name: "teaching", href: "/#section-teaching" },
  { name: "album", href: "/ob" },
  // { name: "shop", href: "/shop" },
  // { name: "blog", href: "/blog" },
  { name: "contact", href: "/#section-contact" },
];

type TContactLink = {
  name: TSocialMediaNetwork;
  link: string;
  handle: string;
  color: string;
};

type TSocialMediaNetwork = "TikTok" | "Telegram" | "YouTube";

export const contactLinks: TContactLink[] = [
  {
    name: "YouTube",
    handle: "@bburgess_keys",
    link: "https://www.youtube.com/@bburgess_keys",
    color: "#FF0000",
  },
  {
    name: "TikTok",
    handle: "@bburgess_keys",
    link: "https://www.tiktok.com/@bburgess_keys",
    color: "#DE8C9D",
  },
  {
    name: "Telegram",
    handle: "@bburgess_keys",
    link: "https://t.me/bburgess_keys",
    color: "#24A1DE",
  },
];
