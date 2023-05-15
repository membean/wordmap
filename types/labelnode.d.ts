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
    constructor(id: string, graph: any, mode: string, fetchConstellationData: Function, wordmap: any, type: string);
    mode: string;
    color: string;
    wordmap: any;
    fetchCallback: Function;
    jitter: number;
    /**
     * updates the computedPosition of the Node
     *
     * @param {number} x - The x value of the Node on the Graph
     * @param {number} y - The y value of the Node on the Graph
     */
    updatePosition(x: number, y: number): any;
    computedPosition: any;
    setupAnimation(): any;
    tween: any;
    /**
     * Animates the LabelNode to it's position on the Graph
     */
    show(): any;
    distance_from_center(): any;
    accumulateJitter(j: any): any;
    moveToCenter(): any;
    center: any;
    globalBounds(debug?: boolean): {
        x: number;
        y: number;
        width: number;
        height: any;
    };
    _centerLabelAroundPosition(): number;
    _color(): string;
    _setupHandler(): void;
    _handleRollout(): string;
    _handleRollover(): string;
    _handleClick(): void;
    _buildLabelNode(): void;
    container: any;
    label: any;
    _fntSize(): number;
}
import Node from './node';
