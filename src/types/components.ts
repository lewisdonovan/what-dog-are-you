import { BreedMatch } from './api';

// Component prop types
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MatchResult extends BreedMatch {}

export interface PhotoUploaderProps {
  onPhotoSelect: (file: File) => void;
  isProcessing?: boolean;
}

export interface ResultsDisplayProps {
  result?: MatchResult;
  isLoading?: boolean;
}
