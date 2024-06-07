import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeStringToFloat(time: string) {
  var hoursMinutes = time.split(/[.:]/);
  var hours = parseInt(hoursMinutes[0], 10);
  var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
  return hours + minutes / 60;
}

export const registerServiceWorker = async () => {
  return navigator.serviceWorker.register("/service.js");
};

export const saveSubscription = async (
  subscription: PushSubscription,
  userid: string,
) => {
  await fetch("/api/push", {
    method: "POST",
    body: JSON.stringify({ subscription, userid }),
  });
};
