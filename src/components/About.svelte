<script>
  import Icon from "./Icons.svelte"
</script>

<section class="about" id="about">
  <div class="about__container">
    <h2 class="about__subtitle">About</h2>
    <div class="about__description">
      <p>
        Founded in 2003, the Project on Nuclear Issues (PONI) is the premier
        networked community of next generation professionals prepared to meet
        the nuclear challenges of the future. PONI programs provide inclusive,
        diverse, and creative opportunities for emerging experts to learn about
        nuclear issues and engage thoughtfully with the nuclear community. PONI
        also conducts cutting-edge research and analysis on three main topic
        areas: deterrence and escalation, risk reduction and arms control, and
        disarmament.
      </p>
    </div>
    <div class="about__reports">
      <p class="about__reports__title">Associated Reports</p>
      <ul>
        <li>
          <a
            class="about__reports__link"
            href="https://features.csis.org/deter-and-divide-russia-nuclear-rhetoric/index.html"
            target="_blank"
            >Deter and Divide: Russia's Nuclear Rhetoric & Escalation Risks in
            Ukraine<span class="icon-container"
              ><Icon class="icon__report" name="Icon-open-blank" /></span
            ></a
          >
        </li>
      </ul>
    </div>
    <div class="about__development">
      <h3 class="about__development__title">Development Team</h3>
      <p class="about__development__description">
        This database is a product of the <a
          class="about__development__link"
          href="https://www.csis.org/programs/dracopoulos-ideas-lab"
          target="_blank">Andreas C. Dracopoulos iDeas Lab</a
        >, the in-house digital, multimedia, and design agency at the Center for
        Strategic and International Studies.
      </p>
      <p class="about__development__description">
        Produced by Mariel de la Garza, José Romero, and Lindsay Urchyk.
        <br />
        Copyediting by Katherine Stark and Rayna Salam.
        <br />
        Cover design by Michael Kohler.
      </p>
    </div>
    <div class="back-top-container">
      <a class="back-top-container__link" href="#top"
        ><span>Back to Top</span><span
          class="back-top-container__icon-container back-top__icon-container"
        >
          <Icon class="icon__back-top" name="Icon-arrow-up" />
        </span>
      </a>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../scss/components/about";
</style>
