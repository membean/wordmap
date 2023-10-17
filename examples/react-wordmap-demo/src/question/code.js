export const snippet = `new WordMap({
  containerEl: containerRef.current,
  url: 'url-to-constellation-json-data',
  mode: "question"
})`

export const editSnippet = `new WordMap({
  containerEl: containerRef.current,
  url: 'url-to-constellation-json-data',
  mode: "question",
  props: {
    operation: 'edit'
  }
})`
