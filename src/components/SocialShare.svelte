<script>
  import Icon from './Icons.svelte';

  function copyURL(e) {
    e.preventDefault()
    const url = window.location.href
    //Use the clipboard's writeText method to pass the inputs text to the clipboard
    navigator.clipboard.writeText(url).then(res=>{
    })
  }
</script>

<ul class="share">
  <li class="share__item">
    <a href="https://www.facebook.com/sharer.php?u={window.location.href}" class="share__link" target="_blank" aria-label="Share on Facebook">
      <Icon class="icon__share" name="Icon-Facebook" />
    </a>
  </li>
  <li class="share__item">
    <a href="https://twitter.com/intent/tweet?url={window.location.href}&amp;via=CSIS&amp;related=CSIS" class="share__link" target="_blank" aria-label="Share on Twitter">
      <Icon class="icon__share" name="Icon-twitter" />
    </a>
  </li>
  <li class="share__item">
    <a href="https://www.linkedin.com/shareArticle?mini=true&url={window.location.href}&source=CSIS" class="share__link" target="_blank" aria-label="Share on Linkedin">
      <Icon class="icon__share" name="Icon-linkedin" />
    </a>
  </li>
  <li class="share__item">
    <a href="mailto:energy@csis.org?subject=State Energy | CSIS Energy Security and Climate Change Program" class="share__link" aria-label="Share via email">
      <Icon class="icon__share" name="Icon-email" />
    </a>
  </li>
  <li class="share__item">
    <button class="share__link" aria-label="Copy URL" on:click={copyURL}>
      <Icon class="icon__share" name="Icon-link-chain" />
    </button>
  </li>
</ul>

<style lang="scss">
  @use "../scss/components/social-share";
</style>
