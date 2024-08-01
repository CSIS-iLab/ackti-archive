<script>
  import Icon from "./Icons.svelte"
</script>

<div class="wrapper">
  <main class="container intro-content">
    <div class="intro-content__container">
      <div class="intro-content__flex-left">
        <p class="intro-content__overline--regular">
          By the Project on Nuclear Issues
        </p>
        <h1 class="intro-content__title">
          Nuclear Signaling during the War in Ukraine
        </h1>
        <p class="intro-content__introduction">
          A curated database of events illustrating the evolution of nuclear
          threats in the lead-up to—and throughout the first year of—the war in
          Ukraine, from the <a
            class="intro-content__link"
            href="https://www.csis.org/programs/international-security-program/project-nuclear-issues"
            target="_blank">CSIS Project on Nuclear Issues</a
          >.
        </p>
        <p class="intro-content__more">
          <a class="intro-content__link intro-content__link--more" href="#about"
            ><span class="intro-content__more__icon-container">
              <Icon class="icon__info" name="Icon-info" />
            </span><span>More on this database</span></a
          >
        </p>
      </div>
      <div class="intro-content__flex-right"></div>
    </div>
  </main>
</div>

<style lang="scss">
  @use "../scss/components/intro-content";
</style>
