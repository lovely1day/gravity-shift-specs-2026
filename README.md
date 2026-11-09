# GRAVITY SHIFT

A Lens for Spectacles (SPECS). Pinch a glowing core to shape an invisible force: shards burst out, get pulled in, orbit, get pushed away, then collapse. Made for the "Learn AR with SPECS" hackathon (Devpost).

## Before you open it
This public repository is not a complete, ready-to-run project. Please read this first.

- **Interaction Kit is not included.** The Lens needs Spectacles Interaction Kit 4.0.0. Install it from Snap's official source, the Lens Studio Asset Library, so that it ends up at `Packages/InteractionKit.lspkg`. We did not publish the package because its redistribution licence is not confirmed.
- **Two editor helper scripts are missing.** The scene has an object called `AiPreviewAgent Handler` with two scripts, `AgentInspectScript` and `AgentInteractScript`. They come from the AiPreviewAgentInspect and AiPreviewAgentInteract packages, which Lens Studio's AI preview agent used during development. Those packages are not in this repository, for the same licence reason. Lens Studio will show the two scripts as missing. The Lens logic does not import them, but we have not tested the project without them.
- **A clean clone has not been tested.** We have not opened or run this repository from a fresh clone. A static check of the scene's 16 external references found 8 that point to files in this repository. 6 point into Interaction Kit 4.0.0. They resolved when our local copy of the package was present, but we have not checked that a fresh Asset Library install uses the same IDs. The last 2 are the missing helper scripts above.

## Run it in Preview
No glasses needed.

1. Install Lens Studio 5.24.1.
2. Install Spectacles Interaction Kit 4.0.0 from the Asset Library (see above).
3. Open `GRAVITY_SHIFT.esproj`.
4. Open Preview and choose the Spectacles (SPECS) simulation.
5. Pinch the core in the Preview's hand simulation.

The Logger prints `[GRAVITY_SHIFT] phase A -> B` at each change. A separate touch fallback (`[GRAVITY_SHIFT] preview tap fallback`) can also advance the phases, so a mouse click does not prove that hand input works.

## Phases
INTRO -> CREATE -> ATTRACT -> ORBIT -> REPEL -> COLLAPSE (automatic, about 2.6 s) -> COMPLETE ("You controlled the invisible").

- A pinch on the core goes to the next phase.
- A pinch during COLLAPSE is ignored.
- At COMPLETE, the code has a pinch-to-restart path. Restart by pinch has not been verified.

## What was verified
- In Lens Studio 5.24.1 Preview (Spectacles simulation, original project folder), five simulated hand pinches sent through Interaction Kit moved the Lens from INTRO to COLLAPSE, and COMPLETE followed automatically. The Lens log for 2026-11-09, 23:50:36 to 23:51:53 KSA records this.
- Not verified: restart by pinch, a run on physical Spectacles, a run from a clean clone of this repository.

## What is in the Lens
18 shards, a halo, two orbit rings, a pulse shockwave, and three text labels. One TypeScript component, `Assets/Scripts/GravityShift.ts`, runs the state machine. The pinch uses Spectacles Interaction Kit 4.0.0: the script adds an Interactable and a collider to the core at runtime.

## Folder map
- `Assets/Scripts/GravityShift.ts`: the Lens logic.
- `Assets/`: Lens Studio project assets.
- `devpost/`: the planning brief (`design-brief.md`) and the Lens Studio MCP evidence summary.

## Built with
Lens Studio 5.24.1, TypeScript, Spectacles Interaction Kit 4.0.0. Built by an AI coding agent (Claude Code) through the Lens Studio MCP server.

## Credits
JackoLeeno JL
