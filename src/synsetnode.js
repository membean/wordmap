import Node from './node';
import ToolTip from './tooltip';
import createjs from 'createjs-module';

export default class SynsetNode extends Node {
  /**
   * The SynsetNode class represents all the colored Nodes on the Graph that show definitions when you mouse over them.
   * These Nodes are not clickable like LabelNodes as they represent definitions based on different parts of speech that
   * are color coded.
   *
   * @param {String} id - the wordform or Word for the current constellation
   * @param {String} defn - the definition text to be displayed on rollover
   * @param {String} partOfSpeech - the part of speech the SynsetNode represents
   * @param {Object} graph - the Graph instance that the RootNode is being added to
   * @param {Object} stage - A reference to the Stage object that Nodes are drawn on
   * @param {String} type - either 'label' or 'ss' (synset) to signify what type of node this is
   * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
   */
  constructor(id, defn, partOfSpeech, graph, stage, type, l, mode) {
    super(id, type, graph);
    this.l = l;
    this.defn = defn;
    this.partOfSpeech = partOfSpeech;
    this.bubbleRadius = 5;
    this.color = this._color();
    this.graph = graph;
    this.mode = mode;
    this._stage = stage;
    this._buildBubble();
    this._setupHandlers();
  }

  // returns the distance from the center of the graph
  distance_from_center() {
    return this.graph.ringRadius[ this.level ];
  }

  // sets up the animation of the SynsetNode
  setupAnimation() {
    return (this.tween = createjs.Tween.get(this, {
      paused: true
    }).to(
      {
        x: this.computedPosition.x,
        y: this.computedPosition.y,
        alpha: 1
      },
      this.graph.ANIMATION_DURATION
    ));
  }

  // Shows the Node
  show() {
    this.tween.setPaused(false);
    return this.tween.addEventListener('change', () =>
      this.incomingLink.show()
    );
  }

  // Sets up the Node event handlers by binding them to the current SynsetNode scope. We do this so that 'this' references
  // the target SynsetNode during events
  _setupHandlers() {
    if (this.mode === 'word') {
      this.b.cursor = 'pointer';
      // necessary so the event handlers have access to the class context
      this._handleRollout = this._handleRollout.bind(this);
      this._handleRollover = this._handleRollover.bind(this);

      this.b.addEventListener('rollover', this._handleRollover);
      return this.b.addEventListener('rollout', this._handleRollout);
    }
  }

  /**
   * Updates the x/y position of the SynsetNode on the Graph
   *
   * @param {number} x - The x coordinate to be updated
   * @param {number} y - The y coordinate to be updated
   */
  updatePosition(x, y) {
    this.computedPosition = new createjs.Point(x, y);
    this.ssNodetooltip = new ToolTip(
      x,
      y,
      this._stage,
      this._buildTextForLabel(this.defn)
    );
  }

  // builds the actual colored circle on the Graph that represents this SynsetNode
  _buildBubble() {
    let shadow;
    this.b = new createjs.Shape();
    this._drawBubble(1, this.bubbleRadius);
    shadow = new createjs.Shadow('#000000', 1, 1, 1);
    this.b.shadow = shadow;
    return this.addChild(this.b);
  }

  /**
   * Draws the actual shape by setting it's Stroke style and color and radius
   *
   * @param {number} stroke - The stroke size of the bubble Shape
   * @param {number} radius - The radius of the bubble Shape
   */
  _drawBubble(stroke, radius) {
    this.b.graphics.clear();
    this.b.graphics.setStrokeStyle(stroke);
    this.b.graphics.beginStroke('#000000');
    return this.b.graphics.beginFill(this.color).drawCircle(0, 0, radius);
  }

  // returns the color code based on the part of speech of the Node
  _color() {
    switch (this.partOfSpeech) {
      case 'n':
        return '#FF7F00';
      case 'v':
        return '#99DD45';
      case 'a':
        return '#CCCC33';
      case 'r':
        return '#CC12F6';
      default:
        return 'white';
    }
  }

  _handleRollover() {
    this._drawBubble(2, this.bubbleRadius + 3);
    this.ssNodetooltip.showTooltip();
  }

  _handleRollout() {
    this.ssNodetooltip.hideTooltip();
    this._drawBubble(1, this.bubbleRadius);
  }

  /**
   * Adds the Part Of Speech in front of the Node's definition text
   *
   * @param {String} definitionText - The definition text string
   */
  _buildTextForLabel(definitionText) {
    switch (this.partOfSpeech) {
      case 'n':
        return `noun: ${definitionText}`;
      case 'v':
        return `verb: ${definitionText}`;
      case 'a':
        return `adj: ${definitionText}`;
      case 'r':
        return `adverb: ${definitionText}`;
      default:
        return definitionText;
    }
  }
}
