import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    Badge as MuiBadge,
    Button as MuiButton,
    Checkbox as MuiCheckbox,
    FormControlLabel as MuiFormControlLabel,
    FormGroup as MuiFormGroup,
    Input as MuiInput,
    InputLabel as MuiInputLabel,
    MenuItem as MuiMenuItem,
    MenuList as MuiMenuList,
    TextField as MuiTextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useState } from "react";
import { AdaptiveDesignSystem } from "@adaptive-web/adaptive-web-components";
import { AllComponents } from "@adaptive-web/adaptive-web-components/all-components";
import {
    Accordion,
    AccordionItem,
    Badge,
    Button,
    Checkbox,
    DesignTokenContext,
    Menu,
    MenuItem,
    TextField,
} from "../react/index.js";
import ContentItem from "./ContentItem.js";
import "./App.css";
import Controls from "./Controls.js";
import { muiCSSTheme } from "./MuiCSSTheme/muiTheme.js";

// Register the components with the browser
// Planning to look into another CEM plugin to just-in-time load this in the React wrappers.
AdaptiveDesignSystem.defineComponents(AllComponents);

const description =
    "Adaptive UI is your design system as a service. Just as you would architect your core features for independent testing, composition, and updates, Adaptive UI enables you to do that with your visual design as well. Simple, flexible, consistent, and fully customizable.";

export default function App() {
    const [count, setCount] = useState(0);

    const theme = extendTheme(muiCSSTheme);

    return (
        <CssVarsProvider theme={theme}>
            <DesignTokenContext className="App">
                {/* <header className="App-header">
                    <p className="title">Adaptive UI React integration</p>
                </header> */}
                <div style={{ display: "flex", flexGrow: 1, paddingBottom: "100px" }}>
                    <main style={{ flex: 1 }}>
                        {/* <div className="item-container">
                            <ContentItem
                                title="Future-Proof Your Designs with Adaptive UIs"
                                description={description}
                            />
                            <ContentItem
                                title="Transforming Digital Interactions with Adaptive UIs"
                                badge="External and Published"
                                description={description}
                            />
                            <ContentItem title="Adaptive UI Roadmap" badge="External" description={description} />
                        </div>
                        <div className="horizontal">
                            <button type="button" onClick={() => setCount((count) => count + 1)}>
                                Native Button
                            </button>
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
                        <Checkbox>Check me</Checkbox> */}

                        <header className="App-header">
                            <p className="title">MUI styles from AUI</p>
                        </header>

                        <div className="horizontal">
                            <MuiButton variant="critical">Critical button</MuiButton>
                            <MuiButton variant="normal">Normal button</MuiButton>
                        </div>
                        <MuiMenuList>
                            <MuiMenuItem>Menu item 1</MuiMenuItem>
                            <MuiMenuItem>Menu item 2</MuiMenuItem>
                            <MuiMenuItem>Menu item 3</MuiMenuItem>
                        </MuiMenuList>

                        <MuiInputLabel htmlFor="welcome-id">Welcome</MuiInputLabel>
                        <MuiTextField value="hello" id="welcome-id" variant="outlined" />

                        <MuiAccordion>
                            <MuiAccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <MuiBadge badgeContent={1} />
                                Accordion Item 1 Heading
                            </MuiAccordionSummary>
                            <MuiAccordionDetails>Accordion Item 1 Content</MuiAccordionDetails>
                        </MuiAccordion>
                        <MuiAccordion>
                            <MuiAccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                Accordion Item 2 Heading
                            </MuiAccordionSummary>
                            <MuiAccordionDetails>Accordion Item 2 Content</MuiAccordionDetails>
                        </MuiAccordion>

                        <MuiFormGroup>
                            <MuiFormControlLabel control={<MuiCheckbox />} label="Check me" />
                        </MuiFormGroup>
                    </main>
                    <aside style={{ width: 200 }}>
                        <Controls />
                    </aside>
                </div>

                <footer></footer>
            </DesignTokenContext>
        </CssVarsProvider>
    );
}
