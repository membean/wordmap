export default class Request {
    constructor({ url }: {
        url: any;
    });
    url: any;
    /**
     * @fetchConstellationData
     *   Fetch Constellation data based on the provided url.
     *
    */
    fetchConstellationData(): Promise<any>;
}
