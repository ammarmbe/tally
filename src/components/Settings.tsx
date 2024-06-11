"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import { registerServiceWorker } from "@/lib/utils";
import { Session, User } from "lucia";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState(false);
  const [durations, setDurations] = useState([15]);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");

      return (await res.json()) as {
        notifications: boolean;
        durations: number[];
      };
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");

      return (await res.json()) as {
        user: User | null;
        session: Session | null;
      };
    },
  });

  const notificationsMutation = useMutation({
    mutationKey: ["settings"],
    mutationFn: async ({
      durations,
      notifications,
    }: {
      durations: number[];
      notifications: boolean;
    }) => {
      let subscription: PushSubscription | null = null;

      if (notifications) {
        subscription = await subscribe(user?.user?.id);
      }

      await fetch("/api/settings", {
        method: "POST",
        body: JSON.stringify({ durations, notifications, subscription }),
      });
    },
    onMutate: ({ durations, notifications }) => {
      setDurations(durations);
      setNotifications(notifications);
    },
  });

  useEffect(() => {
    if (data) {
      setDurations(data.durations);
      setNotifications(data.notifications);
    }
  }, [data]);

  if (isLoading)
    return (
      <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-32 text-center">
        <Spinner size="lg" />
      </section>
    );

  return (
    <section className="flex h-[calc(100dvh-4.5rem)] flex-col px-4 pb-32">
      <h2 className="pb-6 pt-2 text-xl font-semibold leading-none tracking-tight">
        Settings
      </h2>
      <div className="flex gap-5 sm:max-w-lg">
        <div className="flex w-full flex-row items-start justify-between gap-5 rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="text-base">Class upcoming notifications</p>
            <p className="text-sm text-muted-foreground">
              Recieve a notification when a class is about to start
            </p>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={(n) => {
              notificationsMutation.mutate({ durations, notifications: n });
            }}
          />
        </div>
      </div>
      <div
        className={`mt-3 flex gap-5 sm:max-w-lg ${!notifications ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <div className="flex w-full flex-col items-start justify-between gap-x-5 gap-y-3 rounded-lg border p-4 sm:flex-row">
          <div className="space-y-0.5">
            <p className="text-base">Duration</p>
            <p className="text-sm text-muted-foreground">
              Set when the notification should be sent
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {durations.map((d, i) => (
              <div className="flex gap-2">
                <Select
                  key={i}
                  onValueChange={(v) => {
                    notificationsMutation.mutate({
                      durations: durations.map((duration, j) =>
                        i === j ? parseInt(v) : duration,
                      ),
                      notifications,
                    });
                  }}
                  value={d.toString()}
                  disabled={!notifications}
                >
                  <SelectTrigger className="w-[180px] disabled:opacity-100">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="45">45 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  onClick={() => {
                    notificationsMutation.mutate({
                      durations: durations.filter((_, j) => i !== j),
                      notifications,
                    });
                  }}
                  size="icon"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                notificationsMutation.mutate({
                  durations: [...durations, 15],
                  notifications,
                });
              }}
              size="sm"
              className="disabled:opacity-100"
              disabled={durations.length === 4 || !notifications}
            >
              Add another time
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const subscribe = async (
  userid: string | null | undefined,
): Promise<PushSubscription | null> => {
  if (!userid) return null;

  // check if a service worker is already registered
  let swRegistration = await navigator.serviceWorker.getRegistration();

  if (!swRegistration) {
    swRegistration = await registerServiceWorker();
  }

  await window?.Notification.requestPermission();

  try {
    const options = {
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    return subscription;
  } catch (err) {}

  return null;
};
