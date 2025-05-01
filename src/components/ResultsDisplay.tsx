'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResultsDisplayProps } from '@/types/components';
import { Badge } from '@/components/ui/badge';
import { PawPrint, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResultsDisplay({
  result,
  isLoading = false,
}: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 pt-0">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row">
          <Skeleton className="aspect-square w-full rounded-xl md:w-1/2" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="mt-4">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="mt-2 h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const confidencePercentage = Math.round(result.confidence * 100);
  const traits = result.description.split(',').map((t) => t.trim());

  return (
    <Card className="mt-8 overflow-hidden">
      <CardHeader className="relative">
        <div className="from-primary/10 absolute left-0 top-0 h-full w-full bg-gradient-to-br to-transparent" />
        <CardTitle className="relative flex items-center gap-2">
          <PawPrint className="text-primary h-6 w-6" />
          Your Dog Breed Match!
        </CardTitle>
        <CardDescription className="relative text-lg">
          You are a{' '}
          <span className="text-primary font-medium">
            {confidencePercentage}%
          </span>{' '}
          match with a {result.breed}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 pb-6 md:flex-row">
        <div className="relative w-full md:w-1/2">
          <div className="group relative aspect-square w-full">
            <Image
              src={result.imageUrl}
              alt={result.breed}
              fill
              className="rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-4 transform p-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <Heart className="h-5 w-5 text-red-400" /> {result.breed}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                <Star className="h-5 w-5 text-yellow-500" />
                Personality Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Match Confidence
              </h4>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn(
                    'absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out',
                    confidencePercentage >= 80
                      ? 'bg-green-500'
                      : confidencePercentage >= 60
                        ? 'bg-yellow-500'
                        : 'bg-orange-500'
                  )}
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600">
                {confidencePercentage}% Match
              </p>
            </div>

            {result.alternativeMatches &&
              result.alternativeMatches.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-700">
                    Alternative Matches
                  </h4>
                  <div className="space-y-2">
                    {result.alternativeMatches.map((match, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-2 transition-colors duration-200 hover:bg-gray-100"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {match.breed}
                        </span>
                        <Badge variant="outline">
                          {Math.round(match.confidence * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
