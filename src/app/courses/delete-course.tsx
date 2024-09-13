import Modal from "@/components/modal";
import { toast } from "@/components/toast/use-toast";
import { queryClient } from "@/utils/query-client";
import queryKeys from "@/utils/query-keys";
import buttonStyles from "@/utils/styles/button";
import { TCourse } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteCourse({ course }: { course: TCourse }) {
  const [modalOpen, setModalOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/courses/", {
        method: "DELETE",
        body: JSON.stringify({
          id: course.id
        })
      });

      if (!res.ok) {
        throw new Error();
      }
    },
    onSuccess: async () => {
      queryClient.setQueryData(
        queryKeys.courses.all(),
        (old: TCourse[] | undefined) => old?.filter((c) => c.id !== course.id)
      );

      toast({
        type: "foreground",
        title: "Course deleted",
        description: `${course.name} has been deleted successfully.`
      });

      setModalOpen(false);
    },
    onError: () => {
      toast({
        type: "foreground",
        title: "An error occurred",
        description: "An error occurred while deleting the course."
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.all()
      });
    }
  });

  return (
    <Modal
      open={modalOpen}
      onOpenChange={setModalOpen}
      trigger={
        <button
          className={buttonStyles(
            {
              size: "sm",
              variant: "tertiary",
              danger: true,
              dropdown: true
            },
            "justify-start"
          )}
        >
          <Trash2 size={16} /> Delete
        </button>
      }
      saveButton={
        <button
          className={buttonStyles({
            size: "md",
            variant: "primary",
            danger: true
          })}
          onClick={() => {
            updateMutation.mutate();
          }}
          disabled={updateMutation.isPending}
        >
          Delete
        </button>
      }
      cancelButton={
        <button
          className={buttonStyles({
            size: "md",
            variant: "secondary"
          })}
        >
          Cancel
        </button>
      }
      title="Delete course"
      description={`Are you sure you want to delete ${course.name}? This action cannot be undone.`}
    />
  );
}
