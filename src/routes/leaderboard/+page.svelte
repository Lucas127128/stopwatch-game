<script lang="ts">
  import { addHours, differenceInMilliseconds, formatDate } from "date-fns";
  import { getResult, removeResult } from "#lib/results.remote.ts";
  import { formatTime } from "#lib/time.ts";
  import Trash from "@lucide/svelte/icons/trash";

  const results = $derived(await getResult());
  let cachedPassword = "";
</script>

<div class="flex flex-col items-center">
  <h1 class="text-3xl font-bold pt-8 text-accent">Leaderboard</h1>
  <div class="px-2 w-[85dvw] sm:w-sm pt-5 grid grid-cols-[1fr_2fr_4fr_3fr_1fr] gap-3">
    {#if results.sucess}
      {const leaders = $derived(
        results.data
          .toSorted(
            (a, b) =>
              Math.abs(differenceInMilliseconds(7 * 1000, a.time_taken)) -
              Math.abs(differenceInMilliseconds(7 * 1000, b.time_taken)),
          )
          .map((leader, index) => ({ ...leader, rank: index + 1 })),
      )}
      {#each leaders as leader (leader.created_at)}
        {let dialog = $state<HTMLDialogElement>()}
        <div
          class="bg-emerald-300 p-2 rounded-xl text-black grid col-span-5 grid-cols-subgrid items-center"
        >
          <span>#{leader.rank}</span>
          <span>{leader.user_name}</span>
          <span class="font-mono">{formatTime(leader.time_taken)}</span>
          <span>{formatDate(addHours(new Date(leader.created_at), 8), "hh:mm:ss")}</span>
          <button
            class="btn btn-error btn-ghost"
            onclick={async () => {
              if (cachedPassword) {
                await removeResult({ createdAt: leader.created_at, password: cachedPassword });
              } else {
                dialog?.showModal();
              }
            }}><Trash /></button
          >
          <dialog
            bind:this={dialog}
            id="delete-dialog-{leader.created_at}"
            class="dialog-anim fixed m-auto mt-[15dvh] inset-0 border-2 border-[#666] p-4 bg-base-100 rounded-xl w-xl max-h-[35em]"
          >
            <div class="flex flex-col items-center gap-4">
              <p class="text-3xl">Are you sure you want to delete this record?</p>
              {let password = ""}
              <div class="w-full flex">
                <span class="text-lg pr-2">Password: </span>
                <input
                  bind:value={password}
                  type="password"
                  class="h-8 w-full border-accent border outline-none px-2.5 rounded-sm"
                />
              </div>
              <div class="w-full flex justify-end gap-3">
                <button
                  class="btn btn-outline"
                  command="close"
                  commandfor="delete-dialog-{leader.created_at}">Close</button
                >
                <button
                  class="btn btn-error"
                  onclick={async () => {
                    const result = await removeResult({
                      createdAt: leader.created_at,
                      password: password,
                    });
                    if (!result?.fail) {
                      cachedPassword = password;
                      dialog.close();
                    }
                  }}>Delete</button
                >
              </div>
            </div>
          </dialog>
        </div>
      {/each}
    {/if}
  </div>
</div>
