import type { ReactiveElement } from '../reactive-element';
import type { Resource } from './resource';
type ImageResource = {
    src: string;
    width?: number;
    height?: number;
};
export declare function useImage(el: ReactiveElement, src: string): Resource<ImageResource>;
export {};
//# sourceMappingURL=use-image.d.ts.map