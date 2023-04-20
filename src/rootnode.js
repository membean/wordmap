import Node from './node';
/*global createjs:true*/

export default class RootNode extends Node {
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
    return (this.label.y = y);
  }

  // builds the text label shown under the RootNode
  _buildRootLabel() {
    this.label = new createjs.Text( this.mode === 'word' ? this.wf : '?');
    let shadow = new createjs.Shadow('#000000', 1, 1, 1);
    this.label.shadow = shadow;
    this.label.font = '30px Verdana ';
    this.label.color = '#ddd';
    return this.addChild(this.label);
  }
}
