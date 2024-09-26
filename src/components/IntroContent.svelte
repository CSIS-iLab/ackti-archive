<script>
  import Icon from "./Icons.svelte"
</script>

<div class="wrapper">
  <main class="container intro-content">
    <div class="intro-content__container">
      <div class="intro-content">
        <p class="intro-content__overline--regular">
          <span class="intro-content__overline-text">By the Project on Nuclear Issues</span>
        </p>
        <h1 class="intro-content__title">
          <span class="intro-content__title-text">Arms Control Knowledge </span>
        </h1>
        <h1 class="intro-content__title">
          <span class="intro-content__title-text">Transfer Initiative</span>
        </h1>
        <h1 class="intro-content__title">
          <span class="intro-content__title-text">Primary Source Archive</span>
        </h1>
        <p class="intro-content__introduction">
          An expanding library of primary source documents related to the design, negotiation, and implementation of arms control across US history, <br>from the <a
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
