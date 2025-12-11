import { UTSelection, CandidateType } from '@/types';
import { CandidateCard } from './CandidateCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Crown, Sparkles } from 'lucide-react';

interface CandidateCarouselProps {
  candidates: UTSelection[];
  title: string;
  type: CandidateType;
}

const typeConfig = {
  king: { icon: Crown, color: 'text-primary' },
  queen: { icon: Crown, color: 'text-primary' },
  prince: { icon: Sparkles, color: 'text-accent' },
  princess: { icon: Sparkles, color: 'text-accent' },
};

export function CandidateCarousel({ candidates, title, type }: CandidateCarouselProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <section className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <h2 className="text-xl font-display golden-text">{title}</h2>
        <span className="text-sm text-muted-foreground">({candidates.length} candidates)</span>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {candidates.map((candidate, index) => (
            <CarouselItem key={candidate.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <CandidateCard candidate={candidate} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 bg-card border-primary/30 text-primary hover:bg-primary/10" />
        <CarouselNext className="hidden md:flex -right-4 bg-card border-primary/30 text-primary hover:bg-primary/10" />
      </Carousel>
    </section>
  );
}
