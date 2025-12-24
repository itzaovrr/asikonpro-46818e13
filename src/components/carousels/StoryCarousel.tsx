import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { StoryCircle } from "@/components/home/StoryCircle";
import { Story } from "@/types";

interface StoryCarouselProps {
  stories: Story[];
  className?: string;
}

export function StoryCarousel({ stories, className }: StoryCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 3,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <div className={cn("relative", className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3 px-4 lg:px-0">
          {stories.map((story, index) => (
            <div key={story.id} className="flex-shrink-0">
              <StoryCircle story={story} isFirst={index === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
