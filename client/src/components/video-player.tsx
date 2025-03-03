import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function VideoPlayer({ url }: { url: string }) {
  return (
    <AspectRatio ratio={16/9}>
      <video
        controls
        className="w-full h-full rounded-lg"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </AspectRatio>
  );
}
