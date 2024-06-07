import webpush from "web-push";
import dayjs from "dayjs";

const sendPushNotification = async (course: {
  course_name: string;
  id: string;
  start: string;
  room: string;
  subscription: string;
  user_id: string;
}) => {
  if (!course) {
    console.log("no course passed");
    return;
  }

  if (!course.subscription) {
    console.log("no subscription passed");
    return;
  }

  const payload = JSON.stringify({
    title: course.course_name,
    body: `You have a class at ${dayjs(dayjs().format("YYY-MM-DD ") + course.start).format("hh:mm A")}${course.room ? ` in ${course.room}` : ""}`,
    icon: "/images/icon-192x192.png",
    badge: "/images/badge.png",
  });

  webpush.setVapidDetails(
    "https://tally.ambe.dev",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
  );

  const result = await webpush.sendNotification(
    course.subscription as any,
    payload,
  );

  console.log(result);
};

export default sendPushNotification;
