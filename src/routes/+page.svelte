<script lang="ts">
  let counting = $state(false);
  let buttonText = $derived(counting ? "Stop" : "Start");
  let time = $state(0);
  const timeString = $derived.by(() => {
    const seconds = Math.floor(time / 1000);
    const tenMs = Math.floor((time % 1000) / 10);
    return `${String(seconds).padStart(2, "0")}:${String(tenMs).padStart(2, "0")}`;
  });
  let intervalId = 0;
  const startTimer = () => {
    counting = true;
    intervalId = setInterval(() => {
      time += 5;
    }, 5);
  };
  const stopTimer = () => {
    counting = false;
    clearInterval(intervalId);
  };
  const resetTimer = () => {
    counting = false;
    clearInterval(intervalId);
    time = 0;
  };
</script>

<div class="w-dvw flex align-center items-center gap-8 p-8 flex-col">
  <h1 class="text-3xl font-bold text-accent">Reach 10:00:00 !</h1>
  <div class="text-8xl font-mono">{timeString}</div>
  <button
    class="btn btn-accent justify-center rounded-full w-lg h-lg py-10"
    onclick={counting ? stopTimer : startTimer}>{buttonText}</button
  >
  <button class="btn btn-warning justify-center rounded-full w-lg h-lg py-10" onclick={resetTimer}
    >Reset</button
  >
</div>
