// Separate module loaded first so the treatments are updated before components are composed.

import { neutralFillDiscernibleControlStyles, selectableSelectedStyles } from "@adaptive-web/adaptive-ui/reference";

selectableSelectedStyles.appendComposed(neutralFillDiscernibleControlStyles);
