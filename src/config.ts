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
  { name: "album", href: "/#section-album" },
  { name: "tracks", href: "/#section-tracks" },
  { name: "teaching", href: "/#section-teaching" },
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

export type TSocialMediaNetwork =
  | "AppleMusic"
  | "Spotify"
  | "Telegram"
  | "TikTok"
  | "YouTube";
export type TStreamingPlatform = "Spotify" | "Youtube Music" | "Apple Music";

export type TStreamingLink = {
  platform: TStreamingPlatform;
  link: string;
  color: string;
  label: string;
};

export const contactLinks: TContactLink[] = [
  {
    name: "Spotify",
    handle: "3Aw9EUZeowrpaCpQ2Ry8D6",
    link: "https://open.spotify.com/album/6mS3gueOkxGS8f6vsd3cOW",
    color: "#1ed760",
  },
  {
    name: "YouTube",
    handle: "@bburgess_keys",
    link: "https://www.youtube.com/@bburgess_keys",
    color: "#FF0000",
  },
  {
    name: "AppleMusic",
    handle: "",
    link: "https://music.apple.com/us/album/j-s-bach-orgelb%C3%BCchlein-bradley-burgess-organist/1790286587",
    color: "#FF4E6B",
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
