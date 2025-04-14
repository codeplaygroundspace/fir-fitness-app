// Declare server action functions as regular functions
declare namespace ServerActions {
  // app/actions.ts
  function getWarmupExercises(): Promise<any[]>
  function getStretchExercises(): Promise<any[]>
  function getFitExercises(): Promise<any[]>
  function getExerciseById(id: number): Promise<any>
  function getExercisesByType(type: "warmup" | "stretch" | "fit"): Promise<any[]>
  function getExerciseGroups(): Promise<any[]>
  function getExercisesByGroup(groupId: number): Promise<any[]>

  // app/admin/actions.ts
  function getCategories(): Promise<any[]>
  function createExercise(formData: FormData): Promise<any>
  function updateExercise(id: number, formData: FormData): Promise<any>
  function deleteExercise(id: number): Promise<any>
  function getExerciseForEdit(id: number): Promise<any>

  // app/profile/actions.ts
  function getUserWorkouts(userId: string): Promise<any[]>
  function toggleWorkoutDay(userId: string, date: string, completed: boolean): Promise<any>
}
