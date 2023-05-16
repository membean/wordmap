window.addEventListener('load', () => {
  const containerRef = document.querySelector(".container");
  
  new window.Wordmap({
    containerEl: containerRef,
    url: './api/data.json'
  })
  
})
