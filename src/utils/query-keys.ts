const queryKeys = {
  user: () => ["user"],
  courses: (dayOfWeek: number) => ["dashboard", dayOfWeek]
};

export default queryKeys;
