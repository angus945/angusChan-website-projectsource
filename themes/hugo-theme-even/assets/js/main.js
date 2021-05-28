$(document).ready(function()
{
  Even.backToTop();
  Even.mobileNavbar();
  Even.toc();
  Even.fancybox();
});
window.addEventListener('load', function()
{
  Even._initToc();
})

Even.responsiveTable();
Even.flowchart();
Even.sequence();

if (window.hljs) {
  hljs.initHighlighting();
  Even.highlight();
} else {
  Even.chroma();
}

