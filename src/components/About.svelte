<script>
  import Icon from "./Icons.svelte";
</script>

<section class="about" id="about">
  <div class="about__container">
    <h2 class="about__subtitle">About</h2>
    <div class="about__description">
      <p>
        This database details a curated selection of activities in the areas of emissions reduction,
        economic development, and climate resilience from 16 diverse and representative states.
        The activities included are derived from research conducted for the Clean Resilient State Initiative
        and are deemed novel, impactful, or otherwise significant by the researchers. 
      </p>
      <p>
        The 16 states highlighted in this database were selected to reflect the diversity in state
        approaches to energy and emissions. Half of the states were selected due to their roles as the top U.S.
        energy consumers (TX, CA, LA, FL, NY, PA, OH, IL), representing each census region of the country
        (Northeast, Midwest, West, and South).  The other half (MA, MN, OR, NM, GA, SD, VA, WY) were selected to
        ensure a diversity of regulatory and political environments for climate and energy issues. For more
        details, see the appendices of the associated reports, below. 
      </p>
    </div>
    <div class="about__reports">
      <p class="about__reports__title">Associated Reports</p>
      <ul>
        <li><a class="about__reports__link" href="https://www.csis.org/analysis/insights-emissions-reduction-among-us-states" target="_blank">Insights on Emissions Reduction among U.S. States<span class="icon-container"><Icon class="icon__report" name="Icon-open-blank"/></span></a></li>
        <li><a class="about__reports__link" href="https://www.csis.org/analysis/state-strategies-expanding-economic-opportunity-clean-energy" target="_blank">State Strategies for Expanding Economic Opportunity in Clean Energy<span class="icon-container"><Icon class="icon__report" name="Icon-open-blank"/></span></a></li>
        <li><a class="about__reports__link" href="https://www.csis.org/analysis/making-energy-resilient" target="_blank">Making Energy Resilient<span class="icon-container"><Icon class="icon__report" name="Icon-open-blank"/></span></a></li>
      </ul>
    </div>
    <div class="about__initiative">
      <p>The <a class="about__initiative__link" href="https://www.csis.org/programs/energy-security-and-climate-change-program/projects/clean-resilient-states-initiative" target="_blank">Clean Resilient States Initiative</a> is a project developed by the
        CSIS Energy Security & Climate Change Program to assess the extent to which
        state policies facilitate greenhouse gas emissions reductions, positive economic
        outcomes, and resilience to climate-related impacts. This database and its respective
        papers are meant to provide guidance to policymakers, identify priorities for future
        research, and promote knowledge sharing among key stakeholders.
      </p>
    </div>
    <div class="about__development">
      <h3 class="about__development__title">Development Team</h3>
      <p class="about__development__description">The database template is a product of the <a class="about__development__link" href="https://www.csis.org/programs/dracopoulos-ideas-lab" target="_blank">Andreas C. Dracopoulos iDeas Lab</a>, the in-house digital, multimedia, and design agency at the Center for Strategic and International Studies.</p>
      <p class="about__development__description">Produced by <a class="about__development__link" href="https://www.csis.org/people/jose-romero" target="_blank" rel="noopener noreferrer">José Romero</a>.</p>
    </div>
    <div class="back-top-container">
    <a class="back-top-container__link" href="#top"><span>Back to Top</span><span class="back-top-container__icon-container back-top__icon-container">
        <Icon class="icon__back-top" name="Icon-arrow-up" />
      </span>
    </a>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../scss/components/about";
</style>
