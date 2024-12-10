"use client";

import { useToast } from "@/components/toast/use-toast";
import { subscribe } from "@/utils/client";
import { labelStyles, inputStyles } from "@/utils/styles/input";
import { useMutation } from "@tanstack/react-query";
import { User } from "next-auth";
import { useState } from "react";

export default function ClassUpcoming({ user }: { user: User }) {
  const { toast } = useToast();

  const [duration, setDuration] = useState(
    user.upcomingClassNotification?.toString()
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
        body: JSON.stringify({
          duration,
          subscription: JSON.stringify(subscription)
        })
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
      <div className="relative flex h-fit w-full sm:w-60">
        <select
          className={inputStyles(
            {
              size: "sm"
            },
            "w-full"
          )}
          value={duration}
          onChange={(e) => notificationsMutation.mutate(e.target.value)}
          disabled={notificationsMutation.isPending}
        >
          <option value="0">Do not notify</option>
          <option value="15">15 minutes before class</option>
          <option value="30">30 minutes before class</option>
          <option value="45">45 minutes before class</option>
          <option value="60">1 hour before class</option>
          <option value="120">2 hours before class</option>
        </select>
        <div className="text-secondary absolute right-[9px] top-[9px] size-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
