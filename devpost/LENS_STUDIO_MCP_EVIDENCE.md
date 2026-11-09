# Lens Studio MCP usage evidence: GRAVITY SHIFT

This file summarises `evidence/mcp-operations.log`, the call log kept while building the Lens. Every line is one Lens Studio MCP tool call made through `tools/mcp.py` (a small JSON-RPC client for the local Lens Studio MCP server). Authorization headers are never written to the log. The raw log is kept out of the repository; this summary is regenerated from it.

Snapshot generated: 2026-11-09 22:50 local time (Asia/Riyadh). The log is append-only and still growing while the Lens is finished, so totals may be higher in the final submission.

## Totals

- Total MCP calls logged: **124**
- First call: `2026-11-09T13:15:08`
- Last call: `2026-11-09T22:50:41`
- Distinct tools used: **16**

### Calls per status

| Status | Calls |
|---|---:|
| ok | 111 |
| tool_error | 8 |
| exception (timeout / connection) | 5 |

### Calls per tool

| Tool | Calls | ok | tool_error | exception |
|---|---:|---:|---:|---:|
| `VirtualScene` | 34 | 34 | 0 | 0 |
| `RecompileTypeScriptTool` | 16 | 14 | 0 | 2 |
| `RunAndCollectLogsTool` | 16 | 16 | 0 | 0 |
| `CapturePanelScreenshotTool` | 14 | 12 | 2 | 0 |
| `ExecuteEditorCode` | 12 | 12 | 0 | 0 |
| `PreviewInteractTool` | 9 | 3 | 4 | 2 |
| `scene-graphql` | 5 | 5 | 0 | 0 |
| `asset-graphql` | 5 | 5 | 0 | 0 |
| `SearchLensStudioAssetLibrary` | 3 | 3 | 0 | 0 |
| `PreviewPanelTool` | 2 | 2 | 0 | 0 |
| `ListInstalledPackagesTool` | 2 | 2 | 0 | 0 |
| `QueryRuntimeSceneTool` | 2 | 1 | 1 | 0 |
| `QueryLensStudioKnowledgeBase` | 1 | 0 | 1 | 0 |
| `tools_list_dummy` | 1 | 0 | 0 | 1 |
| `InstallLensStudioPackage` | 1 | 1 | 0 | 0 |
| `InjectPreviewGesture` | 1 | 1 | 0 | 0 |

## 15 representative calls (sanitised)

Format: log line number, timestamp, tool, status, what it was for, and the logged arguments (already truncated by the logger at 300 characters; shortened again here). The project folder path is replaced by `<project>`; no tokens or other local paths appear.

| # | Time | Tool | Status | Purpose | Logged arguments |
|---:|---|---|---|---|---|
| 1 | 2026-11-09T13:15:08 | `ExecuteEditorCode` | ok | project check (Editor API) | `{"code": "const m = pluginSystem.findInterface(Editor.Model.IModel); return { file: m.project.projectFile.toString(), tp: m.project.targetPlatform };"}` |
| 3 | 2026-11-09T13:15:17 | `PreviewPanelTool` | ok | preview setup (Specs stereo) | `{"action": "setConfig", "deviceCategory": "stereo"}` |
| 5 | 2026-11-09T13:15:26 | `CapturePanelScreenshotTool` | ok | preview capture | `{"pluginId": "Snap.Plugin.Gui.PreviewPanel", "outputPath": "<project>/evidence/W01/preview-baseline.png"}` |
| 17 | 2026-11-09T14:44:58 | `SearchLensStudioAssetLibrary` | ok | asset library search (Interaction Kit) | `{"keywordFilter": ["Interaction Kit", "InteractionKit", "SIK", "Spectacles Interaction"], "onlyMostRecent": true}` |
| 19 | 2026-11-09T14:45:28 | `InstallLensStudioPackage` | ok | package install (Interaction Kit 4.0.0) | `{"packageUri": "https://assets.ctfassets.net/xyb83mibqg29/sHXzm73PXGCumQb97gKOH/fe1b9ad019cc3e26434e805b026f75bb/InteractionKit.v4.0.0.lspkg", "assetName": "SpectaclesInteractionKit"}` |
| 24 | 2026-11-09T14:47:07 | `scene-graphql` | ok | scene build (prefab instantiate) | `{"query": "mutation { instantiatePrefab(prefabId: \"f99407ce-416a-43f3-baf8-668a42712de9\") { success id error } }"}` |
| 26 | 2026-11-09T14:47:51 | `VirtualScene` | ok | scene build (VirtualScene: meshes + materials) | `{"command": "apply", "instructions": {"assets": [{"id": "$temp:sphere", "preset": "SphereMeshPreset", "name": "GS_Sphere"}, {"id": "$temp:torus", "preset": "TorusMeshPreset", "name": "GS_Torus"}, {"id": "$temp:shard", "preset": "P ...` |
| 29 | 2026-11-09T20:42:25 | `VirtualScene` | ok | scene build (VirtualScene: object hierarchy) | `{"command": "apply", "instructions": {"assets": [], "create": [{"id": "$temp:root", "name": "GRAVITY SHIFT", "transform": {"position": [0, 0, -120], "rotation": [0, 0, 0], "scale": [1, 1, 1]}}, {"id": "$temp:core", "name": "Core", ...` |
| 32 | 2026-11-09T20:48:14 | `VirtualScene` | ok | script attach (ScriptComponent on GRAVITY SHIFT) | `{"command": "apply", "instructions": {"modify": {"@sceneObject:GRAVITY SHIFT": {"_addComponents": [{"type": "ScriptComponent", "properties": {"scriptAsset": "@asset:Scripts/GravityShift.ts"}}]}}}}` |
| 33 | 2026-11-09T20:48:32 | `RecompileTypeScriptTool` | ok | recompile TypeScript | `{}` |
| 37 | 2026-11-09T20:50:30 | `VirtualScene` | ok | script attach (wire pinch target) | `{"command": "apply", "instructions": {"modify": {"@sceneObject:GRAVITY SHIFT": {"components.ScriptComponent.pinchTarget": "@sceneObject:Core", "components.ScriptComponent.core": "@sceneObject:Core", "components.ScriptComponent.hal ...` |
| 42 | 2026-11-09T20:56:17 | `PreviewInteractTool` | exception | pinch interaction (timed out) | `{"action": "Pinch", "name": "Core", "parentName": "GRAVITY SHIFT", "handType": "right", "durationMs": 200}` |
| 43 | 2026-11-09T20:57:47 | `InjectPreviewGesture` | ok | preview gesture (tap, ok) | `{"type": "tap", "x": 0.5, "y": 0.5}` |
| 52 | 2026-11-09T21:27:33 | `CapturePanelScreenshotTool` | ok | preview capture | `{"pluginId": "Snap.Plugin.Gui.PreviewPanel", "outputPath": "<project>/evidence/rescue-20261109/preview-after-binding.png", "maxDimension": 800}` |
| 110 | 2026-11-09T22:33:58 | `CapturePanelScreenshotTool` | ok | preview capture (latest) | `{"pluginId": "Snap.Plugin.Gui.PreviewPanel", "outputPath": "<project>/evidence/final-rescue/p0-intro.png", "maxDimension": 1000}` |

## What this log does and does not show

- It shows real, timestamped calls to the Lens Studio MCP server: scene construction through `VirtualScene` and GraphQL tools, script attachment and wiring, TypeScript recompiles, log collection, preview capture and preview interaction.
- Failures are kept in the log and counted above (for example the `PreviewInteractTool` pinch calls timed out or returned a tool error; a tap sent with `InjectPreviewGesture` succeeded). Nothing was removed.
- The log records calls made through `tools/mcp.py` only. Calls issued by a coding agent through its own MCP connection are not in this file, and the log does not record which agent or plugin sent a call.
- There is a gap in the log between the morning foundation work and the evening scene work; no calls are logged in that window.
