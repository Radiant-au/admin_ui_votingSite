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

  // Group candidates into pairs for 2-column layout
  const candidatePairs: UTSelection[][] = [];
  for (let i = 0; i < candidates.length; i += 2) {
    candidatePairs.push(candidates.slice(i, i + 2));
  }

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
          {candidatePairs.map((pair, pairIndex) => (
            <CarouselItem key={pairIndex} className="pl-2 md:pl-4 basis-full">
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {pair.map((candidate, index) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    index={pairIndex * 2 + index} 
                  />
                ))}
                {/* Add empty placeholder if odd number */}
                {pair.length === 1 && <div className="hidden" />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2 md:-left-4 bg-card border-primary/30 text-primary hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10" />
        <CarouselNext className="-right-2 md:-right-4 bg-card border-primary/30 text-primary hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10" />
      </Carousel>
    </section>
  );
}
