export default class ToolTip {
    constructor(x: any, y: any, stage: any, toolTipText: any);
    x: any;
    y: any;
    stage: any;
    toolTipText: any;
    _createToolTipRectangle(createBelowNode: any, commonValues: any): any;
    toolTipRectangle: {
        height: any;
        width: any;
        x: number;
        y: any;
    } | {
        height: any;
        width: any;
        x: number;
        y: number;
    };
    _createToolTipPoint(createBelowNode: any, commonValues: any, rectangle: any): any;
    _createToolTipDefinitionText(createBelowNode: any, commonValues: any): any;
    showTooltip(): void;
    definitionToolTip: any;
    toolTipPoint: any;
    definitionText: any;
    hideTooltip(): void;
}
