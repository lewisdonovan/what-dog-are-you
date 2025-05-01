"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultsDisplayProps } from "@/types/components";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResultsDisplay({ result, isLoading = false }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 pt-0">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <Skeleton className="w-full md:w-1/2 aspect-square rounded-xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="mt-4">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-4 w-16 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const confidencePercentage = Math.round(result.confidence * 100);
  const traits = result.description.split(',').map(t => t.trim());

  return (
    <Card className="mt-8 overflow-hidden">
      <CardHeader className="relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
        <CardTitle className="relative flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-primary" />
          Your Dog Breed Match!
        </CardTitle>
        <CardDescription className="relative text-lg">
          You are a <span className="font-medium text-primary">{confidencePercentage}%</span> match with a {result.breed}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8 pb-6">
        <div className="relative w-full md:w-1/2">
          <div className="relative w-full aspect-square group">
            <Image
              src={result.imageUrl}
              alt={result.breed}
              fill
              className="object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" /> {result.breed}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Personality Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="text-sm py-1 px-3"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Match Confidence</h4>
              <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                    confidencePercentage >= 80 ? "bg-green-500" :
                    confidencePercentage >= 60 ? "bg-yellow-500" :
                    "bg-orange-500"
                  )}
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                {confidencePercentage}% Match
              </p>
            </div>
            
            {result.alternativeMatches && result.alternativeMatches.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Alternative Matches</h4>
                <div className="space-y-2">
                  {result.alternativeMatches.map((match, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium text-gray-700">{match.breed}</span>
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