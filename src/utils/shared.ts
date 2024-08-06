export function calculatePercentage(
  attended: number,
  missed: number,
  attendanceAsPercentage: boolean | undefined
) {
  let percentage = (attended / (missed + attended)) * 100;

  if (isNaN(percentage)) {
    percentage = 100;
  }

  const attendance =
    attendanceAsPercentage === false
      ? {
          label: `${attended} / ${missed + attended}`,
          percentage: Math.round(percentage)
        }
      : {
          label: Math.round(percentage).toString(),
          percentage: Math.round(percentage)
        };

  return attendance;
}
