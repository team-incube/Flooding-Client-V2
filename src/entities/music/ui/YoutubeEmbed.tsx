interface YoutubeEmbedProps {
  videoId: string;
  start?: number;
  autoPlay?: boolean;
}

export function YoutubeEmbed({
  videoId,
  start = 0,
  autoPlay = false,
}: YoutubeEmbedProps) {
  return (
    <iframe
      key={`${videoId}-${start}-${autoPlay ? 1 : 0}`}
      src={`https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=${autoPlay ? 1 : 0}`}
      title="YouTube video player"
      className="aspect-video w-full rounded-xl border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
