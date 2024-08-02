<script>
  import { onMount } from "svelte";
  import flatpickr from "flatpickr";
  import "flatpickr/dist/flatpickr.css";

  export let placeholder = "Select Date";
  export let date = "";
  export let onDateChange;

  let datepicker;

  onMount(() => {
    flatpickr(datepicker, {
      defaultDate: date,
      onChange: (selectedDates) => {
        if (onDateChange) {
          onDateChange(selectedDates[0]);
        }
      },
    });
  });
</script>

<input type="text" bind:this={datepicker} placeholder={placeholder} />

<style>
  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
</style>
