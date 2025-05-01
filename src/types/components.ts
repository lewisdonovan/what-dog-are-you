import { BreedMatch } from "./api";

// Component prop types
export interface MatchResult extends BreedMatch {}

export interface PhotoUploaderProps {
  onPhotoSelect: (file: File) => void;
  isProcessing?: boolean;
}

export interface ResultsDisplayProps {
  result?: MatchResult;
  isLoading?: boolean;
} 