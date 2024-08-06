"use client";

import { toast } from "@/components/toast/use-toast";
import { labelStyles, inputStyles } from "@/utils/styles/input";
import { useMutation } from "@tanstack/react-query";
import { User } from "next-auth";
import { useState } from "react";

export default function CountCancelled({ user }: { user: User | undefined }) {
  const [countCancelled, setCountCancelled] = useState<
    "NONE" | "ATTENDED" | "MISSED"
  >(user?.countCancelledCourses ?? "NONE");

  const updateMutation = useMutation({
    mutationFn: async (data: "NONE" | "ATTENDED" | "MISSED") => {
      const res = await fetch("/api/user/count-cancelled", {
        method: "PATCH",
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error("An error occurred while updating the settings.");
      }

      return data;
    },
    onSuccess: async (data) => {
      toast({
        type: "foreground",
        title: "Course updated",
        description: `You settings have been updated successfully.`
      });

      setCountCancelled(data);
    },
    onError: () => {
      toast({
        type: "foreground",
        title: "An error occurred",
        description: "An error occurred while updating the course."
      });

      setCountCancelled(user?.countCancelledCourses ?? "NONE");
    }
  });

  return (
    <div className="flex flex-col gap-x-8 gap-y-5 sm:flex-row">
      <div className="flex flex-grow flex-col sm:max-w-80">
        <p className={labelStyles()}>Count cancelled classes?</p>
        <p className="text-secondary mt-1 text-text-sm font-medium">
          Whether to count cancelled classes when calculating attendance.
        </p>
      </div>
      <select
        className={inputStyles(
          {
            size: "sm"
          },
          "w-full sm:w-60"
        )}
        value={countCancelled}
        onChange={(e) => {
          updateMutation.mutate(
            e.target.value as "NONE" | "ATTENDED" | "MISSED"
          );
        }}
        disabled={updateMutation.isPending}
      >
        <option value="NONE">Do not count</option>
        <option value="ATTENDED">Count as attended</option>
        <option value="MISSED">Count as missed</option>
      </select>
    </div>
  );
}
