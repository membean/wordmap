

export default class Request {
  constructor(url) {
    this.url = url
  }

  /**
   * Fetchs the constellation data.
   * 
  */
  async fetchConstellationData(url) {
    return await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        return data;
      })
  }

}
