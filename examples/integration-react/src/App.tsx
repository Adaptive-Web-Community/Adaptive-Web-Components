import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Accordion, AccordionItem, Badge, Button, Menu, MenuItem } from "./main.js";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <div className="horizontal">
            <Button onClick={() => setCount((count) => count + 1)}>Normal Button</Button>
            <Button purpose="primary" onClick={() => setCount((count) => count + 1)}>Primary Button</Button>
            <Button purpose="critical" onClick={() => setCount((count) => count + 1)}>Critical Button</Button>
        </div>
        <Menu>
            <MenuItem>Menu item 1</MenuItem>
            <MenuItem>Menu item 2</MenuItem>
            <MenuItem>Menu item 3</MenuItem>
        </Menu>
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
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
