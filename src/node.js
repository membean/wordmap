/*global createjs:true*/

export default class Node extends createjs.Container {
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
    return (this.alpha = 1.0);
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
    return (this.t = theta);
  }

  collides(n2) {
    let b1, b2;
    b1 = this.globalBounds();
    b2 = n2.globalBounds();
    return (
      b1.x < b2.x + b2.width &&
      b1.x + b1.width > b2.x &&
      b1.y < b2.y + b2.height &&
      b1.height + b1.y > b2.y
    );
  }

  maxBloom() {
    let m1, m2;
    m1 = Math.max.apply(
      Math,
      this.childNodes.map(function (c) {
        return c.maxBloom();
      })
    );
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
