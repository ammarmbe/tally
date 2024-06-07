import webpush from "web-push";
import sql from "./db";
import dayjs from "dayjs";

const sendPushNotification = async (
  course: {
    course_name: string;
    id: string;
    start: string;
    room: string;
    subscription: string;
    user_id: string;
  },
  userid: string,
) => {
  if (!course) {
    console.log("no course passed");
    return;
  }

  if (!userid) {
    console.log("no userid passed");
    return;
  }

  const subscription = (
    await sql("SELECT * FROM subscriptions WHERE userid = $1", [userid])
  )[0];

  if (!subscription) {
    console.log("no subscription found");
  }

  const payload = JSON.stringify({
    title: course.course_name,
    body: `You have a class at ${dayjs(dayjs().format("YYY-MM-DD ") + course.start).format("hh:mm A")} in ${course.room}`,
    icon: "/images/icon-192x192.png",
    badge: "/images/badge.png",
  });

  webpush.setVapidDetails(
    "https://tally.ambe.dev",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
  );

  const result = await webpush.sendNotification(
    subscription.subscription,
    payload,
  );

  console.log(result);
};

export default sendPushNotification;
