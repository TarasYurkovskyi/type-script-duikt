import type { DayOfWeek, TimeSlot, CourseType } from "./base";

export type Professor = {
  id: number;
  name: string;
  department: string;
};

export type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

export type Course = {
  id: number;
  name: string;
  type: CourseType;
};

export type Lesson = {
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

export type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson;
};
