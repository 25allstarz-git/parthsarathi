# Premium landing motion pass

## Scope
Enhance only the public home page. Keep all copy, links, routes, authentication, dashboards, forms, case pages, and chat unchanged.

## Experience changes
- Add Lenis smooth scrolling on the home page only, synchronized with GSAP/ScrollTrigger and disabled for reduced-motion users.
- Add a desktop pointer cursor with a court-navy/brass ring and contextual labels for links, role entries, and photographs; hide it for touch and reduced-motion users.
- Add a sub-one-second navy/brass curtain reveal on the first visit in a browser session; repeat visits reveal immediately.
- Make the hero a cinematic, near-full-viewport composition with larger monumental type, a broader full-bleed 3D field, film-grain texture, and a scroll-linked camera/object dolly. Keep all text and actions as accessible HTML above the canvas.
- Preserve the existing pinned 3D process story, refining its stage transitions and ensuring Lenis and ScrollTrigger remain synchronized.
- Give role entries a restrained clip-path detail reveal and tactile depth without adding stock imagery or changing their text.
- Add a slow audience marquee at the roles/process boundary, pausing on hover.
- Add image parallax and gentle scale treatment to the courthouse and evidence photography.
- Increase section spacing and introduce a composed court-navy storytelling band with an accessible curved transition to improve page rhythm while retaining all existing content.

## Technical approach
- Install `lenis` as the only new dependency; reuse the existing Framer Motion, GSAP, Three.js, React Three Fiber, Drei, and Lucide packages.
- Create one landing-experience component that owns Lenis, the cursor, intro curtain, hero scroll progress, and photo parallax hooks so the behavior does not leak into functional routes.
- Pass hero scroll progress into the lazy 3D scene and apply camera movement inside the existing render loop.
- Continue lazy-loading both 3D scenes; cap DPR at 2 and pause canvases offscreen.
- Use semantic design tokens in the global stylesheet; no hardcoded component colors.
- Under `prefers-reduced-motion`, use native scrolling, hide the cursor and marquee, skip the curtain, and retain static 2D/3D fallbacks without pinned scrubbing.

## Verification
- Check the home page at desktop and mobile widths for text overlap, section transitions, scroll pinning, cursor behavior, and image treatment.
- Verify reduced-motion behavior and confirm login/dashboard bundles and UI remain untouched.
- Run the project’s automated checks and inspect browser console errors.
