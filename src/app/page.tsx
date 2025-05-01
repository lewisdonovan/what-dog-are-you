"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUploader } from "@/components/PhotoUploader";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Toaster, toast } from "sonner";
import type { MatchResult } from "@/types/components";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MatchResult | undefined>(undefined);

  const handlePhotoSelect = async (file: File) => {
    try {
      setIsProcessing(true);
      setResult(undefined);
      
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/analyse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyse photo");
      }

      setResult(data.match);
      
    } catch (error) {
      console.error("Error processing photo:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process your photo. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container mx-auto min-h-screen py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>What Dog Breed Are You?</CardTitle>
          <CardDescription>
            Upload your photo and our AI will tell you which dog breed you look like!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PhotoUploader 
            onPhotoSelect={handlePhotoSelect}
            isProcessing={isProcessing}
          />
          <ResultsDisplay 
            result={result} 
            isLoading={isProcessing && !result}
          />
        </CardContent>
      </Card>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          className: 'text-sm font-medium',
        }}
      />
    </main>
  );
} 