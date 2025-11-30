import type { Lesson } from "../types/models";

export function addLesson(schedule: Lesson[], lesson: Lesson): boolean {
  const duplicate = schedule.some(
    l =>
      l.courseId === lesson.courseId &&
      l.professorId === lesson.professorId &&
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot
  );
  if (duplicate) {
    console.warn("Duplicate lesson detected");
    return false;
  }

  const conflict = schedule.some(
    l =>
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot &&
      (l.professorId === lesson.professorId ||
       l.classroomNumber === lesson.classroomNumber)
  );

  if (conflict) {
    console.warn("Lesson conflicts with existing schedule");
    return false;
  }

  schedule.push(lesson);
  return true;
}
