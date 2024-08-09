"use client";

import { useToast } from "@/components/toast/use-toast";
import { subscribe } from "@/utils/client";
import { labelStyles, inputStyles } from "@/utils/styles/input";
import { useMutation } from "@tanstack/react-query";
import { User } from "next-auth";
import { useState } from "react";

export default function LowAttendance({ user }: { user: User }) {
  const { toast } = useToast();

  const [percentage, setPercentage] = useState(
    user.lowAttendanceNotification.toString()
  );

  const notificationsMutation = useMutation({
    mutationFn: async (percentage: string) => {
      let subscription: PushSubscription | null = null;

      if (percentage !== "0") {
        subscription = await subscribe(user?.id);
      } else {
        (await navigator.serviceWorker.getRegistration())?.unregister();
      }

      const res = await fetch("/api/notifications/low-attendance", {
        method: "POST",
        body: JSON.stringify({
          percentage,
          subscription: subscription?.endpoint
        })
      });

      if (!res.ok) {
        throw new Error();
      }

      return percentage;
    },
    onSuccess: (percentage) => {
      toast({
        type: "foreground",
        title: "Settings updated",
        description:
          "Your notification settings have been updated successfully."
      });

      setPercentage(percentage);
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
        <p className={labelStyles()}>Low attendance notifications</p>
        <p className="text-secondary mt-1 text-text-sm font-medium">
          Recieve a notification when your attendance is about to fall below a
          certain threshold.
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
          value={percentage}
          onChange={(e) => notificationsMutation.mutate(e.target.value)}
          disabled={notificationsMutation.isPending}
        >
          <option value="0">Do not notify</option>
          <option value="50">50%</option>
          <option value="55">55%</option>
          <option value="60">60%</option>
          <option value="65">65%</option>
          <option value="70">70%</option>
          <option value="75">75%</option>
          <option value="80">80%</option>
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
