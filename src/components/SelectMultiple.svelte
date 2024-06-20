<script>
import { onMount } from "svelte";

  import {clickOutside} from "../js/clickOutside.js";
  import Icon from "./Icons.svelte";

  export let selectName = "name";
  export let options = [];
  export let selectedValue = [];
  
  let isListOpen = false;
  let optionsList
  let selectLabel
  let selectedCounter = 0
  let selectedTagCounterText
  let tagsHTML
  let spanHTML
  let isTagSelected = false
  let spanElement

  // handle the icon
  const chevronUp = '<svg class="iconUp" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 15 14 0 0 15h28z" fill="#000"/></svg>';
  const chevronDown = '<svg class="iconDown" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m0 0 14 15L28 0H0z" fill="#000"/></svg>';
  let chevron = chevronDown;
  
  $: chevron = isListOpen ? chevronUp : chevronDown;


  function toggleIcons (iconUp, iconDown) {
    if (!iconUp.classList.contains('hide')) {
      iconUp.classList.toggle('hide')
    }
    if (iconDown.classList.contains('hide')) {
      iconDown.classList.toggle('hide')
    }
  }
  function removeRowActiveTitleStyle() {
    const title = document.querySelectorAll('.title--active');
    title.forEach(item => {
      item.classList.remove('title--active');
    });
  }

  function removeExtraContentStyle() {
    const extraContent = document.querySelectorAll(".extra-content");
    extraContent.forEach(content => {
      if (content.classList.contains('active')) {
        const iconUp = content.previousElementSibling.children[0].children[0].children[0].children[1]
        const iconDown = content.previousElementSibling.children[0].children[0].children[0].children[0]
        
        content.classList.remove('active')
        content.classList.add('hide');

        toggleIcons(iconUp, iconDown)
      }
    });
  }

  function switchRowBottomLine() {
    const rowTitle = document.querySelectorAll('.title')
    const extraContent = document.querySelectorAll('.extra-content')
    extraContent.forEach(item => {
      if(item.classList.contains('table__body__cell--border')) {
        item.classList.remove('table__body__cell--border')
      }
    });
    rowTitle.forEach(item => {
      if(!item.classList.contains('table__body__cell--border')) {
        item.classList.add('table__body__cell--border')
      }
    });
  }

  const formatOption = (opt, type) => {
    if (selectName !== "State") {
      return opt;
    } else if (type === "name") {
      const name = opt.name
      return name
    } else if (type === "value") {
      return opt.value;
    }
  };

  let showOptions = () => {
    if (!isListOpen) {
      optionsList.classList.toggle("hide");
      removeRowActiveTitleStyle()
      removeExtraContentStyle()
      switchRowBottomLine()
      isListOpen = !isListOpen
    }
  }

  $: if (selectedValue.length > 0 && selectedValue !== "") {
    const firstSelected = selectedValue[0]
    tagsHTML.classList.add('select__select-tag--selected')
    tagsHTML.innerHTML = firstSelected + '<span id="whatever" style="color: #0054A4" class="select__select-tag__counter"></span>'
    selectedCounter = selectedValue.length - 1
    selectLabel = firstSelected
    isTagSelected = !isTagSelected
    spanElement = document.querySelector('#whatever')
    if (selectedCounter > 1) {
      selectedTagCounterText = '<span class="select__select-tag__counter>+' + selectedCounter + '</span>'
      spanElement = '+' +selectedCounter
    }
  } else {
    (selectedCounter > 1) ? selectedCounter-- : selectedCounter = 0
    selectLabel = `Select ${selectName}`
    if (isTagSelected) {
      tagsHTML.innerHTML = selectLabel
      tagsHTML.classList.remove('select__select-tag--selected')
      spanElement = ''
      isTagSelected = !isTagSelected
    }
  }

	let handleClickOutside = () => {
    if (isListOpen) {
      optionsList.classList.toggle("hide");
      isListOpen = !isListOpen
    }
	}

  function onKeyDown(e) {
    if (e.keyCode == 13 || e.keyCode == 32) {
      showOptions()
    }
    if (e.keyCode == 27) {
      handleClickOutside()
    }
  }

  onMount( () => {
    const selectTags = document.querySelector('#selectTags')
    selectTags.addEventListener('keydown', onKeyDown)
  })

</script>

<div class="select__select-wrapper" bind:this={spanHTML}>
  <div id="selectTags" class="select__select-tags-container" on:click={showOptions}>
    <div
      tabindex="0"
      class="select__select-tag"
      contenteditable="false"
      bind:this={tagsHTML}
    ><span>Select {selectName}</span>
    </div>
    <span class="select__select-tag__counter">{(selectedCounter > 0) ? '+' + selectedCounter : ''}</span>
    <span class="select__select-tag-icon">{@html chevron}</span>
  </div>
  <div class="select__tags-options hide" bind:this={optionsList}
    use:clickOutside on:click_outside={handleClickOutside}
  >
    {#each options as option}
      <div class="checkbox__container">
        <input
        class="checkbox__check"
        id={formatOption(option, "value")}
        type="checkbox"
        name="tags"
        value={formatOption(option, "value")}
        bind:group={selectedValue}
        >
        <label class="checkbox__label" for={formatOption(option, "value")}>
          <span class="icon-container"><Icon
            name="icon {formatOption(option, "name")}"
            class="icon__select"
          /></span>
          {formatOption(option, "name")}
        </label>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use "../scss/abstracts" as *;
  @use "../scss/components/select";
  @use "../scss/components/checkbox";
  @use "../scss/components/icon";

  :global(.select__select-tag--selected) {
    color: $color-brand-blue-600 !important;
  }

</style>
