export const keys = {
  user: {
    index: (url: string) => `user:${url}`,
    show: (userId: string) => `user:${userId}`,
  },
};
