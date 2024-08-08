"use client";

import { useToast } from "@/components/toast/use-toast";
import { subscribe } from "@/utils/client";
import { labelStyles, inputStyles } from "@/utils/styles/input";
import { useMutation } from "@tanstack/react-query";
import { User } from "next-auth";
import { useState } from "react";

export default function LowAttendance({ user }: { user: User }) {
  const { toast } = useToast();

  const [duration, setDuration] = useState(
    user.upcomingClassNotification.toString()
  );

  const notificationsMutation = useMutation({
    mutationFn: async (duration: string) => {
      let subscription: PushSubscription | null = null;

      if (duration !== "0") {
        subscription = await subscribe(user?.id);
      } else {
        (await navigator.serviceWorker.getRegistration())?.unregister();
      }

      const res = await fetch("/api/notifications/class-upcoming", {
        method: "POST",
        body: JSON.stringify({ duration, subscription })
      });

      if (!res.ok) {
        throw new Error();
      }

      return duration;
    },
    onSuccess: (duration) => {
      toast({
        type: "foreground",
        title: "Settings updated",
        description:
          "Your notification settings have been updated successfully."
      });

      setDuration(duration);
    },
    onError: () => {
      toast({
        type: "foreground",
        title: "An error occurred",
        description: "An error occurred while updating notification settings."
      });
    }
  });

  return (
    <div className="flex flex-col gap-x-8 gap-y-5 sm:flex-row">
      <div className="flex flex-grow flex-col sm:max-w-80">
        <p className={labelStyles()}>Class upcoming notifications</p>
        <p className="text-secondary mt-1 text-text-sm font-medium">
          Receive notifications for upcoming classes.
        </p>
      </div>
      <select
        className={inputStyles(
          {
            size: "sm"
          },
          "w-full sm:w-60"
        )}
        value={duration}
        onChange={(e) => notificationsMutation.mutate(e.target.value)}
        disabled={notificationsMutation.isPending}
      >
        <option value="0">Do not notify</option>
        <option value="15m">15 minutes before class</option>
        <option value="30m">30 minutes before class</option>
        <option value="45m">45 minutes before class</option>
        <option value="1h">1 hour before class</option>
        <option value="2h">2 hours before class</option>
      </select>
    </div>
  );
}
