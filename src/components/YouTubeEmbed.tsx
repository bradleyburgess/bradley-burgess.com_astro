type Props = {
  src: string;
};
const YouTubeEmbed = ({ src }: Props) => (
  <div className="full-bleed aspect-video">
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
  </div>
);

export default YouTubeEmbed;
