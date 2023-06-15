(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rootnode = _interopRequireDefault(require("./rootnode"));
var _synsetnode = _interopRequireDefault(require("./synsetnode"));
var _link = _interopRequireDefault(require("./link"));
var _labelnode = _interopRequireDefault(require("./labelnode"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*global createjs:true*/

class Graph {
  /**
   * The Graph class is responsible for parsing the Constellation JSON and creating all subclasses based on the data
   * and drawing everything to Canvas. It also computes all the Node distances
   *
   * @param {String} wf - the wordform or Word for the current constellation
   * @param {Object} stage - the createjs.Stage instance created during the Wordmap _buildStage() call
   * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
   * @param {Boolean} animate - Used to turn animation on/off. Default is on
   * @param {Function} fetchConstellationData - The method for fetching constellation data used in the Constellation component. Used as a CB in the classes
   * @param {Object} wordmap - The instance of the Wordmap class that instantiates this graph
   */
  constructor(wordForm, stage, mode, animate, fetchConstellationData, wordmap) {
    this.ANIMATION_DURATION = 750;
    this.CHANGE_GRAPH_ANIMATION_DURATION = this.ANIMATION_DURATION * 1.5;
    this.CURRENT = null;
    this.wordForm = wordForm;
    this.stage = stage;
    this.mode = mode != null ? mode : 'word';
    this.animate = animate != null ? animate : true;
    this.nodes = [];
    this.links = [];
    this.wordmap = wordmap;
    this.fetchCallback = fetchConstellationData;
    this.addToStage();
    this._buildRootNode();
  }

  // Adds a createJS Container instance to the stage
  addToStage() {
    this.container = new createjs.Container();
    this.stage.addChild(this.container);
  }

  // Removes a createJS Container instance from the the stage
  removeFromStage() {
    this.stage.removeChild(this.container);
  }

  // constructs the RootNode element that will be placed at the center of the Constellation.
  _buildRootNode() {
    this.centerPoint = new createjs.Point(this.stage.width / 2, this.stage.height / 2);
    this.rootNode = new _rootnode.default(this.wordForm, this, this.mode);
    this.rootNode.updatePosition(this.centerPoint.x, this.centerPoint.y);
  }

  /**
   * Draws the constellation JSON to the container by calling all other builder/draw methods in this class
   *
   * @param {Object} constellationJson - The JSON for the word represented by that Node.
   */
  draw(constellationJson) {
    this._parse(constellationJson.children, this.rootNode);
    this._computeRingRadii();
    this._buildLayout(this.rootNode);
    this._drawRings();
    this._jitter();
    this.show();
  }

  /**
   * Iterates through the Constellation JSON and creates SynsetNodes or LabelNode objects based on the type of node
   * represented by the child.
   *
   * @param {Array} children - The JSON for the word represented by that Node.
   * @param {Object} parentNode - The RootNode object that all children stem from. The Center Node of the Constellation
   */
  _parse(children, parentNode) {
    let defn, id, j, jsonNode, len, link, node, pos, results, type;
    results = [];
    for (j = 0, len = children.length; j < len; j++) {
      jsonNode = children[j];
      id = jsonNode.i;
      type = jsonNode.t || 'label';
      pos = jsonNode.p;
      defn = jsonNode.d;
      if (type === 'ss') {
        node = new _synsetnode.default(id, defn, pos, this, this.stage, type, jsonNode.l, this.mode);
      } else {
        node = new _labelnode.default(id, this, this.mode, this.fetchCallback, this.wordmap, type);
      }

      // if jsonNode.l === 1 then the word is an antonym and we pass true to the link constructor so that the Link class
      // can create the link in red
      link = jsonNode.l === 1 ? new _link.default(parentNode, node, true, this.stage, this.mode) : new _link.default(parentNode, node, false, this.stage, this.mode);
      this.nodes.push(node);
      this.links.push(link);
      if (jsonNode.children) {
        results.push(this._parse(jsonNode.children, node));
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

  // computes the radius for the rings of the Constellation
  _computeRingRadii() {
    let max_radius;
    if (this.ringRadius != null) {
      return;
    }
    max_radius = Math.min(this.centerPoint.x, this.centerPoint.y);
    return this.ringRadius = [0, max_radius * 9 / 25, max_radius * 16 / 25, max_radius];
  }

  /**
   * Iterates through the child nodes and calculates the space they use. This method is responsible for building the
   * layout of all children Nodes in relation to the RootNode
   *
   * @param {Object} rootNode - The RootNode for the constellation.
   */
  _buildLayout(rootNode) {
    let allocatedWedge, availableWedge, bloom, calculatedWedge, coords, j, k, len, len1, maxAllowedWedge, n, ref, ref1, results, startAngle, theta, totalBloom;
    if (!rootNode) {
      return;
    }
    availableWedge = rootNode.wedge();
    startAngle = rootNode.startAngle();
    totalBloom = rootNode.totalBloom();
    ref = rootNode.childNodes;
    for (j = 0, len = ref.length; j < len; j++) {
      n = ref[j];
      bloom = n.maxBloom();
      maxAllowedWedge = 150;
      calculatedWedge = availableWedge * (bloom / totalBloom);
      allocatedWedge = Math.min(maxAllowedWedge, calculatedWedge);
      theta = -startAngle - allocatedWedge / 2;
      n.setSlice(allocatedWedge, startAngle, theta);
      startAngle += allocatedWedge;
      coords = this._coordinatesFromAngle(n.distance_from_center(), theta);
      n.updatePosition(coords.x, coords.y);
    }
    ref1 = rootNode.childNodes;
    results = [];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      n = ref1[k];
      results.push(this._buildLayout(n));
    }
    return results;
  }

  // draws the rings that serve as the background for the Constellation memlet
  _drawRings() {
    let c, i, j, len, r, ref, results, rings;
    rings = new createjs.Container();
    this.container.addChild(rings);
    this.container.setChildIndex(rings, 1);
    ref = this.ringRadius;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      r = ref[i];
      if (i !== 0) {
        c = new createjs.Shape();
        c.graphics.beginFill('#607784').drawCircle(0, 0, r);
        c.x = this.centerPoint.x;
        c.y = this.centerPoint.y;
        c.alpha = 1.0 / i;
        results.push(rings.addChild(c));
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

  // Calculates the center point of the Container and adds a RootNode to it. Also what animates all the Nodes when building
  // the initial Graph
  show() {
    let j, k, l, len, len1, len2, len3, m, n, o, ref, ref1, ref2, ref3, results;
    ref = this.links;
    for (j = 0, len = ref.length; j < len; j++) {
      l = ref[j];
      this.container.addChild(l);
    }
    ref1 = this.nodes;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      n = ref1[k];
      this.container.addChild(n);
      n.x = this.centerPoint.x;
      n.y = this.centerPoint.y;
      n.setupAnimation(this.centerPoint);
    }
    this.container.addChild(this.rootNode);
    this.rootNode.show(this.centerPoint, this.animate);
    ref2 = this.nodes;
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      n = ref2[m];
      n.show(this.centerPoint, this.animate);
    }
    if (this.animate) {
      return setTimeout(function (_this) {
        return function () {
          let len3, o, ref3, results;
          ref3 = _this.links;
          results = [];
          for (o = 0, len3 = ref3.length; o < len3; o++) {
            l = ref3[o];
            results.push(l.show(false));
          }
          return results;
        };
      }(this), this.ANIMATION_DURATION + 10);
    } else {
      ref3 = this.links;
      results = [];
      for (o = 0, len3 = ref3.length; o < len3; o++) {
        l = ref3[o];
        results.push(l.show(false));
      }
      return results;
    }
  }

  // prevent overlaps by jittering all nodes. We can do a better with a
  // collision detection mechanism TODO
  _jitter() {
    let c, collision, coords, count, i, j, jitter, labelNodes, len, nodes, prevNode, ref, results;
    labelNodes = this._labelNodesByLevel();
    ref = this.ringRadius;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      prevNode = null;
      nodes = labelNodes[i];
      results.push(function () {
        let k, len1, results1;
        results1 = [];
        for (i = k = 0, len1 = nodes.length; k < len1; i = ++k) {
          c = nodes[i];
          if (i === 0) {
            prevNode = c;
            continue;
          }
          collision = c.collides(prevNode);
          count = 0;
          jitter = Math.random() > 0.5 ? 5 : -5;
          while (collision) {
            c.accumulateJitter(jitter);
            coords = this._coordinatesFromAngle(c.distance_from_center() + c.jitter, c.theta());
            c.updatePosition(coords.x, coords.y);
            collision = c.collides(prevNode);
            count += 1;
            if (count > 8) {
              //safety
              break;
            }
          }
          results1.push(prevNode = c);
        }
        return results1;
      }.call(this));
    }
    return results;
  }
  _labelNodesByLevel() {
    let c, i, j, k, len, len1, nodesByLevel, ref, ref1;
    nodesByLevel = {};
    ref = this.ringRadius;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      nodesByLevel[i] = [];
    }
    ref1 = this.nodes;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      c = ref1[k];
      if (c.type === 'label') {
        nodesByLevel[c.level].push(c);
      }
    }
    return nodesByLevel;
  }
  _coordinatesFromAngle(l, theta) {
    let x, y;
    x = l * Math.cos(theta * Math.PI / 180);
    y = l * Math.sin(theta * Math.PI / 180);
    x += this.centerPoint.x;
    y += this.centerPoint.y;
    return {
      x: x,
      y: y
    };
  }
}
exports.default = Graph;

},{"./labelnode":3,"./link":4,"./rootnode":7,"./synsetnode":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _graph = _interopRequireDefault(require("./graph"));
var _request = _interopRequireDefault(require("./request"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*global createjs:true*/

class Wordmap {
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
    mode = 'word',
    // default's to 'word'
    animate = true,
    // default's to true
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
    });
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
      return createjs.Tween.get(this.currentGraph).to({
        alpha: 0.3
      }, this.currentGraph.CHANGE_GRAPH_ANIMATION_DURATION).call(() => this.showWord(wf));
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
    this.currentGraph = new _graph.default(wf, this.stage, null, null, this.fetchCallback, this);
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
    return this.stage.scaleY = ratio;
  }
  _buildGraph() {
    this._buildStage();
    this.currentGraph = new _graph.default(this.constellationJson.i, this.stage, this.mode, this.animate, this.fetchCallback, this);
    // the draw call is what actually puts everything in place and displays the Constellation for the given word
    this.currentGraph.draw(this.constellationJson);
  }

  /**
   * Loads data to for constellation to render on canvas.
  */

  async _loadData({
    url,
    data,
    fetchCallback
  }) {
    if (!url) {
      this.fetchCallback = fetchCallback;
      this.constellationJson = data;
    } else {
      this.request = new _request.default({
        url
      });
      this.constellationJson = await this.request.fetchConstellationData();
    }
    this._buildGraph();
  }
}
exports.default = Wordmap;
(() => {
  if (typeof window !== 'undefined') {
    window.Wordmap = Wordmap;
  }
})();

},{"./graph":1,"./request":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*global createjs:true*/

class LabelNode extends _node.default {
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
    return this.computedPosition = new createjs.Point(x, y);
  }

  // sets up the Node animation
  setupAnimation() {
    this.label.font = this._fntSize() + 'px Verdana ';
    this._centerLabelAroundPosition();
    return this.tween = createjs.Tween.get(this, {
      paused: true
    }).to({
      x: this.computedPosition.x,
      y: this.computedPosition.y,
      alpha: 1
    }, this.graph.ANIMATION_DURATION);
  }

  /**
   * Animates the LabelNode to it's position on the Graph
   */
  show() {
    this.tween.setPaused(false);
    return this.tween.addEventListener('change', () => this.incomingLink.show());
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
    return this.jitter += j;
  }

  // Animates the Node to the center of the graph when clicked
  moveToCenter() {
    this.center = this.graph.centerPoint;
    this.tween = createjs.Tween.get(this, {
      paused: true
    }).to({
      x: this.center.x,
      y: this.center.y,
      alpha: 1
    }, this.graph.CHANGE_GRAPH_ANIMATION_DURATION);
    return this.tween.setPaused(false).addEventListener('change', function (_this) {
      return function () {
        _this.updatePosition(_this.x, _this.y);
        return _this.incomingLink.show();
      };
    }(this));
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
    return this.label.x = -bounds.width / 2;
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
    hit.graphics.beginFill('#000').drawRect(0, 0, this.label.getMeasuredWidth() + 5, this.label.getMeasuredHeight() + 5);
    this.label.hitArea = hit;
  }
  _fntSize() {
    return [0, 17, 12, 10][this.level];
  }
  _handleRollover() {
    return this.label.color = '#fff';
  }
  _handleRollout() {
    return this.label.color = this.color;
  }

  // When a LabelNode is clicked we call the callback function from the Constellation Component to fetch new Constellation
  // JSON and trigger a new word
  _handleClick() {
    const constellationCallback = res => this.wordmap.showNode(this, res);
    this.fetchCallback(this.id, constellationCallback);
  }
}
exports.default = LabelNode;

},{"./node":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tooltip = _interopRequireDefault(require("./tooltip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*global createjs:true*/

const TOOLTIP_DESCRIPTIONS_BY_NODE_TYPE = {
  0: {
    code: 'hypernym',
    description: 'kind of',
    direction: 'up'
  },
  1: {
    code: 'antonym',
    description: 'opposite of',
    direction: 'none'
  },
  2: {
    code: 'entailment',
    description: 'if true then also true',
    direction: 'up'
  },
  3: {
    code: 'cause',
    description: 'causes',
    direction: 'none'
  },
  4: {
    code: 'similar_to',
    description: 'similar to',
    direction: 'none'
  },
  5: {
    code: 'pertainym',
    description: 'of or pertaining to',
    direction: 'up'
  },
  6: {
    code: 'attribute',
    description: 'attribute of',
    direction: 'down'
  },
  7: {
    code: 'see_also',
    description: 'see also',
    direction: 'none'
  },
  8: {
    code: 'holonym',
    description: 'part of',
    direction: 'up'
  }
};
class Link extends createjs.Container {
  /**
   * The Link class represents a single line connecting two Nodes in the Graph.
   *
   * @param {Object} n1 - The Node to be linked FROM
   * @param {Object} n2 - The Node to be linked TO
   * @param {Boolean} isAntonym - is the Link for an Antonym (These links are a different color from the others)
   * @param {Object} stage - A reference to the Stage object that Nodes are drawn to
   * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
   */
  constructor(n1, n2, isAntonym, stage, mode) {
    super();
    this.n1 = n1;
    this.n2 = n2;
    this._stage = stage;
    this.mode = mode;
    this.hoverable = n1.type === 'ss' && n2.type === 'ss';
    this.isAntonym = isAntonym;
    this.initialize();
    this.n2.setParentNode(this.n1);
    this.line = new createjs.Shape();
    this.addChild(this.line);
    this.n2.incomingLink = this;
    if (this.hoverable) {
      this._setupHandler();
    }
  }

  // Builds the createjs.Point object representing the x/y coordinates of the source and destination Nodes to be Linked
  show() {
    const from = new createjs.Point(this.n1.x, this.n1.y);
    const to = new createjs.Point(this.n2.x, this.n2.y);
    if (this.hoverable) {
      this._createTooltip();
    }
    return this._draw(from, to);
  }
  _getTooltipCoordinates(node1, node2) {
    const x = (node1.x + node2.x) / 2;
    const y = (node1.y + node2.y) / 2;
    return {
      x,
      y
    };
  }
  _getTooltipMessage() {
    const partOfSpeech = TOOLTIP_DESCRIPTIONS_BY_NODE_TYPE[this.n2.l];
    return `${partOfSpeech.code}: ${partOfSpeech.description}`;
  }
  _createTooltip() {
    const {
      x,
      y
    } = this._getTooltipCoordinates(this.n1, this.n2);
    const tooltipMessage = this._getTooltipMessage();
    this.linkToolTip = new _tooltip.default(x, y, this._stage, tooltipMessage);
    return this.linkToolTip;
  }

  /**
   * Draws the actual Link (a line) from one point to another.
   *
   * @param {Object} from - The Point the Link will start at
   * @param {Object} to - The Point the link will end at
   */
  _draw(from, to) {
    this.line.graphics.clear();
    this.hoverable && this.line.graphics.setStrokeDash([7, 3], 0);
    this.line.graphics.beginStroke(this.isAntonym ? 'rgba(164,36,41,0.3)' : 'rgba(255,255,255,0.75)');
    this.hoverable && this.line.graphics.setStrokeStyle(3);
    this.line.graphics.moveTo(from.x, from.y);
    this.line.graphics.lineTo(to.x, to.y);
    return this.line.graphics.endStroke();
  }

  // Sets up the rollover/rollout event handlers by binding them to the current links scope so that 'this' references
  // the current Link object in the event handlers
  _setupHandler() {
    // incase of word mode only handler will be applicable.
    if (this.mode === 'word') {
      this.line.cursor = 'hand';
      // necessary so the event handlers have access to the class context
      this._handleRollout = this._handleRollout.bind(this);
      this._handleRollover = this._handleRollover.bind(this);
      this.line.addEventListener('rollover', this._handleRollover);
      this.line.addEventListener('rollout', this._handleRollout);
    }
  }
  _handleRollover() {
    this.line.graphics.clear();
    this.line.graphics.setStrokeDash([7, 3], 0);
    this.line.graphics.setStrokeStyle(6);
    this.line.graphics.beginStroke(this.isAntonym ? 'rgba(198,4,8,0.75)' : 'rgba(255,255,255,0.75)');
    this.line.graphics.moveTo(this.n1.x, this.n1.y);
    this.line.graphics.lineTo(this.n2.x, this.n2.y);
    this.linkToolTip.showTooltip();
    return this.line.graphics.endStroke();
  }
  _handleRollout() {
    this.line.graphics.clear();
    this.linkToolTip.hideTooltip();
    return this.show();
  }
}
exports.default = Link;

},{"./tooltip":9}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*global createjs:true*/

class Node extends createjs.Container {
  /**
   * The Node class is the parent of all other ___Node classes. Contains all common functionality between RootNode,
   * SynsetNode, and LabelNodes.
   *
   * @param {String} id - the wordform or Word for the current constellation
   * @param {String} type - the type of Node
   * @param {Object} graph - the Graph instance that the RootNode is being added to
   */
  constructor(id, type, graph) {
    super();
    this.initialize();
    this.id = id;
    this.type = type;
    this.level = null;
    this.incomingLink = null;
    this.graph = graph;
    this.childNodes = [];
  }

  /**
   * Adds a child node to the childNodes array
   *
   * @param {Object} node - The node to be added to the childNodes array
   */
  addChildNode(node) {
    return this.childNodes.push(node);
  }
  distance_from_center() {
    return 0;
  }
  wedge() {
    return this.w;
  }
  startAngle() {
    return this.a;
  }
  theta() {
    return this.t;
  }

  // displays the node by updating it's x/y position based on the computedPosition from the subclass itself
  show() {
    this.x = this.computedPosition.x;
    this.y = this.computedPosition.y;
    return this.alpha = 1.0;
  }

  /**
   * Sets the parent Node of the current Node
   *
   * @param {Object} parent - the parent Node to be set
   */
  setParentNode(parent) {
    this.parentNode = parent;
    this.level = parent.level + 1;
    return this.parentNode.addChildNode(this);
  }

  // returns an array of all sibling nodes
  siblingNodes() {
    return this.parentNode.childNodes.filter(n => n.id !== this.id);
  }

  /**
   * Sets the wedge, startAngle and theta of the current Node
   *
   * @param {number} wedge
   * @param {number} startAngle
   * @param {number} theta
   */
  setSlice(wedge, startAngle, theta) {
    this.w = wedge;
    this.a = startAngle;
    return this.t = theta;
  }
  collides(n2) {
    let b1, b2;
    b1 = this.globalBounds();
    b2 = n2.globalBounds();
    return b1.x < b2.x + b2.width && b1.x + b1.width > b2.x && b1.y < b2.y + b2.height && b1.height + b1.y > b2.y;
  }
  maxBloom() {
    let m1, m2;
    m1 = Math.max.apply(Math, this.childNodes.map(function (c) {
      return c.maxBloom();
    }));
    m2 = Math.max(this.childNodes.length, 1);
    return Math.max(m1, m2);
  }
  totalBloom() {
    let blooms;
    blooms = this.childNodes.map(function (s) {
      return s.maxBloom();
    });
    if (blooms.length === 0) {
      return 1;
    }
    return blooms.reduce(function (x, y) {
      return x + y;
    });
  }
}
exports.default = Node;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class Request {
  constructor({
    url
  }) {
    this.url = url;
  }

  /**
   * @fetchConstellationData 
   *   Fetch Constellation data based on the provided url.
   * 
  */
  async fetchConstellationData() {
    return await fetch(this.url).then(res => res.json()).then(data => {
      return data;
    });
  }
}
exports.default = Request;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*global createjs:true*/

class RootNode extends _node.default {
  /**
   * The RootNode class represents the center Node of every Constellation. It is the Node for the word being viewed.
   *
   * @param {String} wf - the wordform or Word for the current constellation
   * @param {Object} graph - the Graph instance that the RootNode is being added to
   * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
   */
  constructor(wf, graph, mode) {
    super();
    if (mode == null) {
      mode = 'word';
    }
    this.wf = wf;
    this.level = 0;
    this.father = null;
    this.mode = mode;
    this._buildRootLabel();
    this.alpha = 0;
  }
  wedge() {
    return 360;
  }
  startAngle() {
    return 0;
  }

  /**
   * Updates the x/y position of the RootNode on the Graph
   *
   * @param {number} x - The x coordinate to be updated
   * @param {number} y - The y coordinate to be updated
   */
  updatePosition(x, y) {
    this.computedPosition = new createjs.Point(x, y);
    x = -this.label.getMeasuredWidth() / 2;
    y = -this.label.getMeasuredHeight() / 2;
    this.label.x = x;
    return this.label.y = y;
  }

  // builds the text label shown under the RootNode
  _buildRootLabel() {
    this.label = new createjs.Text(this.mode === 'word' ? this.wf : '?');
    let shadow = new createjs.Shadow('#000000', 1, 1, 1);
    this.label.shadow = shadow;
    this.label.font = '30px Verdana ';
    this.label.color = '#ddd';
    return this.addChild(this.label);
  }
}
exports.default = RootNode;

},{"./node":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _tooltip = _interopRequireDefault(require("./tooltip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*global createjs:true*/

class SynsetNode extends _node.default {
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
    return this.graph.ringRadius[this.level];
  }

  // sets up the animation of the SynsetNode
  setupAnimation() {
    return this.tween = createjs.Tween.get(this, {
      paused: true
    }).to({
      x: this.computedPosition.x,
      y: this.computedPosition.y,
      alpha: 1
    }, this.graph.ANIMATION_DURATION);
  }

  // Shows the Node
  show() {
    this.tween.setPaused(false);
    return this.tween.addEventListener('change', () => this.incomingLink.show());
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
    this.ssNodetooltip = new _tooltip.default(x, y, this._stage, this._buildTextForLabel(this.defn));
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
exports.default = SynsetNode;

},{"./node":5,"./tooltip":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*global createjs:true*/

class ToolTip {
  constructor(x, y, stage, toolTipText) {
    this.x = x;
    this.y = y;
    this.stage = stage;
    this.toolTipText = toolTipText;
    this.toolTipRectangle;
  }
  _createToolTipRectangle(createBelowNode, commonValues) {
    const {
      height,
      width,
      toolTipColor
    } = commonValues;
    let toolTipDimensions = {
      height,
      width
    };
    if (createBelowNode) {
      this.toolTipRectangle = {
        x: this.x - width / 2,
        y: this.y + height / 2,
        ...toolTipDimensions
      };
    } else {
      this.toolTipRectangle = {
        x: this.x - width / 2,
        y: this.y - 105,
        ...toolTipDimensions
      };
    }
    const filledRectangle = new createjs.Graphics().beginFill(toolTipColor).drawRoundRect(this.toolTipRectangle.x, this.toolTipRectangle.y, width, height, 5);
    return new createjs.Shape(filledRectangle);
  }
  _createToolTipPoint(createBelowNode, commonValues, rectangle) {
    const {
      height,
      width,
      toolTipColor
    } = commonValues;
    let pointAngle, toolTipPoint;
    if (createBelowNode) {
      pointAngle = 150;
      toolTipPoint = {
        x: rectangle.x + width / 2,
        y: rectangle.y - 5
      };
    } else {
      pointAngle = 90;
      toolTipPoint = {
        x: rectangle.x + width / 2,
        y: rectangle.y + height + 5.5
      };
    }

    // build the pointed bottom of the tooltip
    const toolTipTriangle = new createjs.Graphics().beginFill(toolTipColor).drawPolyStar(toolTipPoint.x, toolTipPoint.y, 12, 3, 0, pointAngle);
    return new createjs.Shape(toolTipTriangle);
  }
  _createToolTipDefinitionText(createBelowNode, commonValues) {
    const {
      height,
      width,
      textTopPadding,
      textSidePadding
    } = commonValues;
    const definitionText = new createjs.Text();
    const commonTextSettings = {
      lineWidth: width - textSidePadding,
      font: '14px BrandonTextRegular',
      color: 'white',
      text: this.toolTipText
    };
    let definitionTextSettings;
    if (createBelowNode) {
      definitionTextSettings = {
        ...commonTextSettings,
        x: this.x - width / 2 + textSidePadding,
        y: this.y + height / 2 + textTopPadding
      };
    } else {
      definitionTextSettings = {
        ...commonTextSettings,
        x: this.x - width / 2 + textSidePadding,
        y: this.y - 100 + textTopPadding
      };
    }
    definitionText.set(definitionTextSettings);
    return definitionText;
  }
  showTooltip() {
    const createBelowNode = this.y < 125;
    const commonValues = {
      height: 75,
      width: this.stage.fullscreen ? 400 : 225,
      toolTipColor: 'rgba(21, 31, 35, 0.90)',
      textTopPadding: 5,
      textSidePadding: 10
    };
    this.definitionToolTip = this._createToolTipRectangle(createBelowNode, commonValues);
    // this.toolTipRectangle is set in the _createToolTipRectangle function... not the prettiest but we need those values
    this.toolTipPoint = this._createToolTipPoint(createBelowNode, commonValues, this.toolTipRectangle);
    this.definitionText = this._createToolTipDefinitionText(createBelowNode, commonValues);

    // add the opacity here
    this.definitionToolTip.filters = [new createjs.BlurFilter(2, 2)];
    this.toolTipPoint.filters = [new createjs.BlurFilter(2, 2)];

    // add all the shapes and text to the stage
    this.stage.addChild(this.toolTipPoint, this.definitionToolTip, this.definitionText);
  }
  hideTooltip() {
    this.stage.removeChild(this.definitionText, this.definitionToolTip, this.toolTipPoint);
  }
}
exports.default = ToolTip;

},{}]},{},[2]);
