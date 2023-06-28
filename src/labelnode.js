import Node from './node';
import createjs from 'createjs-module';

export default class LabelNode extends Node {
  /**
   * The LabelNode class represents all Nodes on the constellation that have a Text Label. These are all the Nodes that
   * when clicked will fetch constellation JSON for that word and redraw the Graph.
   *
   * @param {String} id - the wordform or Word for the current constellation
   * @param {Object} graph - the Graph instance that the RootNode is being added to
   * @param {String} mode - the mode type, defaults to word
   * @param {Function} fetchConstellationData - the Constellation component function used to fetch new constellation JSON and update Redux
   * @param {Object} wordmap - A reference to the Wordmap object that contains the current constellation
   * @param {String} type - either 'label' or 'ss'(synset) to signify what type of node this is
   */
  constructor(id, graph, mode, fetchConstellationData, wordmap, type) {
    super(id, type, graph);
    this.mode = mode != null ? mode : 'word';
    this.color = this._color();
    this.graph = graph;
    this.id = id;
    this.wordmap = wordmap;
    this.fetchCallback = fetchConstellationData;
    this.jitter = 0;
    this._buildLabelNode();
    this._setupHandler();
  }

  /**
   * updates the computedPosition of the Node
   *
   * @param {number} x - The x value of the Node on the Graph
   * @param {number} y - The y value of the Node on the Graph
   */
  updatePosition(x, y) {
    return (this.computedPosition = new createjs.Point(x, y));
  }

  // sets up the Node animation
  setupAnimation() {
    this.label.font = this._fntSize() + 'px Verdana ';
    this._centerLabelAroundPosition();
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

  /**
   * Animates the LabelNode to it's position on the Graph
   */
  show() {
    this.tween.setPaused(false);
    return this.tween.addEventListener('change', () =>
      this.incomingLink.show()
    );
  }

  // calculates the Nodes distance from the center of the Graph
  distance_from_center() {
    let offset;
    offset = 25;
    return this.graph.ringRadius.map(function (r) {
      return Math.max(0, r - offset);
    })[this.level];
  }

  accumulateJitter(j) {
    return (this.jitter += j);
  }

  // Animates the Node to the center of the graph when clicked
  moveToCenter() {
    this.center = this.graph.centerPoint;
    this.tween = createjs.Tween.get(this, {
      paused: true
    }).to(
      {
        x: this.center.x,
        y: this.center.y,
        alpha: 1
      },
      this.graph.CHANGE_GRAPH_ANIMATION_DURATION
    );
    return this.tween.setPaused(false).addEventListener(
      'change',
      (function (_this) {
        return function () {
          _this.updatePosition(_this.x, _this.y);
          return _this.incomingLink.show();
        };
      })(this)
    );
  }

  globalBounds(debug = false) {
    let b, bounds, d, real_width, x, y;
    d = this.label.getBounds();
    // width seems to always be undercomputed. Perhaps it's a font issue.
    // This hack seems to work well
    real_width = d.width * 1.3;
    x = this.computedPosition.x - real_width / 2;
    y = this.computedPosition.y - this.label.y;
    bounds = {
      x: x,
      y: y,
      width: real_width,
      height: d.height
    };
    if (debug) {
      // draw a box showing bounds
      b = new createjs.Shape();
      b.graphics.beginFill('#000').drawRect(x, y, real_width, d.height);
      this.graph.container.addChild(b);
    }
    return bounds;
  }

  // centers the Node's text label below the Node
  _centerLabelAroundPosition() {
    let bounds;
    bounds = this.label.getBounds();
    if (this.computedPosition.y < this.graph.centerPoint.y) {
      this.label.y = -1.5 * this.label.getMeasuredHeight();
      this.label.y = -1.5 * bounds.height;
    }
    return (this.label.x = -bounds.width / 2);
  }

  // the color of the node
  _color() {
    return '#ccc';
  }

  // Sets up the Node event handlers by binding them to the current LabelNodes scope. We do this so that 'this' references
  // the target LabelNode during events
  _setupHandler() {
    if (this.mode === 'word') {
      this.container.cursor = 'pointer';

      // necessary so the event handlers have access to the class context
      this._handleRollout = this._handleRollout.bind(this);
      this._handleRollover = this._handleRollover.bind(this);
      this._handleClick = this._handleClick.bind(this);

      this.container.addEventListener('rollover', this._handleRollover);
      this.container.addEventListener('rollout', this._handleRollout);
      this.container.addEventListener('click', this._handleClick);
    }
  }

  // builds the actual Node with the text label that will be displayed on the Graph
  _buildLabelNode() {
    let b, hit, shadow;
    this.container = new createjs.Container();
    this.addChild(this.container);
    this.label = new createjs.Text(this.id);
    shadow = new createjs.Shadow('#000000', 1, 1, 1);
    this.label.shadow = shadow;
    this.label.color = this.color;
    this.container.addChild(this.label);
    this.label.baseline = 'middle';
    b = new createjs.Shape();
    b.graphics.beginFill(this.color).drawCircle(0, 0, 2);
    this.container.addChild(b);
    hit = new createjs.Shape();
    hit.graphics
      .beginFill('#000')
      .drawRect(
        0,
        0,
        this.label.getMeasuredWidth() + 5,
        this.label.getMeasuredHeight() + 5
      );
    this.label.hitArea = hit;
  }

  _fntSize() {
    return [0, 17, 12, 10][this.level];
  }

  _handleRollover() {
    return (this.label.color = '#fff');
  }

  _handleRollout() {
    return (this.label.color = this.color);
  }

  // When a LabelNode is clicked we call the callback function from the Constellation Component to fetch new Constellation
  // JSON and trigger a new word
  _handleClick() {
    const constellationCallback = res => this.wordmap.showNode(this, res);
    this.fetchCallback(this.id, constellationCallback);
  }
}
