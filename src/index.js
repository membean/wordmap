import Graph from './graph';
/*global createjs:true*/

export default class Wordmap {
  /**
   * Creates a Wordmap. The highest class in the hierarchy for Constellations. This instance is created once in the
   * Constellation component and is responsible for drawing the graph for words and updating the graph to new words.
   *
   * @param {Object} containerEl - a reference to the wordmap-container div from the Constellation component
   * @param {String} wf - the wordform or Word for the current constellation
   * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
   * @param {Boolean} animate - Used to turn animation on/off. Default is on
   * @param {Object} data - The JSON for the active word constellation
   * @param {Function} fetchConstellationData - The method for fetching constellation data used in the Constellation component. Used as a CB in the classes
   * @param {Object} props - The Constellation component props
   */
  constructor(
    containerEl,
    wf,
    mode,
    animate,
    data,
    fetchConstellationData,
    props
  ) {
    this.mode = mode != null ? mode : 'word';
    this.fetchConstellationData = fetchConstellationData;
    this.animate = animate != null ? animate : true;
    this.containerEl = containerEl;
    this.constellationJson = data;

    // keep a reference to the Constellation component props
    this.props = props;

    this._buildStage();
    this.currentGraph = new Graph(
      wf,
      this.stage,
      this.mode,
      this.animate,
      this.fetchConstellationData,
      this
    );
    // the draw call is what actually puts everything in place and displays the Constellation for the given word
    this.currentGraph.draw(data);
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
      this.fetchConstellationData,
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
}
