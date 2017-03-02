package com.testrn_v0_40.baidumapkit;

//import com.facebook.csslayout.CSSMeasureMode;
//import com.facebook.csslayout.CSSNode;
//import com.facebook.csslayout.CSSNodeAPI;
//import com.facebook.csslayout.MeasureOutput;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaNodeAPI;


public class BaiduMapShadowNode extends LayoutShadowNode implements /*CSSNode.MeasureFunction*/YogaMeasureFunction {

    public BaiduMapShadowNode() {
        setMeasureFunction(this);
    }

    @Override
    public void setMeasureFunction(YogaMeasureFunction measureFunction) {
        super.setMeasureFunction(measureFunction);
    }

    /*
    @Override
    public void measure(CSSNodeAPI node, float width, CSSMeasureMode widthMode, float height, CSSMeasureMode heightMode, MeasureOutput measureOutput) {
        measureOutput.width = width;
    }
    */

    @Override
    public long measure(YogaNodeAPI node, float width, YogaMeasureMode widthMode, float height, YogaMeasureMode heightMode) {
        return 0;
    }

}
