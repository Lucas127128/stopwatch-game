<script lang="ts">
  import { addResult } from "#lib/results.remote.ts";
  import { formatTime } from "#lib/time.ts";
  import { goto } from "$app/navigation";
  import { createHotkey } from "@tanstack/svelte-hotkeys";

  let dialog = $state<HTMLDialogElement | null>(null);

  let counting = $state(false);
  let willShowDialog = $state(false);
  let buttonText = $derived(counting ? "Stop" : "Start");
  let time = $state(0);
  const timeString = $derived(formatTime(time));

  let intervalId = 0;
  const startTimer = () => {
    counting = true;
    intervalId = setInterval(() => {
      time += 5;
    }, 5);
  };
  const stopTimer = () => {
    counting = false;
    willShowDialog = true;
    clearInterval(intervalId);
    setTimeout(() => {
      willShowDialog = false;
      dialog?.showModal();
    }, 3000);
  };
  const resetTimer = () => {
    counting = false;
    clearInterval(intervalId);
    time = 0;
  };
  const closeDialog = () => {
    dialog?.close();
    resetTimer();
  };
  $effect(() => {
    createHotkey(
      "Space",
      () => {
        if (counting) {
          stopTimer();
        } else {
          startTimer();
        }
      },
      () => ({
        enabled: !willShowDialog,
      }),
    );
    createHotkey(
      "R",
      () => {
        resetTimer();
      },
      () => ({
        enabled: !willShowDialog,
      }),
    );
  });
</script>

<div class="w-dvw flex align-center items-center gap-8 p-8 flex-col">
  <h1 class="text-3xl font-bold text-accent">Reach 7:00 !</h1>
  <div class="text-8xl font-mono">{timeString}</div>
  <button
    class="btn btn-accent justify-center rounded-full w-[85dvw] sm:w-lg h-lg py-10"
    class:btn-error={counting}
    disabled={willShowDialog}
    onclick={counting ? stopTimer : startTimer}>{buttonText}</button
  >
  <button
    class="btn btn-warning justify-center rounded-full w-[85dvw] sm:w-lg h-lg py-10"
    onclick={resetTimer}
    disabled={willShowDialog}>Reset</button
  >
</div>

<dialog
  bind:this={dialog}
  class="dialog-anim fixed m-auto mt-[15dvh] inset-0 border-2 border-[#666] p-4 bg-base-100 rounded-xl w-xl max-h-[35em]"
>
  <div class="flex flex-col items-center gap-4">
    <p class="text-3xl">Join our leaderboard!</p>
    <div>
      <span class="text-lg pr-1">Your time: </span>
      <span class="text-4xl font-mono">{timeString}</span>
    </div>
    {let name = $state("")}
    <div class="flex items-center gap-3 w-full">
      <span>Name:</span>
      <input
        type="text"
        class="h-8 w-full border-accent border outline-none px-2.5 rounded-sm"
        bind:value={name}
      />
    </div>
    <div class="flex items-center gap-3 w-full justify-end">
      <button
        class="btn btn-accent"
        onclick={async () => {
          await addResult({ username: name, timeTaken: time });
          dialog?.close();
          await goto("/leaderboard");
        }}>Submit</button
      >
      <button class="btn btn-outline btn-accent" onclick={closeDialog}>Close</button>
    </div>
  </div>
</dialog>
