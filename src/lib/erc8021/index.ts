export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_6zro9yv1";

export const getAttributionPayload = (payload: string) => {
    return `${payload} | attribution:${ATTRIBUTION_CODE} | builder:${BUILDER_CODE}`;
};

export const submitRaidScore = async (score: number, signature: string) => {
    console.log("Submitting score to on-chain with SIWE...", { score, signature });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
};
