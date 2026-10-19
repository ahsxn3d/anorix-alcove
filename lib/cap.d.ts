import type * as T from "three";
export function buildWorld(THREE: typeof T, o: { mobile?: boolean; RB: unknown }): { root: T.Group; setTime: (t: number, scene?: T.Scene) => void; cap: T.Group };
export const CAM: (mobile: boolean) => { pos: [number, number, number]; tgt: [number, number, number] };
