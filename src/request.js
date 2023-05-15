

export default class Request {
  constructor({
    url
  }) {
    this.url = url
  }

  /**
   * @fetchConstellationData 
   *   Fetch Constellation data based on the provided url.
   * 
  */
  async fetchConstellationData() {
    return await fetch(this.url)
      .then(res => res.json())
      .then(data => {
        return data;
      })
  }

}
