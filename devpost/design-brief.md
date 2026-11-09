---
status: approved
approved_by: JackoLeeno JL
approved_on: 2026-11-10
approval_scope: design brief with documented limitations and unverified tests
---

# Design brief: GRAVITY SHIFT

<!-- Filled in by plan-lens from the learner's interview. Use the learner's words. Mark any value they didn't choose as (default). -->

> **Provenance (read first).** This brief comes from a real `plan-lens` interview with the owner on 2026-11-09, about 23:20-23:50 Riyadh time. The interview happened **after** the first prototype had already been built by an AI coding agent through the Lens Studio MCP server. It is a post-build plan and review, not a plan made before the build. The owner answered the idea, audience and main-moment questions. Values marked `(default)` were not decided in the interview; they are taken from the built prototype (`Assets/Scripts/GravityShift.ts`, `Assets/Scene.scene`). The earlier agent-written draft is kept at `evidence/final-rescue/run3/design-brief.pre-planlens-backup.md`.

## The one spatial moment
I stand wearing the glasses and see a 3D energy ball floating in front of me in my real room. I pinch, and 18 fragments appear around it, hanging as if in zero gravity. I steer the field through CREATE → ATTRACT → ORBIT → REPEL → COLLAPSE. The strongest moment is COLLAPSE: the fragments rush into the centre, the energy shrinks, then a short visual pulse goes out. After the end I can pinch to play again.

## Why it belongs on glasses
- Uses: draws in the world; leaves your body free.
- Why it's better than the phone or laptop version: the goal is not to watch a 3D model but to feel that you can change how matter moves inside the field. The field sits in your own room at real scale, and you change it with your own hand (a pinch), with nothing to hold. On a screen it would be an animation you watch.
- Who it's for: students, physics and space fans, science-exhibition visitors, and anyone who wants to try spatial computing in a fun, easy-to-understand way.

## Product or overlay
- Type: product: the virtual thing is the experience (an interactive, educational AR experience about gravity-like forces).
- What the real version would sense: nothing.
- Stand-in for the preview: none needed.

## Where things live
- Where the user is looking during the main task: at the core and the fragments around it, straight ahead (default).
- Whole experience: placed once, 160 cm in front of the user at start, facing them, yaw only (default, from the prototype).
- Core: energy ball at the centre, about 35 cm across, with a halo about 45 cm across (default).
- Fragments: 18. Resting 15-26 cm from the core, attract to about 6.5-10.5 cm, orbit 12-26 cm on three tilted planes, repel out to 42-58 cm (default).
- Text: title 44 cm above the core, subtitle 33 cm above, hint 44 cm below (default).

## Hands and input
- Advance to the next phase: pinch the core (Spectacles Interaction Kit Interactable on the core). One target, one gesture.
- Restart: pinch the core at COMPLETE.
- Pinches during COLLAPSE (about 2.6 s) are ignored; repeat events within 0.35 s are ignored (default).
- Targets are big and highlight when aimed at. (The core is big, about 35 cm. A hover highlight is not in the prototype.)
- Voice: none.
- Preview-only fallback: a mouse tap in the Preview also advances the phase and logs `preview tap fallback`. It is not counted as pinch evidence (default, from the prototype).

## When things show
- Fragments: hidden in INTRO and COMPLETE; shown in CREATE, ATTRACT, ORBIT, REPEL; pulled in and shrunk in COLLAPSE (default).
- Two rings: ORBIT only (default).
- Pulse: ATTRACT (inward, cyan), REPEL (outward, gold), end of COLLAPSE (one short shockwave) (default).
- Text: title, subtitle and hint change at every phase; the hint is empty during COLLAPSE; COMPLETE says "You controlled the invisible" (default).
- If something needs attention out of view: none; everything stays around the core.

## Done criteria
Each one can be checked in Lens Studio's preview. Derived from the owner's description of the main moment.
1. At start a 3D energy core floats in front of the user with the title "GRAVITY SHIFT", the subtitle "Shape the force." and the hint "Pinch to begin", and no fragments.
2. One pinch on the core makes 18 fragments appear around it, floating (CREATE).
3. Further pinches step through ATTRACT, ORBIT (fragments circle the core on moving orbits) and REPEL (fragments pushed away from the core), and the text changes each time.
4. A pinch in REPEL starts COLLAPSE: the fragments rush to the centre, the energy shrinks and a short pulse goes out, then COMPLETE shows.
5. A pinch at COMPLETE restarts the experience (back to INTRO).

## Out of scope
- Sound (the prototype has no audio).
- Voice, two-hand gestures, custom gestures, hand speed or pose.
- Recognizing real things, surfaces or places.
- Saving anything between sessions; more than one user.
- Testing on real SPECS glasses (no device available).

## Risks and open questions
- The owner's first priority is a real, comfortable experience on SPECS. No SPECS device is available, so comfort, real hand tracking and pinch reliability on glasses are **feel unproven**. Only the preview can be shown.
- Placement: at 160 cm, Snap's usable view is about 75 cm tall by 112 cm wide. The title (+44 cm), the hint (-44 cm) and the REPEL fragments (out to 58 cm) sit at or past its edge, so on glasses they may be clipped. The preview shows them. Not decided in the interview.
- The preview tap fallback can advance phases on a mouse click. Proof of interaction uses only Interaction Kit pinches (logged), never taps.
- Provenance: the interview was held after the prototype was built (see the note at the top).

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
