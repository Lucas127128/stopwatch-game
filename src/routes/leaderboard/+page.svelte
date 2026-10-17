<script lang="ts">
  import { addHours, differenceInMilliseconds, formatDate } from "date-fns";
  import { getResult } from "#lib/results.remote.ts";
  import { formatTime } from "#lib/time.ts";

  const results = await getResult();
</script>

<div class="flex flex-col items-center">
  <h1 class="text-3xl font-bold pt-8 text-accent">Leaderboard</h1>
  <div class="px-2 w-sm pt-5 grid grid-cols-[1fr_2fr_4fr_3fr] gap-3">
    {#if results.sucess}
      {const leaders = results.data
        .toSorted(
          (a, b) =>
            Math.abs(differenceInMilliseconds(7 * 1000, a.time_taken)) -
            Math.abs(differenceInMilliseconds(7 * 1000, b.time_taken)),
        )
        .map((leader, index) => ({ ...leader, rank: index + 1 }))}
      {#each leaders as leader (leader.created_at)}
        <div class="bg-emerald-300 p-2 rounded-xl text-black grid col-span-4 grid-cols-subgrid">
          <span>#{leader.rank}</span>
          <span>{leader.user_name}</span>
          <span class="font-mono">{formatTime(leader.time_taken)}</span>
          <span>{formatDate(addHours(new Date(leader.created_at), 8), "hh:mm:ss")}</span>
        </div>
      {/each}
    {/if}
  </div>
</div>
