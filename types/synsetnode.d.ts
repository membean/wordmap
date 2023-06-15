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
    constructor(id: string, defn: string, partOfSpeech: string, graph: any, stage: any, type: string, l: any, mode: string);
    l: any;
    defn: string;
    partOfSpeech: string;
    bubbleRadius: number;
    color: string;
    mode: string;
    _stage: any;
    distance_from_center(): any;
    setupAnimation(): any;
    tween: any;
    show(): any;
    _setupHandlers(): any;
    _handleRollout(): void;
    _handleRollover(): void;
    /**
     * Updates the x/y position of the SynsetNode on the Graph
     *
     * @param {number} x - The x coordinate to be updated
     * @param {number} y - The y coordinate to be updated
     */
    updatePosition(x: number, y: number): void;
    computedPosition: any;
    ssNodetooltip: ToolTip;
    _buildBubble(): any;
    b: any;
    /**
     * Draws the actual shape by setting it's Stroke style and color and radius
     *
     * @param {number} stroke - The stroke size of the bubble Shape
     * @param {number} radius - The radius of the bubble Shape
     */
    _drawBubble(stroke: number, radius: number): any;
    _color(): "white" | "#FF7F00" | "#99DD45" | "#CCCC33" | "#CC12F6";
    /**
     * Adds the Part Of Speech in front of the Node's definition text
     *
     * @param {String} definitionText - The definition text string
     */
    _buildTextForLabel(definitionText: string): string;
}
import Node from './node';
import ToolTip from './tooltip';
