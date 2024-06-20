<script>
import { onMount } from "svelte";

  import Icon from "./Icons.svelte";
  export let searchText = "";
  let btnSearch



const clearSearch = () => {
  searchText = "";
  btnSearch.classList.add("search__btn-clear--hidden");
}

onMount(() => {
  if (searchText.length > 0 && searchText !== "") {
    btnSearch.classList.remove("search__btn-clear--hidden");
  } else {
    btnSearch.classList.add("search__btn-clear--hidden");
  }
});

$: if (btnSearch) {
  if (searchText.length > 0 && searchText !== "") {
    btnSearch.classList.remove("search__btn-clear--hidden");
  } else {
    btnSearch.classList.add("search__btn-clear--hidden");
  }
}


</script>

<div class="search">
  <span class="search__icon">
    <Icon
      name="Icon-magnify"
      class="icon"
    />
  </span>
  <input class="search__input" type="search" name="search" id="search" placeholder="Keyword Search" bind:value={searchText}>
  <button class="search__btn search__btn-clear search__btn-clear--hidden" bind:this={btnSearch} on:click={clearSearch}>&times</button>
</div>

<style lang="scss">
  @use "../scss/components/search";
</style>
