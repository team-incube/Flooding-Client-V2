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
    <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-black">
      <iframe
        key={`${videoId}-${start}-${autoPlay ? 1 : 0}`}
        src={`https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=${autoPlay ? 1 : 0}`}
        title="YouTube video player"
        className="size-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
