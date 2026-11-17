// Page-local script. The framework is available as window.VS once vs.page.js has loaded.
VS.on('page:ready', async () => {
  // Render library blocks anywhere inside your own markup:
  await VS.blocks.render([
    { type: 'callout', tone: 'info', title: 'Library blocks work here too', text: 'Use `VS.blocks.render([...], element)`.' }
  ], document.getElementById('mount'), { base: location.href });
});
