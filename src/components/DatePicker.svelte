<script>
  import { onMount } from "svelte"
  import flatpickr from "flatpickr"
  import "flatpickr/dist/flatpickr.css"

  export let placeholder = "Select Date"
  export let date = ""
  export let onDateChange
  export let dataset = []
  export let defaultDateType = ""

  let datepicker

  onMount(() => {
    let dates = dataset.dates
    let defaultDate 
    // Find the oldest date
    const oldestDate = new Date(Math.min(...dates.map(date => new Date(date))));
    const oldestDateFormatted = oldestDate.toISOString().split('T')[0];

    // Find the most recent date
    const mostRecentDate = new Date(Math.max(...dates.map(date => new Date(date))));
    const mostRecentDateFormatted = mostRecentDate.toISOString().split('T')[0];

    console.log(oldestDateFormatted); // Output: 1967-02-14
    console.log(mostRecentDateFormatted); // Output: 1991-10-16

    if (defaultDateType === "oldest") {
      defaultDate = oldestDateFormatted 
    } else {
      defaultDate = mostRecentDateFormatted
    }

    flatpickr(datepicker, {
      defaultDate: defaultDate,
      minDate: oldestDateFormatted,
      maxDate: mostRecentDateFormatted,
      onChange: (selectedDates) => {
        if (onDateChange) {
          onDateChange(selectedDates[0])
        }
      },
    })
  })
</script>

<input type="text" bind:this={datepicker} {placeholder} />

<style>
  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
</style>
