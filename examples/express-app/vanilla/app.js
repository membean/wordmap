window.addEventListener('load', () => {
  const containerRef = document.querySelector(".container");
  
  new window.wordmap({
    containerEl: containerRef,
    url: './api/data.json'
  })
  
})
