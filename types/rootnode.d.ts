export default class RootNode extends Node {
    /**
     * The RootNode class represents the center Node of every Constellation. It is the Node for the word being viewed.
     *
     * @param {String} wf - the wordform or Word for the current constellation
     * @param {Object} graph - the Graph instance that the RootNode is being added to
     * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
     */
    constructor(wf: string, graph: any, mode: string);
    wf: string;
    level: number;
    father: any;
    mode: string;
    /**
     * Updates the x/y position of the RootNode on the Graph
     *
     * @param {number} x - The x coordinate to be updated
     * @param {number} y - The y coordinate to be updated
     */
    updatePosition(x: number, y: number): number;
    computedPosition: any;
    _buildRootLabel(): any;
    label: any;
}
import Node from './node';
