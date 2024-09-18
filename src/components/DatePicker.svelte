<script>
  import { onMount } from "svelte"
  import flatpickr from "flatpickr"
  import "flatpickr/dist/flatpickr.css"
  import "flatpickr/dist/themes/material_blue.css"

  export let placeholder = "Select Date"
  export let onDateChange
  export let dataset = []
  export let defaultDateType = ""

  let datepicker

  onMount(() => {
    let dates = dataset.dates
    console.log(dates)
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
   /* Input styling */
   input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  :global(.flatpickr-calendar) {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  :global(.flatpickr-day) {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    font-family: 'Rokkitt', serif; 
  }

  :global(.flatpickr-day:hover) {
    background-color: #e6e6e6;
  }

  :global(.flatpickr-day.today) {
    background-color: #007bff;
    color: white;
  }

  :global(.flatpickr-day.selected) {
    background-color: #32516d !important;
    color: white;
  }

  :global(.flatpickr-months) {
    background-color: #f8f9fa;
  }

  :global(.flatpickr-weekday) {
    color: #454545 !important;
    font-family: 'Rokkitt', serif;
  }

  :global(.flatpickr-month) {
    font-family: 'Rokkitt', serif;
    font-size: 1.2rem;
  }


  :global(.flatpickr-prev-month), :global(.flatpickr-next-month) {
    color: #007bff;
  }
</style>