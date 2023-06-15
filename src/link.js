/*global createjs:true*/
import tooltip from './tooltip';

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

export default class Link extends createjs.Container {
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
    return { x, y };
  }

  _getTooltipMessage() {
    const partOfSpeech = TOOLTIP_DESCRIPTIONS_BY_NODE_TYPE[this.n2.l];
    return `${partOfSpeech.code}: ${partOfSpeech.description}`;
  }

  _createTooltip() {
    const { x, y } = this._getTooltipCoordinates(this.n1, this.n2);
    const tooltipMessage = this._getTooltipMessage();
    this.linkToolTip = new tooltip(x, y, this._stage, tooltipMessage);
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
    this.line.graphics.beginStroke(
      this.isAntonym ? 'rgba(164,36,41,0.3)' : 'rgba(255,255,255,0.75)'
    );
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
    this.line.graphics.beginStroke(
      this.isAntonym ? 'rgba(198,4,8,0.75)' : 'rgba(255,255,255,0.75)'
    );
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
