import { AdaptiveDesignSystem } from "@adaptive-web/components-fast";
import { AllComponents } from "@adaptive-web/components-fast/all-components";
import { App, styles, template } from "./app.js";
import { library } from "./library.js";
import { DefaultState, State } from "./state.js";

AdaptiveDesignSystem.configure({ library });
AdaptiveDesignSystem.adoptTokenStyles();
await AdaptiveDesignSystem.defineComponents(AllComponents);

State.provide(document, new DefaultState(library));

await App.define({ name: "app-main", template, styles });
