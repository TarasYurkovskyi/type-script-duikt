import { Lesson, Classroom } from "../types/models";

/**
 * Повертає список номерів вільних аудиторій
 */
export function findAvailableClassrooms(
  classrooms: Classroom[],
  schedule: Lesson[],
  timeSlot: string,
  dayOfWeek: string
): string[] {
  // всі заняті аудиторії у цей слот
  const occupied = schedule
    .filter(l => l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek)
    .map(l => l.classroomNumber);

  // повертаємо номери, яких нема в зайнятих
  return classrooms
    .map(c => c.number)
    .filter(number => occupied.indexOf(number) === -1);
}


/**
 * Повертає розклад конкретного професора
 */
export function getProfessorSchedule(
  professorId: number,
  schedule: Lesson[]
): Lesson[] {
  return schedule.filter(l => l.professorId === professorId);
}
