const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"] as const;
export type AuState = (typeof STATES)[number];

export type AddressIssue = { field: "suburb" | "state" | "postcode"; message: string };

function stateForPostcode(postcode: string): AuState | null {
    if (!/^\d{4}$/.test(postcode)) return null;
    const n = Number(postcode);
    if (n >= 1000 && n <= 2599) return "NSW";
    if (n >= 2619 && n <= 2899) return "NSW";
    if (n >= 2921 && n <= 2999) return "NSW";
    if (n >= 200 && n <= 299) return "ACT";
    if (n >= 2600 && n <= 2618) return "ACT";
    if (n >= 2900 && n <= 2920) return "ACT";
    if (n >= 3000 && n <= 3999) return "VIC";
    if (n >= 8000 && n <= 8999) return "VIC";
    if (n >= 4000 && n <= 4999) return "QLD";
    if (n >= 9000 && n <= 9999) return "QLD";
    if (n >= 5000 && n <= 5999) return "SA";
    if (n >= 6000 && n <= 6999) return "WA";
    if (n >= 7000 && n <= 7999) return "TAS";
    if (n >= 800 && n <= 999) return "NT";
    return null;
}

export function validateAuAddress(input: {
    suburb: string;
    state: string;
    postcode: string;
}): AddressIssue[] {
    const issues: AddressIssue[] = [];
    const suburb = input.suburb.trim();
    const state = input.state.trim().toUpperCase();
    const postcode = input.postcode.trim();

    if (suburb.length < 2 || !/^[A-Za-z][A-Za-z\s'-]+$/.test(suburb)) {
        issues.push({ field: "suburb", message: "Enter the suburb as it appears on the envelope." });
    }
    if (!STATES.includes(state as AuState)) {
        issues.push({ field: "state", message: "State must be NSW, VIC, QLD, SA, WA, TAS, NT or ACT." });
    }
    if (!/^\d{4}$/.test(postcode)) {
        issues.push({ field: "postcode", message: "Postcode must be four digits." });
    } else {
        const expected = stateForPostcode(postcode);
        if (!expected) {
            issues.push({ field: "postcode", message: "That postcode is not a recognised Australian code." });
        } else if (STATES.includes(state as AuState) && expected !== state) {
            issues.push({
                field: "state",
                message: `Postcode ${postcode} is ${expected}, not ${state}.`,
            });
        }
    }
    return issues;
}

export const AU_STATES = STATES;
