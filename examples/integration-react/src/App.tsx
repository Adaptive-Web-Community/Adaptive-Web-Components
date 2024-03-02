import { useState } from "react";
import { AdaptiveDesignSystem } from "@adaptive-web/adaptive-web-components";
import { AllComponents } from "@adaptive-web/adaptive-web-components/all-components";
import { Accordion, AccordionItem, Badge, Button, Checkbox, DesignTokenContext, Menu, MenuItem, TextField } from "../react/index.js";
import ContentItem from "./ContentItem.js";
import "./App.css";
import Controls from "./Controls.js";

// Register the components with the browser
// Planning to look into another CEM plugin to just-in-time load this in the React wrappers.
AdaptiveDesignSystem.defineComponents(AllComponents);

const description = "Adaptive UI is your design system as a service. Just as you would architect your core features for independent testing, composition, and updates, Adaptive UI enables you to do that with your visual design as well. Simple, flexible, consistent, and fully customizable.";

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <DesignTokenContext className="App">
            <header className="App-header">
                <p className="title">Adaptive UI React integration</p>
            </header>
            <div style={{display: "flex", flexGrow: 1}}>
                <main style={{flex: 1}}>
                    <div className="item-container">
                        <ContentItem title="Future-Proof Your Designs with Adaptive UIs" description={description}/>
                        <ContentItem title="Transforming Digital Interactions with Adaptive UIs" badge="External and Published" description={description}/>
                        <ContentItem title="Adaptive UI Roadmap" badge="External" description={description}/>
                    </div>
                    <div className="horizontal">
                        <button type="button" onClick={() => setCount((count) => count + 1)}>Native Button</button>
                        <Button onClick={() => setCount((count) => count + 1)}>Normal Button</Button>
                        <span>Button clicks: {count}</span>
                    </div>
                    <Menu>
                        <MenuItem>Menu item 1</MenuItem>
                        <MenuItem>Menu item 2</MenuItem>
                        <MenuItem>Menu item 3</MenuItem>
                    </Menu>
                    <TextField value="hello">
                        <span>Welcome</span>
                    </TextField>
                    <Accordion>
                        <AccordionItem>
                            <span slot="heading">Accordion Item 1 Heading</span>
                            <Badge slot="start">1</Badge>
                            Accordion Item 1 Content
                        </AccordionItem>
                        <AccordionItem>
                            <span slot="heading">Accordion Item 2 Heading</span>
                            Accordion Item 2 Content
                        </AccordionItem>
                    </Accordion>
                    <Checkbox>Check me</Checkbox>
                </main>
                <aside style={{width: 200}}>
                    <Controls/>
                </aside>
            </div>
            <footer>
            </footer>
        </DesignTokenContext>
    );
}
