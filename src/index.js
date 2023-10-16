import Graph from './graph';
import Request from './request';
import createjs from 'createjs-module';

export default class Wordmap {
  /**
   * Creates a Wordmap. The highest class in the hierarchy for Constellations. This instance is created once in the
   * Constellation component and is responsible for drawing the graph for words and updating the graph to new words.
   *
   * @param {Object} containerEl [Required] - a reference to the wordmap-container div from the Constellation component
   * @param {String} mode [Optional] - used to determine the constellaton mode
   *    Default value is 'word'
   * @param {Boolean} animate [Optional] - Used to turn animation on/off. Default is on
   *    Default value is true
   * @param {String} url - used to fetch the constellation data.
   *    [Required] - In case when constellation need to use in readonly mode label click will be disabled eg. question page.
   *    [Optional] - In case when constellation need to be interactive eg word mode
   * @param {Object} data - The JSON for the active word constellation
   *    [Required] - In case of Interactive mode of constellation like forward backword mode.
   * @param {Function} fetchCallback - The callback method to fetch data for constellation, callback trigger when click on label.  which accepts 2 args like word & callback with data to renrender graph.
   *    [Required] - In case of Interactive mode of constellation like forward backword mode.
   *    Default will be empty function.
   * @param {Object} props [Optional] - The Constellation component props
   *    Default value is {}
   */

  constructor({
    containerEl,
    mode = 'word', // default's to 'word'
    animate = true, // default's to true
    url,
    data,
    fetchCallback = () => {},
    props = {} // default's to {}
  }) {
    this.containerEl = containerEl;
    this.mode = mode;
    this.animate = animate;
    // keep a reference to the Constellation component props
    this.props = props;

    this._loadData({
      url,
      data,
      fetchCallback
    })
  }

  /**
   * Used to update a word when a user interacts with the Constellation. this method triggers the animation for the Word clicks
   *
   * @param {Object} node - The instance of the LabelNode that was clicked.
   * @param {Object} constellationJson - The JSON for the word represented by that Node.
   */
  showNode(node, constellationJson) {
    const wf = node.id;
    this.constellationJson = constellationJson;

    if (this.animate) {
      node.moveToCenter();
      return createjs.Tween.get(this.currentGraph)
        .to(
          {
            alpha: 0.3
          },
          this.currentGraph.CHANGE_GRAPH_ANIMATION_DURATION
        )
        .call(() => this.showWord(wf));
    } else {
      return this.showWord(wf);
    }
  }

  /**
   * Used to show the word on first render and when user is navigating history
   *
   * @param {String} wf - The WordForm or Word being displayed
   */
  showWord(wf) {
    if (this.currentGraph) {
      this.currentGraph.removeFromStage();
    }
    this.currentGraph = new Graph(
      wf,
      this.stage,
      null,
      null,
      this.fetchCallback,
      this
    );
    this.currentGraph.draw(this.constellationJson);
  }

  // This method creates the canvas element and set's up the initial dimensions and other configurations for the Constellation
  _buildStage() {
    let h, w;
    this.canvas = document.createElement('canvas');
    this.containerEl.appendChild(this.canvas);
    h = this.containerEl.offsetHeight;
    w = this.containerEl.offsetWidth;
    this.canvas.width = w;
    this.canvas.height = h;

    // creates the Stage that all Constellation data will be drawn to
    this.stage = new createjs.Stage(this.canvas);
    this.stage.width = this.canvas.width;
    this.stage.height = this.canvas.height;
    this.stage.enableMouseOver(10);
    this.stage.fullscreen = this.props.fullscreen;
    this.stage.props = this.props;
    this._retinize();
    this.ticker = createjs.Ticker;
    return this.ticker.addEventListener('tick', this.stage);
  }

  _retinize() {
    let ratio;
    ratio = window.devicePixelRatio || 1;
    this.canvas.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';
    this.canvas.width *= ratio;
    this.canvas.height *= ratio;
    this.stage.scaleX = ratio;
    return (this.stage.scaleY = ratio);
  }

  _buildGraph() {
    this._buildStage();
    this.currentGraph = new Graph(
      this.constellationJson.i,
      this.stage,
      this.mode,
      this.animate,
      this.fetchCallback,
      this,
      this.props.operation
    );
    // the draw call is what actually puts everything in place and displays the Constellation for the given word
    this.currentGraph.draw(this.constellationJson);
  }

  /**
   * Loads data to for constellation to render on canvas.
  */

  async _loadData({ url, data, fetchCallback }) {
    if (!url) {
      this.fetchCallback = fetchCallback;
      this.constellationJson = data;
    } else {
      this.request = new Request({ url });
      this.constellationJson = await this.request.fetchConstellationData();
    }

    this._buildGraph()
  }
}


(() => {
  if (typeof window !== 'undefined') {
    window.Wordmap = Wordmap;
  }
})()
