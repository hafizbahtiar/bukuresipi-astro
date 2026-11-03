/**
 * Page turn ported from bukuresipi-flutter `lib/core/router/book_page_transitions.dart` (geometry and lighting after
 * flipbook-vue). Flutter bends a snapshot mesh; the web has no DOM snapshot, so the leaf is a clone of the page cut
 * into strips, each strip laid on the bent paper in CSS 3D and lit like the Flutter mesh.
 *
 * axis "x": spine on the left edge, the page turns right to left (a book).
 * axis "y": spine on the top edge, the page turns bottom to top (a notepad).
 * forward: the leaf lifts off and flips away, uncovering what is beneath (0 → 1).
 * backward: the leaf flips back and settles flat on what is beneath (1 → 0).
 */

export type Axis = "x" | "y";

const STRIPS = 32;
const AMBIENT = 0.4;
const GLOSS = 0.6;
const DURATION = 800;

/** Flutter's Curves.easeInOut, cubic-bezier(0.42, 0, 0.58, 1). */
export function easeInOut(t: number) {
    let lo = 0,
        hi = 1,
        s = t;
    for (let i = 0; i < 24; i++) {
        s = (lo + hi) / 2;
        const x = 3 * s * (1 - s) * (1 - s) * 0.42 + 3 * s * s * (1 - s) * 0.58 + s * s * s;
        if (x < t) lo = s;
        else hi = s;
    }
    return 3 * s * s * (1 - s) + s * s * s;
}

/**
 * A leaf [length] long hinged at the spine, [progress] through a flip (0 flat, 1 turned over). First half: the free
 * edge curls up toward the viewer into a half roll. Second half: the roll swings over the spine while unrolling.
 * Per strip boundary, spine to free edge: how far the paper has turned, and its position and depth before
 * perspective. [edge] is how far the leaf reaches on screen; the page beneath shows past it.
 */
export function bend(length: number, progress: number) {
    const theta = Math.max(
        progress < 0.5 ? progress * 2 * Math.PI : (2 - progress * 2) * Math.PI,
        1e-9,
    );
    const radius = length / theta;
    const swing = progress > 0.5 ? (progress - 0.5) * 2 * Math.PI : 0;
    const camera = length * 6;
    const angle: number[] = [],
        pos: number[] = [],
        depth: number[] = [];
    let edge = 0;
    for (let i = 0; i <= STRIPS; i++) {
        const b = (theta * i) / STRIPS;
        const x = Math.sin(b) * radius,
            z = (1 - Math.cos(b)) * radius;
        const x2 = x * Math.cos(swing) - z * Math.sin(swing),
            z2 = x * Math.sin(swing) + z * Math.cos(swing);
        angle.push(b + swing);
        pos.push(x2);
        depth.push(z2);
        edge = Math.max(edge, length / 2 + ((x2 - length / 2) * camera) / (camera - z2));
    }
    return { angle, pos, depth, camera, edge: Math.min(Math.max(edge, 0), length) };
}

/** How the paper at [angle] is lit: shade by how far it faces away, a gloss streak near 30° of tilt. */
function light(angle: number) {
    const facing = Math.abs(Math.cos(angle));
    const tilt = Math.acos(facing);
    const shine = Math.max(
        Math.cos(tilt + Math.PI / 6) ** 200,
        Math.cos(tilt - Math.PI / 6) ** 200,
    );
    return {
        shade: `rgba(0,0,0,${((1 - facing) * (1 - AMBIENT)).toFixed(3)})`,
        gloss: `rgba(255,255,255,${(shine * GLOSS).toFixed(3)})`,
    };
}

/**
 * Turns [page] over [book] along [axis]. The caller shows whatever lies beneath; the leaf covers it until it is gone
 * (forward) or lies flat on it (backward). Resolves on the last frame, with the leaf already removed.
 */
export function flip(book: HTMLElement, page: HTMLElement, axis: Axis, forward: boolean) {
    const { width, height } = book.getBoundingClientRect();
    const length = axis === "x" ? width : height;
    const span = length / STRIPS;
    const front = page.querySelector<HTMLElement>(".page-front") ?? page;
    const paper = getComputedStyle(front).backgroundColor;
    const scroll = front.scrollTop;
    const toward = axis === "x" ? "90deg" : "180deg";

    const leaf = document.createElement("div");
    leaf.className = "flip-leaf";
    leaf.setAttribute("aria-hidden", "true");
    leaf.style.perspective = `${length * 6}px`;
    const shadow = leaf.appendChild(document.createElement("div"));
    shadow.className = "flip-shadow";
    const stage = leaf.appendChild(document.createElement("div"));
    stage.className = "flip-stage";

    const strips: HTMLElement[] = [],
        lights: HTMLElement[] = [];
    for (let i = 0; i < STRIPS; i++) {
        const strip = stage.appendChild(document.createElement("div"));
        strip.className = "flip-strip";
        // One extra pixel overlaps the next strip so no hairline seam shows between them.
        strip.style.cssText =
            axis === "x"
                ? `width:${span + 1}px;height:${height}px;transform-origin:0 50%`
                : `width:${width}px;height:${span + 1}px;transform-origin:50% 0`;
        const copy = page.cloneNode(true) as HTMLElement;
        copy.inert = true;
        copy.removeAttribute("id");
        for (const el of copy.querySelectorAll("[id]")) el.removeAttribute("id");
        copy.style.cssText = `visibility:visible;width:${width}px;height:${height}px;${axis === "x" ? `left:${-i * span}px;top:0` : `left:0;top:${-i * span}px`
            }`;
        const lit = document.createElement("div");
        lit.className = "flip-light";
        strip.append(copy, lit);
        strips.push(strip);
        lights.push(lit);
    }
    book.append(leaf);
    for (const copyFront of leaf.querySelectorAll<HTMLElement>(".page-front")) copyFront.scrollTop = scroll;

    const render = (progress: number) => {
        const g = bend(length, progress);
        for (let i = 0; i < STRIPS; i++) {
            const mid = (g.angle[i] + g.angle[i + 1]) / 2;
            strips[i].style.transform =
                axis === "x"
                    ? `translate3d(${g.pos[i]}px,0,${g.depth[i]}px) rotateY(${-mid}rad)`
                    : `translate3d(0,${g.pos[i]}px,${g.depth[i]}px) rotateX(${mid}rad)`;
            const a = light(g.angle[i]),
                b = light(g.angle[i + 1]);
            // Past edge-on the viewer sees the paper's back: paper, with the front's ink faintly showing through.
            lights[i].style.background =
                `linear-gradient(${toward},${a.gloss},${b.gloss}),linear-gradient(${toward},${a.shade},${b.shade})` +
                (Math.cos(mid) < 0 ? `,color-mix(in srgb,${paper} 86%,transparent)` : "");
        }
        // The leaf's shadow on the page it uncovers, strongest mid-flip.
        const dark = `rgba(0,0,0,${(0.35 * Math.sin(Math.PI * progress)).toFixed(3)})`;
        shadow.style.cssText =
            axis === "x"
                ? `left:${g.edge}px;top:0;width:64px;height:100%;background:linear-gradient(90deg,${dark},transparent)`
                : `left:0;top:${g.edge}px;width:100%;height:64px;background:linear-gradient(180deg,${dark},transparent)`;
    };

    render(forward ? 0 : 1);
    return new Promise<void>((resolve) => {
        const start = performance.now();
        const frame = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION);
            const p = easeInOut(t);
            render(forward ? p : 1 - p);
            if (t < 1) return requestAnimationFrame(frame);
            leaf.remove();
            resolve();
        };
        requestAnimationFrame(frame);
    });
}
