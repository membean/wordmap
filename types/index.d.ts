export default class Wordmap {
    /**
     * Creates a Wordmap. The highest class in the hierarchy for Constellations. This instance is created once in the
     * Constellation component and is responsible for drawing the graph for words and updating the graph to new words.
     *
     * @param {Object} containerEl [Required] - a reference to the wordmap-container div from the Constellation component
     * @param {String} mode [Optional] - used to determine the constellaton mode
     *    Default value is 'word'
     * @param {Boolean} animate [Optional] - Used to turn animation on/off. Default is on
     *    Default value is true
     * @param {String} url - used to fetch the constellation data.
     *    [Required] - In case when constellation need to use in readonly mode label click will be disabled eg. question page.
     *    [Optional] - In case when constellation need to be interactive eg word mode
     * @param {Object} data - The JSON for the active word constellation
     *    [Required] - In case of Interactive mode of constellation like forward backword mode.
     * @param {Function} fetchCallback - The callback method to fetch data for constellation, callback trigger when click on label.  which accepts 2 args like word & callback with data to renrender graph.
     *    [Required] - In case of Interactive mode of constellation like forward backword mode.
     * @param {Object} props [Optional] - The Constellation component props
     *    Default value is {}
     */
    constructor({ containerEl, mode, animate, url, data, fetchCallback, props }: any);
    containerEl: any;
    mode: any;
    animate: any;
    props: any;
    /**
     * Used to update a word when a user interacts with the Constellation. this method triggers the animation for the Word clicks
     *
     * @param {Object} node - The instance of the LabelNode that was clicked.
     * @param {Object} constellationJson - The JSON for the word represented by that Node.
     */
    showNode(node: any, constellationJson: any): any;
    constellationJson: any;
    /**
     * Used to show the word on first render and when user is navigating history
     *
     * @param {String} wf - The WordForm or Word being displayed
     */
    showWord(wf: string): void;
    currentGraph: Graph;
    _buildStage(): any;
    canvas: HTMLCanvasElement;
    stage: any;
    ticker: any;
    _retinize(): number;
    _buildGraph(): void;
    /**
     * Loads data to for constellation to render on canvas.
    */
    _loadData({ url, data, fetchCallback }: {
        url: any;
        data: any;
        fetchCallback: any;
    }): Promise<void>;
    fetchCallback: any;
    request: Request;
}
import Graph from './graph';
import Request from './request';
