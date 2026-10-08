import type { InternationalFields } from "./types";

/**
 * Duty is not quoted from a made-up tariff. GST is 10% of declared value.
 * A live duty figure needs the HS table from the carrier secret, which is not in this repo.
 */
export function dutyEstimate(fields: InternationalFields): {
    gstAud: number;
    dutyAud: number | null;
    dutyNote: string;
    totalAud: number;
} {
    const value = Math.max(0, fields.valueAud);
    const gstAud = Math.round(value * 0.1 * 100) / 100;
    return {
        gstAud,
        dutyAud: null,
        dutyNote:
            "Duty is not estimated here. The HS code is stored for the carrier. A figure appears when the tariff table is loaded from secret config.",
        totalAud: gstAud,
    };
}
