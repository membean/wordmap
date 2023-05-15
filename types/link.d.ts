export default class Link {
    /**
     * The Link class represents a single line connecting two Nodes in the Graph.
     *
     * @param {Object} n1 - The Node to be linked FROM
     * @param {Object} n2 - The Node to be linked TO
     * @param {Boolean} isAntonym - is the Link for an Antonym (These links are a different color from the others)
     * @param {Object} stage - A reference to the Stage object that Nodes are drawn to
     */
    constructor(n1: any, n2: any, isAntonym: boolean, stage: any);
    n1: any;
    n2: any;
    _stage: any;
    hoverable: boolean;
    isAntonym: boolean;
    line: any;
    show(): any;
    _getTooltipCoordinates(node1: any, node2: any): {
        x: number;
        y: number;
    };
    _getTooltipMessage(): string;
    _createTooltip(): tooltip;
    linkToolTip: tooltip;
    /**
     * Draws the actual Link (a line) from one point to another.
     *
     * @param {Object} from - The Point the Link will start at
     * @param {Object} to - The Point the link will end at
     */
    _draw(from: any, to: any): any;
    _setupHandler(): void;
    _handleRollout(): any;
    _handleRollover(): any;
}
import tooltip from './tooltip';
