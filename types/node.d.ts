export default class Node {
    /**
     * The Node class is the parent of all other ___Node classes. Contains all common functionality between RootNode,
     * SynsetNode, and LabelNodes.
     *
     * @param {String} id - the wordform or Word for the current constellation
     * @param {String} type - the type of Node
     * @param {Object} graph - the Graph instance that the RootNode is being added to
     */
    constructor(id: string, type: string, graph: any);
    id: string;
    type: string;
    level: any;
    incomingLink: any;
    graph: any;
    childNodes: any[];
    /**
     * Adds a child node to the childNodes array
     *
     * @param {Object} node - The node to be added to the childNodes array
     */
    addChildNode(node: any): number;
    distance_from_center(): number;
    wedge(): number;
    startAngle(): number;
    theta(): number;
    show(): number;
    x: any;
    y: any;
    alpha: number;
    /**
     * Sets the parent Node of the current Node
     *
     * @param {Object} parent - the parent Node to be set
     */
    setParentNode(parent: any): any;
    parentNode: any;
    siblingNodes(): any;
    /**
     * Sets the wedge, startAngle and theta of the current Node
     *
     * @param {number} wedge
     * @param {number} startAngle
     * @param {number} theta
     */
    setSlice(wedge: number, startAngle: number, theta: number): number;
    w: number;
    a: number;
    t: number;
    collides(n2: any): boolean;
    maxBloom(): number;
    totalBloom(): any;
}
