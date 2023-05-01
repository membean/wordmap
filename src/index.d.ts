declare module 'wordmap' {
    export default class Wordmap {
        /**
         * Creates a Wordmap. The highest class in the hierarchy for Constellations. This instance is created once in the
         * Constellation component and is responsible for drawing the graph for words and updating the graph to new words.
         *
         * @param {Object} containerEl - a reference to the wordmap-container div from the Constellation component
         * @param {String} wf - the wordform or Word for the current constellation
         * @param {String} mode - used to determine the constellaton mode, defaults to 'word' which is used for WordPage
         * @param {Boolean} animate - Used to turn animation on/off. Default is on
         * @param {Object} data - The JSON for the active word constellation
         * @param {Function} fetchConstellationData - The method for fetching constellation data used in the Constellation component. Used as a CB in the classes
         * @param {Object} props - The Constellation component props
         */
        constructor(containerEl: any, wf: string, mode: string, animate: boolean, data: any, fetchConstellationData: Function, props: any);

    }

}
