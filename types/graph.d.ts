export default class Graph {
    /**
     * The Graph class is responsible for parsing the Constellation JSON and creating all subclasses based on the data
     * and drawing everything to Canvas. It also computes all the Node distances
     *
     * @param {String} wf - the wordform or Word for the current constellation
     * @param {Object} stage - the createjs.Stage instance created during the Wordmap _buildStage() call
     * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
     * @param {String} operation - used to determine the constellaton operation in case of question mode, defaults to 'view' which is used in questions page and 'edit' to shows tooltip on synset nodes
     * @param {Boolean} animate - Used to turn animation on/off. Default is on
     * @param {Function} fetchConstellationData - The method for fetching constellation data used in the Constellation component. Used as a CB in the classes
     * @param {Object} wordmap - The instance of the Wordmap class that instantiates this graph
     */
    constructor(wordForm: any, stage: any, mode: string, animate: boolean, fetchConstellationData: Function, wordmap: any, operation: string);
    ANIMATION_DURATION: number;
    CHANGE_GRAPH_ANIMATION_DURATION: number;
    CURRENT: any;
    wordForm: any;
    stage: any;
    mode: string;
    operation: string;
    animate: boolean;
    nodes: any[];
    links: any[];
    wordmap: any;
    fetchCallback: Function;
    addToStage(): void;
    container: any;
    removeFromStage(): void;
    _buildRootNode(): void;
    centerPoint: any;
    rootNode: RootNode;
    /**
     * Draws the constellation JSON to the container by calling all other builder/draw methods in this class
     *
     * @param {Object} constellationJson - The JSON for the word represented by that Node.
     */
    draw(constellationJson: any): void;
    /**
     * Iterates through the Constellation JSON and creates SynsetNodes or LabelNode objects based on the type of node
     * represented by the child.
     *
     * @param {Array} children - The JSON for the word represented by that Node.
     * @param {Object} parentNode - The RootNode object that all children stem from. The Center Node of the Constellation
     */
    _parse(children: any[], parentNode: any): any;
    _computeRingRadii(): number[];
    ringRadius: number[];
    /**
     * Iterates through the child nodes and calculates the space they use. This method is responsible for building the
     * layout of all children Nodes in relation to the RootNode
     *
     * @param {Object} rootNode - The RootNode for the constellation.
     */
    _buildLayout(rootNode: any): any;
    _drawRings(): any[];
    show(): any[] | NodeJS.Timeout;
    _jitter(): any[];
    _labelNodesByLevel(): {};
    _coordinatesFromAngle(l: any, theta: any): {
        x: number;
        y: number;
    };
}
import RootNode from './rootnode';
