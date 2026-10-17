export const formatTime = (time: number) => {
  const seconds = Math.floor(time / 1000);
  const tenMs = Math.floor((time % 1000) / 10);
  return `${String(seconds).padStart(2, "0")}:${String(tenMs).padStart(2, "0")}`;
};
