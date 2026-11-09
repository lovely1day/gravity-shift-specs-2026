# GRAVITY SHIFT

A Lens for Spectacles (SPECS). Pinch a glowing core to shape an invisible force: shards burst out, get pulled in, orbit, get pushed away, then collapse. Made for the "Learn AR with SPECS" hackathon (Devpost).

## Run it
No glasses needed.

1. Install Lens Studio 5.24.1.
2. Open `GRAVITY_SHIFT.esproj`.
3. Open Preview and choose the Spectacles (SPECS) simulation.
4. Click the core. A click acts as a pinch.

The Logger prints `[GRAVITY_SHIFT] phase A -> B` at each change.

## Controls
- Pinch (click) the core: go to the next phase.
- Pinch at COMPLETE: restart.
- Pinch during COLLAPSE: ignored.

## Phases
INTRO -> CREATE -> ATTRACT -> ORBIT -> REPEL -> COLLAPSE (automatic, 2.6 s) -> COMPLETE ("You controlled the invisible") -> pinch to restart.

## What is in the Lens
18 shards, a halo, two orbit rings, a pulse shockwave, and three text labels. One TypeScript component runs the state machine. The pinch uses Spectacles Interaction Kit 4.0.0 (an Interactable and collider added to the core at runtime).

## Folder map
- `Assets/Scripts/GravityShift.ts`: the Lens logic.
- `Assets/`: Lens Studio project assets.
- `devpost/`: the planning brief (`design-brief.md`) and the Lens Studio MCP evidence summary.

## Dependency
The Lens needs Spectacles Interaction Kit 4.0.0 from the Lens Studio Asset Library. If `Packages/InteractionKit.lspkg` is not in this repository, install it from the Asset Library before opening Preview.

## Built with
Lens Studio 5.24.1, TypeScript, Spectacles Interaction Kit 4.0.0. Built by an AI coding agent through the Lens Studio MCP server.

## Credits
JackoLeeno JL
