"use client";

import { useState, useEffect } from "react";
import { Shuffle, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DurationLabel } from "@/components/duration-label";
import { ExerciseCard } from "@/components/exercise-card";
import { getWarmupExercises, type ExerciseWithLabels } from "./actions";

export default function HomePage() {
  const [cardioExercises, setCardioExercises] = useState<ExerciseWithLabels[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isSingleColumn, setIsSingleColumn] = useState(false);

  useEffect(() => {
    async function loadExercises() {
      try {
        const exercises = await getWarmupExercises();
        setCardioExercises(exercises);
      } catch (error) {
        console.error("Error loading exercises:", error);
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, []);

  const shuffleExercises = () => {
    setCardioExercises((prevExercises) => {
      // Create a copy of the array
      const shuffled = [...prevExercises];

      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled;
    });
  };

  const toggleLayout = () => {
    setIsSingleColumn(!isSingleColumn);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6">Warmup</h1>

      <div className="mb-6 bg-accent p-4 rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">HR Rise (always do first)</h3>
          <DurationLabel duration="2 min" />
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Warmup Cardio</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLayout}
              className="flex items-center gap-1"
            >
              {isSingleColumn ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <LayoutList className="h-4 w-4" />
              )}
              {isSingleColumn ? "Grid" : "List"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shuffleExercises}
              className="flex items-center gap-1"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle
            </Button>
          </div>
        </div>

        {loading ? (
          <div
            className={`grid ${
              isSingleColumn ? "grid-cols-1" : "grid-cols-2"
            } gap-4`}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden h-full bg-muted animate-pulse"
              >
                <div className="aspect-video"></div>
                <div className="p-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cardioExercises.length > 0 ? (
          <div
            className={`grid ${
              isSingleColumn ? "grid-cols-1" : "grid-cols-2"
            } gap-4`}
          >
            {cardioExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/exercise"
                duration={`${exercise.duration} sec`}
                reps={exercise.reps}
                showLabels={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No warmup exercises found. Please add some exercises to get
              started.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
