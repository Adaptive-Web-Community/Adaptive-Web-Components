import { accentBaseColor, fillSubtleHoverDelta, fillSubtleRestDelta, highlightBaseColor, layerFillBaseLuminance, layerFillRestDelta, neutralBaseColor, WcagContrastLevel, wcagContrastLevel } from "@adaptive-web/adaptive-ui/reference";
import { ListboxOption, ListboxOptionElement, Select, Slider, SliderElement, SliderLabel } from "../react/index.js";
import "./Controls.css";

/**
 * The control panel on the right side of the demo page.
 *
 * Just a few examples of adjusting design token values.
 */
export default function Controls() {
    return (
        <div className="controls">
            <div className="control">
                <label>Luminance</label>
                <Select value="95" onChange={(event) => {
                    const value = (event.target as ListboxOptionElement).value;
                    layerFillBaseLuminance.withDefault(parseInt(value) / 100);
                }}>
                    <ListboxOption value="100">100</ListboxOption>
                    <ListboxOption value="97">97 (Light)</ListboxOption>
                    <ListboxOption value="95">95</ListboxOption>
                    <ListboxOption value="90">90</ListboxOption>
                    <ListboxOption value="80">80</ListboxOption>
                    <ListboxOption value="20">20 (Dark)</ListboxOption>
                    <ListboxOption value="15">15</ListboxOption>
                    <ListboxOption value="0">0</ListboxOption>
                </Select>
            </div>

            <div className="control">
                <label>Palette</label>
                <Select value="default" onChange={(event) => {
                    const value = (event.target as ListboxOptionElement).value;
                    neutralBaseColor.withDefault(value === "arctic" ? "#30363B" : value === "fedex" ? "#4F3868" : "#808080");
                    accentBaseColor.withDefault(value === "fedex" ? "#007AB7" : "#006DC7");
                    highlightBaseColor.withDefault(value === "fedex" ? "#FF6600" : "#22A6AB");
                }}>
                    <ListboxOption value="default">Neutral grey</ListboxOption>
                    <ListboxOption value="arctic">Cool blue</ListboxOption>
                    <ListboxOption value="fedex">Ship it</ListboxOption>
                </Select>
            </div>

            <div className="control">
                <label>Contrast</label>
                <Select value="aa" onChange={(event) => {
                    const value = (event.target as ListboxOptionElement).value as WcagContrastLevel;
                    wcagContrastLevel.withDefault(value);
                }}>
                    <ListboxOption value="aa">AA</ListboxOption>
                    <ListboxOption value="aaa">AAA</ListboxOption>
                </Select>
            </div>

            <div className="control">
                <label>Layer fill rest delta</label>
                <Slider min={0} max={10} valueAsNumber={(layerFillRestDelta.default || -2) * -1} onChange={(event) => {
                    const value = parseInt((event.target as SliderElement).value) * -1;
                    layerFillRestDelta.withDefault(value);
                }}>
                    <SliderLabel position="0">0</SliderLabel>
                    <SliderLabel position="2">2</SliderLabel>
                    <SliderLabel position="4">4</SliderLabel>
                    <SliderLabel position="6">6</SliderLabel>
                    <SliderLabel position="8">8</SliderLabel>
                    <SliderLabel position="10">10</SliderLabel>
                </Slider>
            </div>

            <div className="control">
                <label>Subtle fill rest delta</label>
                <Slider min={0} max={10} valueAsNumber={fillSubtleRestDelta.default || 2} onChange={(event) => {
                    const value = parseInt((event.target as SliderElement).value);
                    fillSubtleRestDelta.withDefault(value);
                }}>
                    <SliderLabel position="0">0</SliderLabel>
                    <SliderLabel position="2">2</SliderLabel>
                    <SliderLabel position="4">4</SliderLabel>
                    <SliderLabel position="6">6</SliderLabel>
                    <SliderLabel position="8">8</SliderLabel>
                    <SliderLabel position="10">10</SliderLabel>
                </Slider>
            </div>

            <div className="control">
                <label>Subtle fill hover delta</label>
                <Slider min={0} max={10} valueAsNumber={fillSubtleHoverDelta.default || 3} onChange={(event) => {
                    const value = parseInt((event.target as SliderElement).value);
                    fillSubtleHoverDelta.withDefault(value);
                }}>
                    <SliderLabel position="0">0</SliderLabel>
                    <SliderLabel position="2">2</SliderLabel>
                    <SliderLabel position="4">4</SliderLabel>
                    <SliderLabel position="6">6</SliderLabel>
                    <SliderLabel position="8">8</SliderLabel>
                    <SliderLabel position="10">10</SliderLabel>
                </Slider>
            </div>
        </div>
    )
}
