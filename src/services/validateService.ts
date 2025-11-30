import { Lesson, ScheduleConflict } from "../types/models";

export function validateLesson(
  lesson: Lesson,
  schedule: Lesson[]
): ScheduleConflict | null {
  // Конфлікт по професору
  const professorConflict = schedule.find(
    l =>
      l.professorId === lesson.professorId &&
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot
  );
  if (professorConflict) {
    return { type: "ProfessorConflict", lessonDetails: professorConflict };
  }

  // Конфлікт по аудиторії
  const classroomConflict = schedule.find(
    l =>
      l.classroomNumber === lesson.classroomNumber &&
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot
  );
  if (classroomConflict) {
    return { type: "ClassroomConflict", lessonDetails: classroomConflict };
  }

  return null; // Конфліктів немає
}
