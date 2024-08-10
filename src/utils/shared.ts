import webpush from "web-push";
import dayjs from "dayjs";

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

export const sendClassUpcomingNotification = async (course: {
  subscription: string;
  name: string;
  start: string;
  room: string;
}) => {
  if (!course || !course.subscription) {
    return;
  }

  const payload = JSON.stringify({
    title: course.name,
    body: `You have a class at ${dayjs(dayjs().format("YYY-MM-DD ") + course.start).format("hh:mm A")}${course.room ? ` in ${course.room}` : ""}`,
    icon: "/images/icon-192x192.png",
    badge: "/images/badge.png"
  });

  webpush.setVapidDetails(
    "https://tally.ambe.dev",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
  );

  return await webpush.sendNotification(
    JSON.parse(course.subscription),
    payload
  );
};

export const sendLowAttendanceNotification = async (course: {
  subscription: string;
  name: string;
  start: string;
  room: string;
}) => {
  if (!course) {
    console.log("no course passed");
    return;
  }

  if (!course.subscription) {
    console.log("no endpoint passed");
    return;
  }

  const payload = JSON.stringify({
    title: `Low Attendance for ${course.name}`,
    body: `Your attendance for ${course.name} is low. Please consider attending the next class (${dayjs(dayjs().format("YYY-MM-DD ") + course.start).format("hh:mm A")}${course.room ? `, ${course.room}` : ""}).`,
    icon: "/images/icon-192x192.png",
    badge: "/images/badge.png"
  });

  webpush.setVapidDetails(
    "https://tally.ambe.dev",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
  );

  return await webpush.sendNotification(
    JSON.parse(course.subscription),
    payload
  );
};
