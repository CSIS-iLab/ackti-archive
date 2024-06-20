<script>
  import { onMount } from "svelte"
  import tooltip from "../js/tooltip"
  import Icon from "./Icons.svelte"

  export let filteredData;
  export let row;

  let sortIconContainer
  $: sortClass = "inactive"

  const sortByColumns = ['activity', 'state', 'authority', 'type of resource']

  function handleClick(e) {
    let title = undefined
    let currentRow = undefined
    let extraContent = undefined
    
    if (e.target.parentNode.classList.contains('title') ) {
      title = e.target.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.nextElementSibling;
    } else {
      title = e.target.parentNode.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.parentNode.nextElementSibling;
    }

    title.classList.toggle('title--active')
    title.classList.toggle('table__body__cell--border')
    currentRow.classList.toggle('table__body__cell--border')
    // Show/Hide extraContent
    extraContent.classList.toggle('active');
    extraContent.classList.toggle("hide");
    (row.isOpen) ? row.isOpen = true : row.isOpen = !row.isOpen
  }

  const headerNames = [
    "Activity",
    "State",
    "Policy Goals",
    "Authority",
    "Type of Resource",
    "Tags",
  ];

  $: sortBy = { col: "activity", ascending: true };
  
  $: sort = (e, column) => {
    column = column.toLowerCase().replace(/\s/g, "_"); // replace spaces using regex with undesrscore
    const iconsActive = document.querySelectorAll('.sort-icon--active');
    iconsActive.forEach(icon => {
      icon.classList.remove('sort-icon--active');
    });
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending;
      sortClass = sortBy.ascending ? 'active' : 'inactive';
    } else {
      sortClass = 'inactive';
      sortBy.col = column;
      sortBy.ascending = true;
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1;

    // Sort by activity title
    if (column == "activity") {
      return (filteredData = filteredData.sort((a, b) => {
        if (a.activity.title < b.activity.title) {
          return -1 * sortModifier;
        } else if (a.activity.title > b.activity.title) {
          return 1 * sortModifier;
        } else {
          return 0;
        }
      }));
    }

    let sort = (a, b) =>
      a[column] < b[column]
        ? -1 * sortModifier
        : a[column] > b[column]
        ? 1 * sortModifier
        : 0;

    filteredData = filteredData.sort(sort);
  };

  onMount(() => {
    const iconsActive = document.querySelectorAll('.sort-icon--active');
    iconsActive.forEach(icon => {
      icon.classList.remove('sort-icon--active');
    });
    const divActivity = document.querySelector('.table__cell--header__container__activity');
    divActivity.children[1].children[1].classList.add('sort-icon--active');
    // Sync horizontal scroll of table header and table body
    // Inspired by https://codepen.io/Goweb/pen/rgrjWx
    const scrollSync = () => {
      const tableHeader = document.querySelector("#table-header");
      const tableBody = document.querySelector("#table-body");

      const bindSyncScrolling = (one, two) => {
        let echo = false;
        const sync = (elOne, elTwo) => () =>
          (echo = !echo) &&
          ((elOne.scrollTop = elTwo.scrollTop),
          (elOne.scrollLeft = elTwo.scrollLeft));
        two.onscroll = sync(one, two);
        one.onscroll = sync(two, one);
      };
      bindSyncScrolling(tableHeader, tableBody);
    };
    scrollSync();

  });
</script>

<div class="table__wrapper">
  <div class="table__container table__container--sticky" id="table-header">
    <table class="table">
      <thead>
        <tr class="table__header-row">
          {#each headerNames as name}
            <th class="table__cell--header" scope="col">
              <div class="table__cell--header__container table__cell--header__container__{name.toLowerCase().split(' ').join('-')}" on:click={ (sortByColumns.includes(name.toLowerCase())) ? (e) => sort(e, name) : ''}>
                <span>{name}</span>
                {#if sortByColumns.includes(name.toLowerCase())}
                <div class="sort-icons-container" on:click={(e) => sort(e, name)}>
                  <button class="sort-icon sort-icon--{(sortBy.col == name.toLowerCase().split(' ').join('_') && sortBy.ascending ) ? 'inactive' : 'active'}">▲</button>
                  <button class= "sort-icon sort-icon--{(sortBy.col == name.toLowerCase().split(' ').join('_') && sortBy.ascending ) ? 'active' : 'inactive'}">▼</button>
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
          <tr on:click={(e) => handleClick(e)} class="title table__body__cell--border">
            <td class="table__body__cell table__body__cell--data"><div class="table__body__cell__title-container"><span class="icon-container"></span>{rows.activity.title}</div></td>
            <td class="table__body__cell table__body__cell--data">{rows.state}</td>
            <td class="table__body__cell table__body__cell--data">
              <div class="table__body__cell__policy-goal-container">
                {#each rows.policy_goals as policyGoal}
                  <span class="table__body__cell__policy-goal table__body__cell__policy-goal--{policyGoal.toLowerCase()}">{policyGoal.split('_').join(' ')}</span>
                {/each}
              </div>
            </td>
            <td class="table__body__cell table__body__cell--data">{rows.authority}</td>
            <td class="table__body__cell table__body__cell--data">{rows.type_of_resource}</td>
            <td class="table__body__cell table__body__cell--data table__body__cell__icon-container">
              {#each rows.tags as tag}
                <span class="icon-tag-container" use:tooltip={{theme: 'energy'}} aria-hidden="true" aria-label={tag}><Icon name="icon {tag}" class="icon__tags"/></span>
              {/each}
            </td>
          </tr>
          <tr class="extra-content hide">
            <td class="table__body__cell" colspan="6">
              <div class="extra-content__container">
                <div class="description">{rows.activity.description}</div>
                <div class="link">
                  <a
                    href={rows.activity.link}
                    target="_blank"
                    rel="noopener noreferrer">Go to resource<span class="icon-container"><Icon name="Icon-open-blank" class="icon"/></span></a
                  >
                </div>
              </div>
            </td>
          </tr>
        {:else}
          <tr>
            <td class="table__body__cell table__body__cell--no-data"  colspan="6"><p class="table__body__cell__no-data__title">0 entries found.</p>
            <p class="table__body__cell__no-data__desc">Try changing or removing filters to adjust the results.</p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  @use '../scss/abstracts/' as *;
  @use "../scss/components/table";
  :global(.tippy-box[data-theme~='energy']) {
    @extend %text-style-ui-4;
    color: $color-text-gray-500;
    background-color: $color-background-white;
    padding: rem(6) rem(6) rem(8) rem(6);
    filter: drop-shadow(0px 1px 9px rgba(0, 0, 0, 0.06)) drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  }

  :global(
    .tippy-box[data-theme~='energy'][data-placement^='top'] > .tippy-arrow::before,
    .tippy-box[data-theme~='energy'][data-placement^='bottom'] > .tippy-arrow::before,
    .tippy-box[data-theme~='energy'][data-placement^='left'] > .tippy-arrow::before,
    .tippy-box[data-theme~='energy'][data-placement^='right'] > .tippy-arrow::before
  ){
    border-top-color: $color-background-white;
  }
</style>
