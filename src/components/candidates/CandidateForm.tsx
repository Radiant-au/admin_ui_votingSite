import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UTSelection, Category, Gender, CandidateType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ImagePlus, X } from 'lucide-react';
import { useCreateCandidate, useUpdateCandidate } from '@/hooks/useCandidates';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female']),
  category: z.enum(['king-queen', 'prince-princess']),
  candidateType: z.enum(['king', 'queen', 'prince', 'princess']),
  major: z.string().min(2, 'Major is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  profileImg: z.string().url('Must be a valid URL'),
});

type FormData = z.infer<typeof schema>;

interface CandidateFormProps {
  open: boolean;
  onClose: () => void;
  candidate?: UTSelection;
}

export function CandidateForm({ open, onClose, candidate }: CandidateFormProps) {
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const createCandidate = useCreateCandidate();
  const updateCandidate = useUpdateCandidate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: candidate ? {
      name: candidate.name,
      gender: candidate.gender,
      category: candidate.category,
      candidateType: candidate.candidateType,
      major: candidate.major,
      description: candidate.description,
      profileImg: candidate.profileImg,
    } : {
      gender: 'male',
      category: 'king-queen',
      candidateType: 'king',
    },
  });

  const profileImg = watch('profileImg');
  const watchGender = watch('gender');
  const watchCategory = watch('category');

  // Auto-set candidateType based on gender and category
  const getCandidateType = (gender: Gender, category: Category): CandidateType => {
    if (category === 'king-queen') {
      return gender === 'male' ? 'king' : 'queen';
    }
    return gender === 'male' ? 'prince' : 'princess';
  };

  const onSubmit = async (data: FormData) => {
    try {
      const candidateType = getCandidateType(data.gender, data.category);
      
      if (candidate) {
        await updateCandidate.mutateAsync({
          id: candidate.id,
          updates: { ...data, candidateType },
        });
        toast({ title: 'Candidate updated successfully!' });
      } else {
        await createCandidate.mutateAsync({
          name: data.name,
          gender: data.gender,
          category: data.category,
          candidateType,
          major: data.major,
          description: data.description,
          profileImg: data.profileImg,
        });
        toast({ title: 'Candidate added successfully!' });
      }
      reset();
      onClose();
    } catch (error) {
      toast({ title: 'Error saving candidate', variant: 'destructive' });
    }
  };

  const addImageUrl = () => {
    if (additionalImages.length < 3) {
      setAdditionalImages([...additionalImages, '']);
    }
  };

  const removeImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={() => { reset(); onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto golden-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-display golden-text">
            {candidate ? 'Edit Candidate' : 'Add New Candidate'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Profile Image Preview */}
          <div className="space-y-2">
            <Label className="text-foreground">Profile Image URL</Label>
            <Input
              placeholder="https://res.cloudinary.com/..."
              className="bg-secondary/50 border-border/50"
              {...register('profileImg')}
            />
            {errors.profileImg && (
              <p className="text-sm text-destructive">{errors.profileImg.message}</p>
            )}
            {profileImg && (
              <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary/30">
                <img
                  src={profileImg}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-foreground">Full Name</Label>
            <Input 
              placeholder="Enter candidate name"
              className="bg-secondary/50 border-border/50"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Gender & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Gender</Label>
              <Select 
                defaultValue={candidate?.gender || 'male'}
                onValueChange={(value: Gender) => setValue('gender', value)}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Category</Label>
              <Select 
                defaultValue={candidate?.category || 'king-queen'}
                onValueChange={(value: Category) => setValue('category', value)}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="king-queen">King & Queen</SelectItem>
                  <SelectItem value="prince-princess">Prince & Princess</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Auto Candidate Type Display */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              Candidate Type: <span className="text-primary font-semibold capitalize">
                {getCandidateType(watchGender, watchCategory)}
              </span>
            </p>
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label className="text-foreground">Major / Department</Label>
            <Input 
              placeholder="e.g., Computer Science"
              className="bg-secondary/50 border-border/50"
              {...register('major')}
            />
            {errors.major && (
              <p className="text-sm text-destructive">{errors.major.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-foreground">Description</Label>
            <Textarea 
              placeholder="Brief description of the candidate..."
              rows={3}
              className="bg-secondary/50 border-border/50"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Additional Images (Optional)</Label>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={addImageUrl}
                disabled={additionalImages.length >= 3}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <ImagePlus className="h-4 w-4 mr-1" />
                Add Image
              </Button>
            </div>
            <div className="space-y-2">
              {additionalImages.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    placeholder="Image URL"
                    className="bg-secondary/50 border-border/50"
                    value={img}
                    onChange={(e) => {
                      const newImages = [...additionalImages];
                      newImages[index] = e.target.value;
                      setAdditionalImages(newImages);
                    }}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeImage(index)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => { reset(); onClose(); }}
              className="flex-1 border-border/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 gradient-primary text-primary-foreground font-semibold"
            >
              {isSubmitting ? 'Saving...' : candidate ? 'Update' : 'Add Candidate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
