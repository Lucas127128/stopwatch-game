<script lang="ts">
  import { page } from "$app/state";
  import { createHotkey } from "@tanstack/svelte-hotkeys";
  import "./layout.css";
  import { goto } from "$app/navigation";

  let { children } = $props();

  $effect(() => {
    createHotkey("1", async () => {
      await goto("/");
    });
    createHotkey("2", async () => {
      await goto("/leaderboard");
    });
  });
</script>

<svelte:head>
  <link
    rel="icon"
    href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRpbWVyIHByZXZpZXctaWNvbiI+PGxpbmUgeDE9IjEwIiB4Mj0iMTQiIHkxPSIyIiB5Mj0iMiIvPjxsaW5lIHgxPSIxMiIgeDI9IjE1IiB5MT0iMTQiIHkyPSIxMSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTQiIHI9IjgiLz48L3N2Zz4="
  />
</svelte:head>

<div
  class="h-16 bg-base-300 border-b border-amber-50 flex items-center justify-center gap-4 text-lg font-bold"
>
  <a href="/" class:text-accent={page.url.pathname === "/"}>Home</a>
  <a href="/leaderboard" class:text-accent={page.url.pathname === "/leaderboard"}>Leaderboard</a>
</div>

{@render children()}
