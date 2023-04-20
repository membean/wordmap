/*global createjs:true*/

export default class ToolTip {
  constructor(x, y, stage, toolTipText) {
    this.x = x;
    this.y = y;
    this.stage = stage;
    this.toolTipText = toolTipText;
    this.toolTipRectangle;
  }

  _createToolTipRectangle(createBelowNode, commonValues) {
    const { height, width, toolTipColor } = commonValues;

    let toolTipDimensions = { height, width };

    if (createBelowNode) {
      this.toolTipRectangle = {
        x: this.x - width / 2,
        y: this.y + height / 2,
        ...toolTipDimensions
      };
    } else {
      this.toolTipRectangle = {
        x: this.x - width / 2,
        y: this.y - 105,
        ...toolTipDimensions
      };
    }

    const filledRectangle = new createjs.Graphics()
      .beginFill(toolTipColor)
      .drawRoundRect(
        this.toolTipRectangle.x,
        this.toolTipRectangle.y,
        width,
        height,
        5
      );

    return new createjs.Shape(filledRectangle);
  }

  _createToolTipPoint(createBelowNode, commonValues, rectangle) {
    const { height, width, toolTipColor } = commonValues;

    let pointAngle, toolTipPoint;

    if (createBelowNode) {
      pointAngle = 150;
      toolTipPoint = {
        x: rectangle.x + width / 2,
        y: rectangle.y - 5
      };
    } else {
      pointAngle = 90;
      toolTipPoint = {
        x: rectangle.x + width / 2,
        y: rectangle.y + height + 5.5
      };
    }

    // build the pointed bottom of the tooltip
    const toolTipTriangle = new createjs.Graphics()
      .beginFill(toolTipColor)
      .drawPolyStar(toolTipPoint.x, toolTipPoint.y, 12, 3, 0, pointAngle);

    return new createjs.Shape(toolTipTriangle);
  }

  _createToolTipDefinitionText(createBelowNode, commonValues) {
    const { height, width, textTopPadding, textSidePadding } = commonValues;
    const definitionText = new createjs.Text();
    const commonTextSettings = {
      lineWidth: width - textSidePadding,
      font: '14px BrandonTextRegular',
      color: 'white',
      text: this.toolTipText
    };

    let definitionTextSettings;

    if (createBelowNode) {
      definitionTextSettings = {
        ...commonTextSettings,
        x: this.x - width / 2 + textSidePadding,
        y: this.y + height / 2 + textTopPadding
      };
    } else {
      definitionTextSettings = {
        ...commonTextSettings,
        x: this.x - width / 2 + textSidePadding,
        y: this.y - 100 + textTopPadding
      };
    }

    definitionText.set(definitionTextSettings);

    return definitionText;
  }

  showTooltip() {
    const createBelowNode = this.y < 125;
    const commonValues = {
      height: 75,
      width: this.stage.fullscreen ? 400 : 225,
      toolTipColor: 'rgba(21, 31, 35, 0.90)',
      textTopPadding: 5,
      textSidePadding: 10
    };

    this.definitionToolTip = this._createToolTipRectangle(
      createBelowNode,
      commonValues
    );
    // this.toolTipRectangle is set in the _createToolTipRectangle function... not the prettiest but we need those values
    this.toolTipPoint = this._createToolTipPoint(
      createBelowNode,
      commonValues,
      this.toolTipRectangle
    );
    this.definitionText = this._createToolTipDefinitionText(
      createBelowNode,
      commonValues
    );

    // add the opacity here
    this.definitionToolTip.filters = [new createjs.BlurFilter(2, 2)];
    this.toolTipPoint.filters = [new createjs.BlurFilter(2, 2)];

    // add all the shapes and text to the stage
    this.stage.addChild(
      this.toolTipPoint,
      this.definitionToolTip,
      this.definitionText
    );
  }

  hideTooltip() {
    this.stage.removeChild(
      this.definitionText,
      this.definitionToolTip,
      this.toolTipPoint
    );
  }
}
