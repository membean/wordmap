import RootNode from './rootnode';
import SynsetNode from './synsetnode';
import Link from './link';
import LabelNode from './labelnode';
/*global createjs:true*/

export default class Graph {
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
    this.centerPoint = new createjs.Point(
      this.stage.width / 2,
      this.stage.height / 2
    );
    this.rootNode = new RootNode(this.wordForm, this, this.mode);
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
        node = new SynsetNode(
          id,
          defn,
          pos,
          this,
          this.stage,
          type,
          jsonNode.l
        );
      } else {
        node = new LabelNode(
          id,
          this,
          this.mode,
          this.fetchCallback,
          this.wordmap,
          type
        );
      }

      // if jsonNode.l === 1 then the word is an antonym and we pass true to the link constructor so that the Link class
      // can create the link in red
      link =
        jsonNode.l === 1
          ? new Link(parentNode, node, true, this.stage)
          : new Link(parentNode, node, false, this.stage);
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
    return (this.ringRadius = [
      0,
      (max_radius * 9) / 25,
      (max_radius * 16) / 25,
      max_radius
    ]);
  }

  /**
   * Iterates through the child nodes and calculates the space they use. This method is responsible for building the
   * layout of all children Nodes in relation to the RootNode
   *
   * @param {Object} rootNode - The RootNode for the constellation.
   */
  _buildLayout(rootNode) {
    let allocatedWedge,
      availableWedge,
      bloom,
      calculatedWedge,
      coords,
      j,
      k,
      len,
      len1,
      maxAllowedWedge,
      n,
      ref,
      ref1,
      results,
      startAngle,
      theta,
      totalBloom;
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
      return setTimeout(
        (function (_this) {
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
        })(this),
        this.ANIMATION_DURATION + 10
      );
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
    let c,
      collision,
      coords,
      count,
      i,
      j,
      jitter,
      labelNodes,
      len,
      nodes,
      prevNode,
      ref,
      results;
    labelNodes = this._labelNodesByLevel();
    ref = this.ringRadius;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      prevNode = null;
      nodes = labelNodes[i];
      results.push(
        function () {
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
              coords = this._coordinatesFromAngle(
                c.distance_from_center() + c.jitter,
                c.theta()
              );
              c.updatePosition(coords.x, coords.y);
              collision = c.collides(prevNode);
              count += 1;
              if (count > 8) {
                //safety
                break;
              }
            }
            results1.push((prevNode = c));
          }
          return results1;
        }.call(this)
      );
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
    x = l * Math.cos((theta * Math.PI) / 180);
    y = l * Math.sin((theta * Math.PI) / 180);
    x += this.centerPoint.x;
    y += this.centerPoint.y;
    return {
      x: x,
      y: y
    };
  }
}
