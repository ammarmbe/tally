const queryKeys = {
  user: () => ["user"],
  courses: {
    date: (date: string) => ["courses", "date", date],
    all: () => ["courses", "all"],
    history: (startDate: Date | null, endDate: Date | null) => [
      "courses",
      "history",
      startDate,
      endDate
    ]
  },
  notifications: () => ["notifications"]
};

export default queryKeys;
