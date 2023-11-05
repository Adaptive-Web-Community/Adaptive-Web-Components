import type { CheckboxOptions } from "@microsoft/fast-foundation";
import checkmark from "../../statics/checkmark.js";
import subtract from "../../statics/subtract.js";

type ComposeOptions<T> = {
    basename: string;
    templateOptions: T;
};

export default {
    basename: "checkbox",
    templateOptions: {
        checkedIndicator: checkmark,
        indeterminateIndicator: subtract
    }
} as ComposeOptions<CheckboxOptions>;
