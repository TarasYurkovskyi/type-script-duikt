import type { Lesson, Course } from "../types/models";
import type { CourseType } from "../types/base";

/**
 * Відсоток використання аудиторії
 */
export function getClassroomUtilization(
  classroomNumber: string,
  schedule: Lesson[]
): number {
  const totalSlotsPerWeek = 5 * 5; // 5 днів, 5 слотів на день
  const usedSlots = schedule.filter(l => l.classroomNumber === classroomNumber).length;
  return (usedSlots / totalSlotsPerWeek) * 100;
}

/**
 * Визначає найпопулярніший тип занять
 */
export function getMostPopularCourseType(courses: Course[]): CourseType | null {
  if (courses.length === 0) return null;

  const count: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0
  };

  for (const course of courses) {
    count[course.type]++;
  }

  let maxType: CourseType = "Lecture";
  let maxCount = count[maxType];

  (["Seminar", "Lab", "Practice"] as CourseType[]).forEach(type => {
    if (count[type] > maxCount) {
      maxType = type;
      maxCount = count[type];
    }
  });

  return maxType;
}
