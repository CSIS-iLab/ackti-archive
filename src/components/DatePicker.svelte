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
    // let dates = dataset.dates.map(date => new Date(date)); // Ensure all dates are Date objects
    // let defaultDate
    let dates = dataset.dates.map((date) => {
      console.log(date)
      if (date === "09/1990") return new Date("1990-09-01")
      if (date === "08/2005") return new Date("2005-08-01")
      if (date === "07/2010") return new Date("2010-07-01")
      return new Date(date) // Default behavior for all other dates
    })

    console.log(dates)
    // Find the oldest date
    const oldestDate = new Date(Math.min(...dates))
    console.log(oldestDate)

    // Find the most recent date
    const mostRecentDate = new Date(Math.max(...dates))
    console.log(mostRecentDate)

    let defaultDate
    if (defaultDateType === "oldest") {
      defaultDate = oldestDate
    } else {
      defaultDate = mostRecentDate
    }

    flatpickr(datepicker, {
      defaultDate: defaultDate,
      minDate: oldestDate,
      maxDate: mostRecentDate,
      dateFormat: "m-d-Y",
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
    font-family: "Rokkitt", serif;
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
    font-family: "Rokkitt", serif;
  }

  :global(.flatpickr-month) {
    font-family: "Rokkitt", serif;
    font-size: 1.2rem;
  }

  :global(.flatpickr-prev-month),
  :global(.flatpickr-next-month) {
    color: #007bff;
  }
</style>
