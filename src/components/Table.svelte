<script>
  import { onMount } from "svelte"
  import tooltip from "../js/tooltip"
  import Icon from "./Icons.svelte"

  export let filteredData
  export let row

  let sortIconContainer
  $: sortClass = "inactive"

  const sortByColumns = [
    "date (est)",
    "title",
    "associated agreement",
    "name(s)",
    "type of resource",
    "life cycle phase",
  ]

  function handleClick(e) {
    let title = undefined
    let currentRow = undefined
    let extraContent = undefined

    if (e.target.parentNode.classList.contains("title")) {
      title = e.target.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.nextElementSibling
    } else {
      title = e.target.parentNode.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.parentNode.nextElementSibling
    }

    title.classList.toggle("title--active")
    title.classList.toggle("table__body__cell--border")
    currentRow.classList.toggle("table__body__cell--border")
    // Show/Hide extraContent
    extraContent.classList.toggle("active")
    extraContent.classList.toggle("hide")
    row.isOpen ? (row.isOpen = true) : (row.isOpen = !row.isOpen)
  }

  const headerNames = [
    "Title", // Changed from "Event" to "Title"
    "Date (EST)",
    "Associated Agreement",
    "Name(s)", // Changed from "Names" to "Name(s)"
    "Type of Resource",
    "Life Cycle Phase",
    "Tags",
  ]

  $: sortBy = { col: "title", ascending: true } // Changed "event" to "title"

  $: sort = (e, column) => {
    column = column.toLowerCase().replace(/\s/g, "_")

    const iconsActive = document.querySelectorAll(".sort-icon--active")
    iconsActive.forEach((icon) => {
      icon.classList.remove("sort-icon--active")
    })
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending
      sortClass = sortBy.ascending ? "active" : "inactive"
    } else {
      sortClass = "inactive"
      sortBy.col = column
      sortBy.ascending = true
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1

    // Sorting functions for each column
    let sortTimelineEvent = (a, b) =>
      a.timelineEvent.title < b.timelineEvent.title
        ? -1 * sortModifier
        : a.timelineEvent.title > b.timelineEvent.title
          ? 1 * sortModifier
          : 0

    let sortDate = (a, b) => {
      if (a.date === null && b.date === null) return 0 // If both are null, treat them as equal
      if (a.date === null) return sortBy.ascending ? 1 : -1 // Null dates go last in ascending, first in descending
      if (b.date === null) return sortBy.ascending ? -1 : 1 // Null dates go last in ascending, first in descending
      return a.date < b.date
        ? -1 * sortModifier
        : a.date > b.date
          ? 1 * sortModifier
          : 0
    }

    let sortColumnName = (a, b) =>
      a[column] < b[column]
        ? -1 * sortModifier
        : a[column] > b[column]
          ? 1 * sortModifier
          : 0

    let sortByName = (a, b) => {
      const getFirstName = (row) =>
        row.names.length > 0 ? row.names[0].name.toLowerCase() : ""
      const nameA = getFirstName(a)
      const nameB = getFirstName(b)
      return nameA < nameB
        ? -1 * sortModifier
        : nameA > nameB
          ? 1 * sortModifier
          : 0
    }

    // Determine the column to sort by
    if (column == "title") {
      filteredData = filteredData.sort(sortTimelineEvent)
    } else if (column == "names") {
      filteredData = filteredData.sort(sortByName)
    } else if (column == "date") {
      filteredData = filteredData.sort(sortDate)
    } else {
      filteredData = filteredData.sort(sortDate).sort(sortColumnName)
    }
  }

  onMount(() => {
    const iconsActive = document.querySelectorAll(".sort-icon--active")
    iconsActive.forEach((icon) => {
      icon.classList.remove("sort-icon--active")
    })
    const divTimelineEvent = document.querySelector(
      ".table__cell--header__container__title",
    )
    divTimelineEvent.children[1].children[1].classList.add("sort-icon--active")
    // Sync horizontal scroll of table header and table body
    // Inspired by https://codepen.io/Goweb/pen/rgrjWx
    const scrollSync = () => {
      const tableHeader = document.querySelector("#table-header")
      const tableBody = document.querySelector("#table-body")

      const bindSyncScrolling = (one, two) => {
        let echo = false
        const sync = (elOne, elTwo) => () =>
          (echo = !echo) &&
          ((elOne.scrollTop = elTwo.scrollTop),
          (elOne.scrollLeft = elTwo.scrollLeft))
        two.onscroll = sync(one, two)
        one.onscroll = sync(two, one)
      }
      bindSyncScrolling(tableHeader, tableBody)
    }
    scrollSync()
  })
</script>

<div class="table__wrapper">
  <div class="table__container table__container--sticky" id="table-header">
    <table class="table">
      <thead>
        <tr class="table__header-row">
          {#each headerNames as name}
            <th class="table__cell--header" scope="col">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="table__cell--header__container table__cell--header__container__{name
                  .toLowerCase()
                  .split(' ')
                  .join('-')}"
                on:click={sortByColumns.includes(name.toLowerCase())
                  ? (e) => sort(e, name)
                  : ""}
              >
                <span>{name}</span>
                {#if sortByColumns.includes(name.toLowerCase())}
                  <div
                    class="sort-icons-container"
                    on:click={(e) => sort(e, name)}
                  >
                    <button
                      class="sort-icon sort-icon--{sortBy.col ==
                        String(name.toLowerCase().split(' ').join('_')) &&
                      sortBy.ascending
                        ? 'inactive'
                        : 'active'}">▲</button
                    >
                    <button
                      class="sort-icon sort-icon--{sortBy.col ==
                        name.toLowerCase().split(' ').join('_') &&
                      sortBy.ascending
                        ? 'active'
                        : 'inactive'}">▼</button
                    >
                  </div>
                {/if}
              </div>
            </th>
          {/each}
        </tr>
      </thead>
    </table>
  </div>
  <div class="table__container" id="table-body">
    <table class="table table__body">
      <tbody>
        {#each filteredData as rows}
          <tr
            on:click={(e) => handleClick(e)}
            class="title table__body__cell--border"
          >
            <!-- event name/title -->
            <td class="table__body__cell table__body__cell--data"
              ><div class="table__body__cell__title-container">
                <span class="icon-container" />{rows.timelineEvent.title}
              </div></td
            >
            <!-- event date - displays string value -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.date_string}</td
            >
            <!-- event associated agreement -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.associated_agreement}</td
            >
            <!-- Update the names column to join names and titles -->
            <td class="table__body__cell table__body__cell--data">
              {#each rows.names as person, index}
                <p>
                  {person.name}{person.title ? `, ${person.title}` : ""}{index <
                  rows.names.length - 1
                    ? "; "
                    : ""}
                </p>
                <br />
              {/each}
            </td>
            <!-- event type -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.type}</td
            >
            <!-- event type -->
            <td class="table__body__cell table__body__cell--data"
              >{rows.life_cycle_phase}</td
            >
            <!-- event type -->
            <td class="table__body__cell table__body__cell--data">
              {#each rows.content_tags as tag, index}
                {tag}{index < rows.content_tags.length - 1 ? "," : ""}<br />
              {/each}
            </td>
          </tr>
          <!--this tr is the stuff under the dropdown -->
          <tr class="extra-content hide">
            <td class="table__body__cell" colspan="7">
              <div class="extra-content__container">
                <div class="description">
                  <div>{rows.timelineEvent.summary}</div>
                  <div class="link">
                    {#each rows.timelineEvent.pdfs as pdf, index}
                      {#if pdf[0] != ""}
                        SOURCE:
                        <a
                          href={pdf[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          >{pdf[1]}
                        </a>
                        <br />
                        CITATION INFORMATION: {pdf[2]}
                      {/if}
                    {/each}
                    <br />
                  </div>
                </div>
                {#if rows.timelineEvent.image_url && rows.timelineEvent.image_source}
                  <div class="img-container">
                    <img
                      loading="lazy"
                      src={rows.timelineEvent.image_url}
                      alt={rows.timelineEvent.image_source}
                    />
                    <span
                      ><b>Photo Credit:</b>
                      {rows.timelineEvent.image_source}</span
                    >
                  </div>
                {/if}
              </div>
            </td>
          </tr>
        {:else}
          <!-- if filters return an empty table -->
          <tr>
            <td class="table__body__cell table__body__cell--no-data" colspan="6"
              ><p class="table__body__cell__no-data__title">0 entries found.</p>
              <p class="table__body__cell__no-data__desc">
                Try changing or removing filters to adjust the results.
              </p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  @use "../scss/abstracts/" as *;
  @use "../scss/components/table";
  :global(.tippy-box[data-theme~="poni"]) {
    @extend %text-style-ui-4;
    color: $color-text-gray-500;
    background-color: $color-background-white;
    padding: rem(6) rem(6) rem(8) rem(6);
    filter: drop-shadow(0px 1px 9px rgba(0, 0, 0, 0.06))
      drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  }

  :global(
      .tippy-box[data-theme~="poni"][data-placement^="top"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="poni"][data-placement^="bottom"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="poni"][data-placement^="left"]
        > .tippy-arrow::before,
      .tippy-box[data-theme~="poni"][data-placement^="right"]
        > .tippy-arrow::before
    ) {
    border-top-color: $color-background-white;
  }
</style>
