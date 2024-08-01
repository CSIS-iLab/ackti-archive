<script>
  import { onMount } from "svelte"
  import Search from "./Search.svelte"
  import Select from "svelte-select"
  import Icon from "./Icons.svelte"

  export let dataset
  export let filteredData
  export let selectedCategory
  export let selectedType
  export let selectedSpeaker
  export let selectedMonth
  export let selectedYear
  export let searchText = ""
  export let row

  $: totalEntries = filteredData.length

  const eventTotal = dataset.data.length
  function getPGCount(category) {
    return dataset.data.filter((row) => row.category.includes(category)).length
  }

  const optionIdentifier = "value"
  const labelIdentifier = "label"

  function updateActiveTab(val) {
    console.log("updateActiveTab val: ", val)
    const value = val ? val.split("_").join("-") : "all"
    const spanCountActive = document.querySelector(`.options__count--active`)
    const spanCount = document.querySelector(
      `.options__count[data-count="${value}"]`,
    )
    spanCountActive.classList.remove("options__count--active")
    spanCount.classList.add(`options__count--active`)

    const activeTab = document.querySelector(`.options__btn--tab--active`)
    const tabActivate = document.querySelector(
      `.options__btn--tab[data-tab="${value}"]`,
    )
    activeTab.classList.remove(
      "options__btn--tab--active",
      "options__btn--tab--Russia--active",
      "options__btn--tab--Other--active",
      "options__btn--tab--NATO--active",
      "options__btn--tab--all--active",
    )
    tabActivate.classList.add(
      "options__btn--tab--active",
      `options__btn--tab--${value}--active`,
    )
  }

  function removeRowActiveTitleStyle() {
    const title = document.querySelectorAll(".title--active")
    title.forEach((item) => {
      item.classList.remove("title--active")
    })
  }

  function removeExtraContentStyle() {
    const extraContent = document.querySelectorAll(".extra-content")
    extraContent.forEach((content) => {
      if (content.classList.contains("active")) {
        content.classList.remove("active")
        content.classList.add("hide")
      }
    })
  }

  function switchRowBottomLine() {
    const rowTitle = document.querySelectorAll(".title")
    const extraContent = document.querySelectorAll(".extra-content")
    extraContent.forEach((item) => {
      if (item.classList.contains("table__body__cell--border")) {
        item.classList.remove("table__body__cell--border")
      }
    })
    rowTitle.forEach((item) => {
      if (!item.classList.contains("table__body__cell--border")) {
        item.classList.add("table__body__cell--border")
      }
    })
  }

  function handleSelect(event, selectName) {
    if (row.isOpen) {
      toggleRowState()
    }

    switch (selectName) {
      case "Speaker":
        setSelectedSpeaker(event.detail.value)
        break
      case "Category":
        setSelectedCategory(event)
        break
      case "Type":
        selectedType = event.detail.value
        break
      case "Month":
        selectedMonth = event.detail.value
        break
      case "Year":
        selectedYear = event.detail.value
        break
      default:
        console.error("Invalid selectName:", selectName)
    }
  }

  function toggleRowState() {
    row.isOpen = !row.isOpen
    removeRowActiveTitleStyle()
    removeExtraContentStyle()
    switchRowBottomLine()
  }

  function setSelectedSpeaker(value) {
    const index = dataset.speaker.findIndex((element) =>
      element.includes(value),
    )
    selectedSpeaker = dataset.speaker[index]
  }

  function setSelectedCategory(event) {
    const value = event.target ? event.target.value : event.detail.value
    updateActiveTab(value)
    selectedCategory = value
  }

  function handleClear(selectName) {
    if (row.isOpen) {
      row.isOpen = !row.isOpen
      removeRowActiveTitleStyle()
      removeExtraContentStyle()
      switchRowBottomLine()
    }
    if (selectName === "Category") {
      selectedCategory = ""
      updateActiveTab("")
    } else if (selectName === "Speaker") {
      selectedSpeaker = ""
    } else if (selectName == "Type") {
      selectedType = ""
    } else if (selectName == "Month") {
      selectedMonth = ""
    } else {
      selectedYear = ""
    }
  }

  // handle the icon
  const chevronUp =
    '<svg class="iconUp" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 15 14 0 0 15h28z" fill="#000"/></svg>'
  const chevronDown =
    '<svg class="iconDown" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m0 0 14 15L28 0H0z" fill="#000"/></svg>'
  let chevron = chevronDown
  let isListOpen = false
  let listCategoryOpen = false

  $: chevron = isListOpen ? chevronUp : chevronDown

  function handleScrollLeft() {
    const tableContainer = document.getElementById("table-body")
    const btnIconLeft = document.querySelector("#icon-scroll-left")
    const btnIconRight = document.querySelector("#icon-scroll-right")

    tableContainer.scrollLeft -= 100
    if (btnIconRight.classList.contains("inactive")) {
      btnIconRight.classList.remove("inactive")
    }
    if (tableContainer.scrollLeft === 0) {
      btnIconLeft.classList.add("inactive")
    }
  }

  function handleScrollRight() {
    const tableContainer = document.getElementById("table-body")
    const table = document.getElementsByClassName("table")[0]
    const btnIconLeft = document.querySelector("#icon-scroll-left")
    const btnIconRight = document.querySelector("#icon-scroll-right")
    tableContainer.scrollLeft += 100
    if (btnIconLeft.classList.contains("inactive")) {
      btnIconLeft.classList.remove("inactive")
    }
    if (
      Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth >=
      table.offsetWidth
    ) {
      btnIconRight.classList.add("inactive")
    }
  }

  onMount(() => {
    isListOpen = false
    const tableContainer = document.getElementById("table-body")
    const table = document.getElementsByClassName("table")[0]
    const btnIconLeft = document.querySelector("#icon-scroll-left")
    const btnIconRight = document.querySelector("#icon-scroll-right")
    tableContainer.addEventListener("scroll", () => {
      const left = tableContainer.scrollLeft
      if (left > 0) {
        btnIconLeft.classList.remove("inactive")
      }
      if (
        Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth + 2 >=
        table.offsetWidth
      ) {
        btnIconRight.classList.add("inactive")
      }
      if (
        Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth + 2 <=
        table.offsetWidth
      ) {
        btnIconRight.classList.remove("inactive")
      }
      if (left === 0) {
        btnIconLeft.classList.add("inactive")
      }
    })
  })
</script>

<section class="table-container__header">
  <h2 class="table-container__subtitle">Explore Events</h2>
</section>

<!-- tabs at the top (all, Other, Russia, NATO, US, Allies)-->
<section class="options__container">
  <div class="options__header">
    <button
      class="options__btn options__btn--tab options__btn--tab--all options__btn--tab--active options__btn--tab--all--active"
      data-tab={"all"}
      on:click={(event) => handleSelect(event, "Category")}
      >All <span
        data-count={"all"}
        class="options__count options__count--active">{eventTotal}</span
      >
    </button>
    {#each dataset.categories as category}
      <button
        class="options__btn options__btn--tab options__btn--tab--{category} "
        data-tab={category}
        value={category}
        on:click={(event) => handleSelect(event, "Category")}
        >{category}
        <span
          data-count={category}
          class="options__count options__count--{category}"
          >{getPGCount(category)}</span
        >
      </button>
    {/each}
  </div>
</section>

<!-- dropdown filters -->

<div class="selects">
  <!--Speaker-->
  <div class="select-container">
    <div class="label">Speaker</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.speaker_name}
      placeholder="Select a speaker"
      on:select={(event) => handleSelect(event, "Speaker")}
      on:clear={() => handleClear("Speaker")}
    />
  </div>
  <!--Type-->
  <div class="select-container">
    <div class="label">Type</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.type}
      placeholder="Select a type"
      on:select={(event) => handleSelect(event, "Type")}
      on:clear={(event) => handleClear("Type")}
    />
  </div>
  <!--Month-->
  <div class="select-container">
    <div class="label">Month</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.months}
      placeholder="Select a month"
      on:select={(event) => handleSelect(event, "Month")}
      on:clear={() => handleClear("Month")}
    />
  </div>
  <!-- Year-->
  <div class="select-container">
    <div class="label">Year</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.years}
      placeholder="Select a year"
      on:select={(event) => handleSelect(event, "Year")}
      on:clear={() => handleClear("Year")}
    />
  </div>
</div>

<!--"Showing ### Entries" + left/right buttons-->
<div class="options options__container options__container--sticky">
  <section class="options__navigation">
    <Search bind:searchText />
    <div class="options__navigation-inner">
      <span class="options__table-total-entries"
        >Showing {totalEntries} {totalEntries > 1 ? "entries" : "entry"}</span
      >
      <button
        id="btn-scroll-left"
        class="btn btn--scroll btn--scroll--left inactive"
        aria-label="Scroll table to the left"
        on:click={handleScrollLeft}
        ><Icon
          id="icon-scroll-left"
          name="Icon-left"
          class="icon inactive"
        /></button
      >
      <button
        id="btn-scroll-right"
        class="btn btn--scroll btn--scroll--right"
        aria-label="Scroll table to the right"
        on:click={handleScrollRight}
        ><Icon id="icon-scroll-right" name="Icon-right" class="icon" /></button
      >
    </div>
  </section>
</div>

<style lang="scss">
  @use "../scss/abstracts/" as *;
  @use "../scss/components/table-container";
  @use "../scss/components/button";
  @use "../scss/components/label";
  @use "../scss/components/select";
  @use "../scss/components/options";

  :global(.selectContainer) {
    &:hover {
      --borderRadius: 0;
      --background: #{$color-background-gray-100};
    }
  }

  :global(.selectContainer .item.active) {
    position: relative;
    --itemIsActiveBG: transparent;
    --itemIsActiveColor: $color-text-gray-500;
    --itemHoverBG: $color-background-gray-100;

    &::before {
      content: "L";
      font-family: arial;
      -ms-transform: scaleX(-1) rotate(-35deg); /* IE 9 */
      -webkit-transform: scaleX(-1) rotate(-35deg); /* Chrome, Safari, Opera */
      transform: scaleX(-1) rotate(-35deg);
      display: inline-block;
      line-height: 1rem;
      color: $color-light-red;
      text-align: center;
      font-size: 14px;
      position: absolute;
      left: 16px;
      top: 10px;
    }
  }

  :global(.selectContainer) {
    --internalPadding: 0 4px 0 0 !important;
    --itemFirstBorderRadius: 2px;
    --placeholderColor: $color-placeholder;
  }

  :global(.selectContainer .item) {
    --itemPadding: #{rem(8)} #{rem(40)} #{rem(12)};
    text-overflow: unset !important;
    overflow: unset !important;
    white-space: unset !important;
  }
  :global(.listContainer) {
    --listBorderRadius: rem(2);
    --listZIndex: 15;
    --listMaxHeight: #{rem(450)};
    --height: 1.2;
    min-width: 250px !important;
  }

  :global(.iconDown) {
    pointer-events: none;
    filter: invert(25%) sepia(18%) saturate(172%) hue-rotate(343deg)
      brightness(96%) contrast(87%);

    &:hover,
    &:focus {
      filter: invert(25%) sepia(18%) saturate(172%) hue-rotate(343deg)
        brightness(96%) contrast(87%);
    }
  }

  :global(.iconUp) {
    pointer-events: none;
    filter: invert(29%) sepia(13%) saturate(765%) hue-rotate(181deg)
      brightness(95%) contrast(89%);

    &:hover,
    &:focus {
      // color brand blue 600
      filter: invert(39%) sepia(72%) saturate(6596%) hue-rotate(200deg)
        brightness(100%) contrast(84%);
    }
  }

  :global(.clearSelect) {
    width: rem(16);
    height: rem(16);
  }

  :global(.selectContainer > input) {
    --inputPadding: 0 28px 0 0;
  }

  :global(.indicator) {
    --indicatorRight: 4px;
    top: auto !important;
  }

  :global(.selectedItem) {
    color: $color-main-red;
  }
  .select-container :global(.selectContainer:hover .indicator) {
    // $color-light-red
    filter: invert(14%) sepia(52%) saturate(5603%) hue-rotate(355deg)
      brightness(82%) contrast(85%);
  }

  .select-container :global(.selectContainer:focus-within .indicator) {
    // $color-light-red
    filter: invert(14%) sepia(52%) saturate(5603%) hue-rotate(355deg)
      brightness(82%) contrast(85%);
  }
</style>
