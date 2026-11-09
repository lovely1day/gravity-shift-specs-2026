import {Interactable} from "InteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {InteractorEvent} from "InteractionKit.lspkg/Core/Interactor/InteractorEvent"

// GRAVITY SHIFT: one pinch target (the core) drives a 7-phase field state machine.
// INTRO -> (pinch) CREATED -> ATTRACT -> ORBIT -> REPEL -> COLLAPSE (auto) -> COMPLETE -> (pinch) INTRO
enum Phase {
  Intro,
  Created,
  Attract,
  Orbit,
  Repel,
  Collapse,
  Complete
}

const PHASE_NAME = ["INTRO", "CREATE", "ATTRACT", "ORBIT", "REPEL", "COLLAPSE", "COMPLETE"]

type Copy = {title: string; sub: string; hint: string}
const COPY: Copy[] = [
  {title: "GRAVITY SHIFT", sub: "Shape the force.", hint: "Pinch to begin"},
  {title: "FIELD ONLINE", sub: "Stage 1 · CREATE", hint: "Pinch the core: ATTRACT"},
  {title: "ATTRACT", sub: "Stage 2 · CONTROL · pull inward", hint: "Pinch: ORBIT"},
  {title: "ORBIT", sub: "Stage 2 · CONTROL · stable paths", hint: "Pinch: REPEL"},
  {title: "REPEL", sub: "Stage 2 · CONTROL · push outward", hint: "Pinch: COLLAPSE"},
  {title: "COLLAPSE", sub: "Stage 3 · singularity", hint: ""},
  {title: "COMPLETE", sub: "You controlled the invisible", hint: "Pinch to restart"}
]

const DIM = new vec4(0.05, 0.32, 0.46, 1)
const CYAN = new vec4(0.12, 0.85, 1.0, 1)
const ICE = new vec4(0.62, 0.8, 1.0, 1)
const GOLD = new vec4(1.0, 0.7, 0.26, 1)
const WHITE = new vec4(1, 1, 1, 1)
const BLACK = new vec4(0, 0, 0, 1)
const PHASE_COLOR = [DIM, CYAN, CYAN, ICE, GOLD, WHITE, CYAN]

const PLACE_DIST_CM = 160 // experience spawns this far in front of the user
const COLLAPSE_IMPLODE = 0.9 // s until the flash
const COLLAPSE_TOTAL = 2.6 // s until COMPLETE

type Frag = {
  t: Transform
  pos: vec3
  vel: vec3
  home: vec3
  orbitR: number
  orbitW: number
  orbitPhase: number
  orbitTilt: quat
  attractR: number
  repelR: number
  spinAxis: vec3
  spinRate: number
  baseScale: vec3
  scale: number
}

@component
export class GravityShift extends BaseScriptComponent {
  @input
  @hint("Object the user pinches (the core). A box collider + Interactable are added at runtime.")
  pinchTarget: SceneObject

  @input core: SceneObject
  @input halo: SceneObject
  @input fragmentsRoot: SceneObject
  @input ringA: SceneObject
  @input ringB: SceneObject
  @input pulse: SceneObject
  @input titleText: Text
  @input subText: Text
  @input hintText: Text
  @input colliderSizeCm: number = 40

  private phase = Phase.Intro
  private phaseTime = 0
  private orbitTime = 0
  private lastPinch = -10
  private frags: Frag[] = []
  private haloColor = DIM
  private ringVis = 0
  private coreBase: vec3
  private haloBase: vec3
  private ringABase: vec3
  private ringBBase: vec3
  private pulseBase: vec3
  private seed = 7
  private placed = false

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.onStart())
    this.createEvent("UpdateEvent").bind(() => this.onUpdate())
    // Preview tap is an explicit fallback for demo/testing; not proof of a working hand pinch.
    this.createEvent("TouchStartEvent").bind(() => {
      const now = getTime()
      if (now - this.lastPinch < 0.35) return
      this.lastPinch = now
      print("[GRAVITY_SHIFT] preview tap fallback")
      this.advance()
    })
  }

  // Public so tests/automation can drive the state machine without a hand.
  advance(): void {
    if (this.phase === Phase.Collapse) return // locked while collapsing
    const next = this.phase === Phase.Complete ? Phase.Intro : this.phase + 1
    this.enter(next)
  }

  private onStart(): void {
    this.coreBase = this.core.getTransform().getLocalScale()
    this.haloBase = this.halo.getTransform().getLocalScale()
    this.ringABase = this.ringA.getTransform().getLocalScale()
    this.ringBBase = this.ringB.getTransform().getLocalScale()
    this.pulseBase = this.pulse.getTransform().getLocalScale()
    this.buildFragments()

    const interactable = this.ensureInteractable(this.pinchTarget)
    interactable.onTriggerStart.add((_e: InteractorEvent) => {
      const now = getTime()
      if (now - this.lastPinch < 0.35) return // debounce double events
      this.lastPinch = now
      print("[GRAVITY_SHIFT] pinch trigger (Interaction Kit)")
      this.advance()
    })
    this.enter(Phase.Intro)
  }

  private ensureInteractable(obj: SceneObject): Interactable {
    const existing = obj.getComponent(Interactable.getTypeName())
    if (existing) return existing
    if (obj.getComponents("Physics.ColliderComponent").length === 0) {
      const collider = obj.createComponent("Physics.ColliderComponent")
      const box = Shape.createBoxShape()
      // Collider lives on the core, so divide by its scale to get a world-size box.
      const s = obj.getTransform().getWorldScale()
      box.size = new vec3(this.colliderSizeCm / s.x, this.colliderSizeCm / s.y, this.colliderSizeCm / s.z)
      collider.shape = box
    }
    return obj.createComponent(Interactable.getTypeName())
  }

  private rand(): number {
    // ponytail: tiny LCG so the layout is identical every run (repeatable demo + tests).
    this.seed = (this.seed * 16807) % 2147483647
    return (this.seed - 1) / 2147483646
  }

  private buildFragments(): void {
    const n = this.fragmentsRoot.getChildrenCount()
    const planes = [-28, 8, 34] // three orbital planes -> readable "stable paths"
    for (let i = 0; i < n; i++) {
      const t = this.fragmentsRoot.getChild(i).getTransform()
      // Fibonacci sphere for an even spread, flattened a little vertically.
      const y = 1 - (2 * (i + 0.5)) / n
      const r = Math.sqrt(1 - y * y)
      const a = i * 2.39996
      const dir = new vec3(Math.cos(a) * r, y * 0.7, Math.sin(a) * r).normalize()
      const homeR = 15 + this.rand() * 11
      const orbitR = 12 + this.rand() * 14
      const tiltDeg = planes[i % 3] + (this.rand() - 0.5) * 8
      this.frags.push({
        t,
        pos: vec3.zero(),
        vel: vec3.zero(),
        home: dir.uniformScale(homeR),
        orbitR,
        orbitW: 1.7 * Math.sqrt(12 / orbitR) * (i % 2 === 0 ? 1 : 0.92),
        orbitPhase: this.rand() * Math.PI * 2,
        orbitTilt: quat.fromEulerAngles(tiltDeg * MathUtils.DegToRad, this.rand() * Math.PI * 2, (i % 3) * 0.35),
        attractR: 6.5 + this.rand() * 4,
        repelR: 42 + this.rand() * 16,
        spinAxis: new vec3(this.rand() - 0.5, this.rand() - 0.5, this.rand() - 0.5).normalize(),
        spinRate: 0.6 + this.rand() * 1.6,
        baseScale: t.getLocalScale(),
        scale: 0
      })
    }
  }

  private enter(next: Phase): void {
    const prev = this.phase
    this.phase = next
    this.phaseTime = 0
    if (next === Phase.Intro) {
      for (const f of this.frags) {
        f.pos = vec3.zero()
        f.vel = vec3.zero()
        f.scale = 0
      }
    } else if (next === Phase.Created) {
      for (const f of this.frags) f.vel = f.home.normalize().uniformScale(95) // burst out of the core
    } else if (next === Phase.Orbit) {
      this.orbitTime = 0
    } else if (next === Phase.Repel) {
      for (const f of this.frags) f.vel = f.vel.add(this.dirOf(f).uniformScale(130)) // dramatic push
    }
    const c = COPY[next]
    this.titleText.text = c.title
    this.subText.text = c.sub
    this.hintText.text = c.hint
    this.titleText.textFill.color = next === Phase.Repel ? GOLD : next === Phase.Orbit ? ICE : WHITE
    print(`[GRAVITY_SHIFT] phase ${PHASE_NAME[prev]} -> ${PHASE_NAME[next]}`)
  }

  private dirOf(f: Frag): vec3 {
    return f.pos.length > 0.01 ? f.pos.normalize() : f.home.normalize()
  }

  // Spawn in front of wherever the user is looking (device pose is only valid once frames run).
  private placeInFrontOfUser(): void {
    // ponytail: first root Camera wins; wire an @input if the scene ever gets a second camera.
    for (let i = 0; i < global.scene.getRootObjectsCount(); i++) {
      const o = global.scene.getRootObject(i)
      if (!o.getComponent("Component.Camera")) continue
      const ct = o.getTransform()
      const f = ct.getWorldRotation().multiplyVec3(new vec3(0, 0, -1))
      const flat = new vec3(f.x, 0, f.z).normalize() // upright: yaw only, but sit on the gaze line
      const t = this.getSceneObject().getTransform()
      t.setWorldPosition(ct.getWorldPosition().add(f.normalize().uniformScale(PLACE_DIST_CM)))
      t.setWorldRotation(quat.angleAxis(Math.atan2(-flat.x, -flat.z), vec3.up()))
      print(`[GRAVITY_SHIFT] placed ${PLACE_DIST_CM}cm in front of ${o.name}`)
      return
    }
  }

  private onUpdate(): void {
    if (!this.placed) {
      this.placed = true
      this.placeInFrontOfUser()
    }
    const dt = Math.min(getDeltaTime(), 0.05)
    const time = getTime()
    this.phaseTime += dt
    this.orbitTime += dt
    if (this.phase === Phase.Collapse && this.phaseTime >= COLLAPSE_TOTAL) this.enter(Phase.Complete)

    this.updateFragments(dt, time)
    this.updateCore(dt, time)
    this.updateRings(dt, time)
    this.updatePulse(time)
  }

  private updateFragments(dt: number, time: number): void {
    const p = this.phase
    let k = 10
    let damp = 3.5
    let spinMul = 1
    if (p === Phase.Attract) (k = 9), (damp = 3), (spinMul = 1.6)
    if (p === Phase.Orbit) (k = 28), (damp = 7)
    if (p === Phase.Repel) (k = 4), (damp = 2.2), (spinMul = 2.6)
    if (p === Phase.Collapse) (k = 70), (damp = 7), (spinMul = 4)

    for (let i = 0; i < this.frags.length; i++) {
      const f = this.frags[i]
      let target = vec3.zero()
      let scaleTarget = 1
      let extra = vec3.zero()
      if (p === Phase.Intro || p === Phase.Complete) {
        scaleTarget = 0
      } else if (p === Phase.Created) {
        const ph = f.orbitPhase
        target = f.home.add(new vec3(Math.sin(time * 0.7 + ph), Math.sin(time * 0.9 + ph * 1.3), Math.cos(time * 0.6 + ph)).uniformScale(1.6))
      } else if (p === Phase.Attract) {
        const d = this.dirOf(f)
        target = d.uniformScale(f.attractR)
        extra = d.cross(vec3.up()).uniformScale(55) // swirl -> fragments spiral in
        scaleTarget = 0.75
      } else if (p === Phase.Orbit) {
        const ang = f.orbitPhase + f.orbitW * this.orbitTime
        target = f.orbitTilt.multiplyVec3(new vec3(Math.cos(ang) * f.orbitR, 0, Math.sin(ang) * f.orbitR))
      } else if (p === Phase.Repel) {
        target = this.dirOf(f).uniformScale(f.repelR)
      } else if (p === Phase.Collapse) {
        scaleTarget = this.phaseTime < COLLAPSE_IMPLODE && f.pos.length > 3 ? 1 : 0
      }

      const acc = target.sub(f.pos).uniformScale(k).add(extra)
      f.vel = f.vel.add(acc.uniformScale(dt)).uniformScale(Math.exp(-damp * dt))
      f.pos = f.pos.add(f.vel.uniformScale(dt))
      f.scale += (scaleTarget - f.scale) * Math.min(1, dt * 7)

      f.t.setLocalPosition(f.pos)
      f.t.setLocalScale(f.baseScale.uniformScale(Math.max(f.scale, 0.0001)))
      const spin = quat.angleAxis(f.spinRate * spinMul * dt, f.spinAxis)
      f.t.setLocalRotation(spin.multiply(f.t.getLocalRotation()))
    }
  }

  private updateCore(dt: number, time: number): void {
    const p = this.phase
    let coreMul = 1 + 0.06 * Math.sin(time * 2.2)
    let haloMul = 1 + 0.1 * Math.sin(time * 1.6)
    if (p === Phase.Intro) haloMul *= 0.8
    if (p === Phase.Attract) haloMul *= 0.85 + 0.08 * Math.sin(time * 6)
    if (p === Phase.Repel) haloMul *= 1.25
    if (p === Phase.Collapse) {
      const ct = this.phaseTime
      if (ct < COLLAPSE_IMPLODE) {
        coreMul = 1 - 0.4 * (ct / COLLAPSE_IMPLODE) // compress
        haloMul = 1 - 0.5 * (ct / COLLAPSE_IMPLODE)
      } else {
        const k = Math.min(1, (ct - COLLAPSE_IMPLODE) / (COLLAPSE_TOTAL - COLLAPSE_IMPLODE))
        const flash = Math.exp(-5 * k) // bright burst, then settle
        coreMul = 1 + 1.6 * flash
        haloMul = 1 + 2.4 * flash
      }
    }
    this.core.getTransform().setLocalScale(this.coreBase.uniformScale(coreMul))
    this.halo.getTransform().setLocalScale(this.haloBase.uniformScale(haloMul))

    const target = PHASE_COLOR[p]
    this.haloColor = vec4.lerp(this.haloColor, target, Math.min(1, dt * 4))
    this.setColor(this.halo, this.haloColor)
    this.setColor(this.fragmentsRoot.getChildrenCount() > 0 ? this.fragmentsRoot.getChild(0) : null, vec4.lerp(this.haloColor, WHITE, 0.55))
  }

  private updateRings(dt: number, time: number): void {
    const want = this.phase === Phase.Orbit ? 1 : 0
    this.ringVis += (want - this.ringVis) * Math.min(1, dt * 3)
    const v = Math.max(this.ringVis, 0.0001)
    const a = this.ringA.getTransform()
    const b = this.ringB.getTransform()
    a.setLocalScale(this.ringABase.uniformScale(v))
    b.setLocalScale(this.ringBBase.uniformScale(v))
    a.setLocalRotation(quat.fromEulerAngles(1.2, time * 0.5, 0.25))
    b.setLocalRotation(quat.fromEulerAngles(-0.45, -time * 0.35, -0.5))
  }

  private updatePulse(time: number): void {
    const p = this.phase
    let s = 0.0001
    let color = BLACK
    if (p === Phase.Attract) {
      const k = (time * 0.8) % 1
      s = 3.2 - 3.0 * k // contracts toward the core
      color = vec4.lerp(BLACK, CYAN, Math.sin(Math.PI * k))
    } else if (p === Phase.Repel) {
      const k = (time * 0.9) % 1
      s = 0.3 + 3.4 * (1 - Math.pow(1 - k, 2)) // expands outward
      color = vec4.lerp(BLACK, GOLD, 1 - k)
    } else if (p === Phase.Collapse && this.phaseTime >= COLLAPSE_IMPLODE) {
      const k = Math.min(1, (this.phaseTime - COLLAPSE_IMPLODE) / 1.2)
      s = 0.3 + 7 * (1 - Math.pow(1 - k, 3)) // one big shockwave
      color = vec4.lerp(BLACK, vec4.lerp(CYAN, WHITE, 1 - k), Math.pow(1 - k, 1.5))
    }
    this.pulse.getTransform().setLocalScale(this.pulseBase.uniformScale(s))
    // Additive blending: fading to black == fading out on SPECS' additive display.
    this.setColor(this.pulse, color)
  }

  private setColor(obj: SceneObject | null, c: vec4): void {
    if (!obj) return
    const rmv = obj.getComponent("Component.RenderMeshVisual")
    // Some imported materials have no exposed mainPass. Keep the experience running.
    if (rmv && rmv.mainMaterial && rmv.mainMaterial.mainPass) {
      rmv.mainMaterial.mainPass.baseColor = c
    }
  }
}
