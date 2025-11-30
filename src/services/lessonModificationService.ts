import type { Lesson } from "../types/models";
import { validateLesson } from "./validateService";

/**
 * Змінює аудиторію для заняття, якщо це можливо
 */
export function reassignClassroom(
    lessonId: number,
    newClassroomNumber: string,
    schedule: Lesson[]
  ): boolean {
    const lessonIndex = schedule.findIndex((_, idx) => idx === lessonId);
    if (lessonIndex === -1) return false;
  
    const oldLesson = schedule[lessonIndex]!; // non-null assertion
    const updatedLesson: Lesson = {
      courseId: oldLesson.courseId,
      professorId: oldLesson.professorId,
      classroomNumber: newClassroomNumber,
      dayOfWeek: oldLesson.dayOfWeek,
      timeSlot: oldLesson.timeSlot
    };
  
    if (!validateLesson(updatedLesson, schedule)) {
      schedule[lessonIndex] = updatedLesson;
      return true;
    }
  
    return false; // конфлікт
}

/**
 * Видаляє заняття з розкладу
 */
export function cancelLesson(
  lessonId: number,
  schedule: Lesson[]
): void {
  const index = schedule.findIndex((l, idx) => idx === lessonId);
  if (index !== -1) {
    schedule.splice(index, 1);
  }
}
