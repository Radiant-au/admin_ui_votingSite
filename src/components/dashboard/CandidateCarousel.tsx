import { CandidateCard } from './CandidateCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Crown, Sparkles } from 'lucide-react';
import { CandidateWithType, useVoteData } from '@/hooks/useVoteData';

type CandidateType = 'king' | 'queen' | 'prince' | 'princess';

interface CandidateCarouselProps {
  title: string;
  type: CandidateType;
}

const typeConfig = {
  king: { icon: Crown, color: 'text-primary' },
  queen: { icon: Crown, color: 'text-primary' },
  prince: { icon: Sparkles, color: 'text-accent' },
  princess: { icon: Sparkles, color: 'text-accent' },
};

export function CandidateCarousel({ title, type }: CandidateCarouselProps) {
  const { getCandidatesByType, getVotePercentage, isLoading } = useVoteData();
  
  const config = typeConfig[type];
  const Icon = config.icon;

  const candidates = getCandidatesByType(type);

  // Group candidates into pairs for 2-column layout
  const candidatePairs: CandidateWithType[][] = [];
  for (let i = 0; i < candidates.length; i += 2) {
    candidatePairs.push(candidates.slice(i, i + 2));
  }

  if (isLoading) {
    return (
      <section className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted animate-pulse rounded-lg" />
          <div className="h-7 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
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
                    key={candidate.selectionId} 
                    candidate={candidate}
                    percentage={getVotePercentage(candidate.selectionId)}
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