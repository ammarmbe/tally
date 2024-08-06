export function calculatePercentage(
  attended: number,
  missed: number,
  cancelled: number,
  countCancelledCourses: "NONE" | "ATTENDED" | "MISSED" | undefined,
  attendanceAsPercentage: boolean | undefined
) {
  let percentage =
    ((attended + (countCancelledCourses === "ATTENDED" ? cancelled : 0)) /
      (missed +
        attended +
        (countCancelledCourses !== "NONE" ? cancelled : 0))) *
    100;

  if (isNaN(percentage)) {
    percentage = 100;
  }

  const attendance =
    attendanceAsPercentage === false
      ? {
          label: `${
            attended + (countCancelledCourses === "ATTENDED" ? cancelled : 0)
          } / ${missed + attended + (countCancelledCourses !== "NONE" ? cancelled : 0)}`,
          percentage: Math.round(percentage)
        }
      : {
          label: Math.round(percentage).toString(),
          percentage: Math.round(percentage)
        };

  return attendance;
}
