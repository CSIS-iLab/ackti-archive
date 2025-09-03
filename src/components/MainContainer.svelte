<script>
  import Header from "./Header.svelte"
  import IntroContent from "./IntroContent.svelte"
  import Options from "./Options.svelte"
  import Table from "./Table.svelte"
  import About from "./About.svelte"
  import Footer from "./Footer.svelte"

  export let dataset
  let selectedAssociatedAgreement = ""
  let selectedType = ""
  let selectedSpeaker = ""
  let searchText
  let selectedStartDate = ""
  let selectedEndDate = ""
  let selectedLifeCyclePhase = ""
  let selectedTags = []
  $: row = { isOpen: false }

  $: filteredData = () => {
    return dataset.data
      .filter((row) => {
        const filteredTags =
          selectedTags.length > 0
            ? row.content_tags.some((tag) => selectedTags.includes(tag))
            : true

        // Use parsed date bounds if present; fall back to single date
        const rowMin = row.date_min ?? row.date ?? null
        const rowMax = row.date_max ?? row.date ?? null
        const matchesSpeaker = selectedSpeaker
          ? row.names.some(
              (person) =>
                person.name.trim().toLowerCase() ===
                selectedSpeaker.trim().toLowerCase(),
            )
          : true
        const isSelectedAssociatedAgreement = selectedAssociatedAgreement
          ? (row.associated_agreements_list || []).includes(
              selectedAssociatedAgreement,
            )
          : true
        const isSelectedType = selectedType
          ? row.type &&
            row.type
              .split(",")
              .map((type) => type.trim().toLowerCase())
              .includes(selectedType.toLowerCase())
          : true

        // A row matches the range if its dates overlap the selected window.
        // Start filter: keep rows whose latest date is >= chosen start.
        const matchesStartDate = selectedStartDate
          ? rowMax
            ? rowMax >= new Date(selectedStartDate)
            : false
          : true

        // End filter: keep rows whose earliest date is <= chosen end.
        const matchesEndDate = selectedEndDate
          ? rowMin
            ? rowMin <= new Date(selectedEndDate)
            : false
          : true
        const matchesLifeCyclePhase = selectedLifeCyclePhase
          ? row.life_cycle_phase === selectedLifeCyclePhase
          : true

        const filteredTimelineEvent = searchText
          ? searchText.toLowerCase().trim()
          : ""
        const matchesText = (text) =>
          text && text.toLowerCase().includes(filteredTimelineEvent)

        const matchesAnyCondition = [
          matchesText(row.timelineEvent.title),
          matchesText(row.associated_agreement),
          matchesText(row.type),
          row.names.some((person) => matchesText(person.name)),
        ].some(Boolean)

        return (
          matchesSpeaker &&
          matchesAnyCondition &&
          isSelectedAssociatedAgreement &&
          isSelectedType &&
          matchesStartDate &&
          matchesEndDate &&
          filteredTags &&
          matchesLifeCyclePhase
        )
      })
      .sort((a, b) => {
        const ad = a.date_min ?? a.date ?? new Date(0)
        const bd = b.date_min ?? b.date ?? new Date(0)
        return ad - bd
      })
  }
</script>

<div id="site-content">
  <Header />

  <IntroContent />

  <section class="table-container">
    <Options
      {dataset}
      filteredData={filteredData()}
      bind:row
      bind:selectedSpeaker
      bind:selectedType
      bind:selectedAssociatedAgreement
      bind:searchText
      bind:selectedStartDate
      bind:selectedEndDate
      bind:selectedLifeCyclePhase
      bind:selectedTags
    />

    <Table filteredData={filteredData()} bind:row />
  </section>
  <About />
  <Footer />
</div>

<style lang="scss">
  @use "../scss/components/table-container";
</style>
