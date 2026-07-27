export declare const enterRenderPhase: (tagName: string) => void;
export declare const exitRenderPhase: () => void;
export declare const getRenderPhaseContext: () => {
    inRenderPhase: boolean;
    depth: number;
    activeElementTagName: string | null;
};
//# sourceMappingURL=render-phase.d.ts.map