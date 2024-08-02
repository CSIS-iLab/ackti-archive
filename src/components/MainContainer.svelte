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
  let selectedMonth = ""
  let searchText
  let selectedYear = ""
  $: row = { isOpen: false }

  $: filteredData = () => {
    return dataset.data
      .filter((row) => {
        const rowDate = new Date(row.date_string)
        const rowYear = rowDate.getFullYear()
        const rowMonth = rowDate.toLocaleString("default", { month: "long" })

        const matchesYear = selectedYear ? rowYear === selectedYear : true
        const matchesMonth = selectedMonth ? rowMonth === selectedMonth : true
        const matchesSpeaker = selectedSpeaker
          ? row.names.some(person => person.name.trim().toLowerCase() === selectedSpeaker.trim().toLowerCase())
          : true
        const isSelectedAssociatedAgreement = selectedAssociatedAgreement
          ? row.associated_agreement === selectedAssociatedAgreement
          : true
        const isSelectedType = selectedType ? row.type === selectedType : true

        const filteredTimelineEvent = searchText
          ? searchText.toLowerCase().trim()
          : ""
        const matchesText = (text) => text && text.toLowerCase().includes(filteredTimelineEvent)

        const matchesAnyCondition = [
          matchesText(row.timelineEvent.title),
          matchesText(row.associated_agreement),
          matchesText(row.type),
          row.names.some(person => matchesText(person.name))
        ].some(Boolean)

        return (
          matchesYear &&
          matchesMonth &&
          matchesSpeaker &&
          matchesAnyCondition &&
          isSelectedAssociatedAgreement &&
          isSelectedType
        )
      })
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
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
      bind:selectedMonth
      bind:selectedYear
    />

    <Table filteredData={filteredData()} bind:row />
  </section>
  <About />
  <Footer />
</div>

<style lang="scss">
  @use "../scss/components/table-container";
</style>
