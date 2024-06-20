<script>
  import SocialShare from './SocialShare.svelte';

</script>
<header class="header">
  <div class="header__inner">
    <a href="https://www.csis.org" alt="CSIS website logo" title="Go home" aria-label="Go home">
      <span class="header__logo"></span>
    </a>
    <SocialShare />
  </div>
</header>

<style lang="scss">
  @use "../scss/layout/header";
</style>
