
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-fc-three',
  imports: [],
  templateUrl: './fc-three.html',
  styleUrl: './fc-three.scss',
})
export class FcThree implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true })
  private canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private mesh!: THREE.Group;

  private animationFrameId = 0;
  private destroyed = false;

  // Rotação
  private targetRotationX = 0;
  private targetRotationY = -0.4;

  private isDragging = false;
  private activePointerId: number | null = null;
  private lastPointerX = 0;
  private lastPointerY = 0;

  // Sensibilidade e suavização
  private readonly touchSensitivity = 0.006;
  private readonly smoothing = 0.08;
  private readonly autoRotationSpeed = 0.002;

  private readonly minRotationX = -0.65;
  private readonly maxRotationX = 0.65;

  // Animação de entrada
  private introProgress = 0;
  private introComplete = false;

  // Retomada da rotação automática
  private autoRotationBlend = 1;
  private readonly autoRotationBlendSpeed = 0.025;

  ngAfterViewInit(): void {
    this.initScene();
    this.createObject();
    this.animate();
  }

  private initScene(): void {
    const container = this.canvasContainer.nativeElement;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      0.1,
      100,
    );

    this.camera.position.set(0, 0, 7);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2),
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = this.renderer.domElement;

    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'grab';

    // Garante que o container tenha apenas o canvas atual.
    container.replaceChildren(canvas);

    this.addLights();

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('blur', this.handleWindowBlur);

    // Eventos registrados diretamente no canvas do Three.js.
    canvas.addEventListener(
      'pointerdown',
      this.handlePointerDown,
    );

    canvas.addEventListener(
      'pointermove',
      this.handlePointerMove,
    );

    canvas.addEventListener(
      'pointerup',
      this.handlePointerUp,
    );

    canvas.addEventListener(
      'pointercancel',
      this.handlePointerUp,
    );

    canvas.addEventListener(
      'lostpointercapture',
      this.handlePointerUp,
    );
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.2,
    );

    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      5,
    );

    keyLight.position.set(4, 5, 6);
    this.scene.add(keyLight);

    const accentLight = new THREE.PointLight(
      0xb8b0a0,
      18,
      12,
    );

    accentLight.position.set(-4, 2, 4);
    this.scene.add(accentLight);

    const rimLight = new THREE.PointLight(
      0xffffff,
      10,
      10,
    );

    rimLight.position.set(3, -2, -3);
    this.scene.add(rimLight);
  }

  private createObject(): void {
    const group = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
      color: 0x514d45,
      metalness: 0.82,
      roughness: 0.2,
    });

    // Letra F
    const fShape = new THREE.Shape();

    fShape.moveTo(-1.8, 1.2);
    fShape.lineTo(-0.3, 1.2);
    fShape.lineTo(-0.3, 0.85);
    fShape.lineTo(-1.25, 0.85);
    fShape.lineTo(-1.25, 0.25);
    fShape.lineTo(-0.45, 0.25);
    fShape.lineTo(-0.45, -0.1);
    fShape.lineTo(-1.25, -0.1);
    fShape.lineTo(-1.25, -1.2);
    fShape.lineTo(-1.8, -1.2);
    fShape.closePath();

    const extrusionOptions = {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelSegments: 3,
    };

    const fGeometry = new THREE.ExtrudeGeometry(
      fShape,
      extrusionOptions,
    );

    group.add(new THREE.Mesh(fGeometry, material));

    // Letra C
    const cShape = new THREE.Shape();

    const outerRadius = 1.25;
    const innerRadius = 0.78;
    const startAngle = Math.PI / 4;
    const endAngle = Math.PI * 1.75;

    cShape.absarc(
      1.05,
      0,
      outerRadius,
      startAngle,
      endAngle,
      false,
    );

    cShape.absarc(
      1.05,
      0,
      innerRadius,
      endAngle,
      startAngle,
      true,
    );

    cShape.closePath();

    const cGeometry = new THREE.ExtrudeGeometry(
      cShape,
      extrusionOptions,
    );

    group.add(new THREE.Mesh(cGeometry, material));

    group.position.set(0, 0, 0);
    group.scale.setScalar(0.85);
    group.rotation.y = -0.4;

    this.mesh = group;
    this.scene.add(group);
  }

  // Início do arraste
  private handlePointerDown = (
    event: PointerEvent,
  ): void => {
    if (event.button !== 0 || this.activePointerId !== null) {
      return;
    }

    event.preventDefault();

    const canvas = this.renderer.domElement;

    this.isDragging = true;
    this.activePointerId = event.pointerId;

    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;

    this.introComplete = true;

    this.targetRotationX = this.mesh.rotation.x;
    this.targetRotationY = this.mesh.rotation.y;

    this.autoRotationBlend = 0;

    canvas.style.cursor = 'grabbing';

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // A captura pode falhar se o ponteiro já não estiver ativo.
    }
  };

  // Movimento do arraste
  private handlePointerMove = (
    event: PointerEvent,
  ): void => {
    if (
      !this.isDragging ||
      event.pointerId !== this.activePointerId
    ) {
      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - this.lastPointerX;
    const deltaY = event.clientY - this.lastPointerY;

    this.targetRotationY +=
      deltaX * this.touchSensitivity;

    this.targetRotationX = THREE.MathUtils.clamp(
      this.targetRotationX +
        deltaY * this.touchSensitivity,
      this.minRotationX,
      this.maxRotationX,
    );

    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  };

  // Fim do arraste
  private handlePointerUp = (
    event: PointerEvent,
  ): void => {
    if (
      this.activePointerId !== null &&
      event.pointerId !== this.activePointerId
    ) {
      return;
    }

    this.releasePointer();
  };

  private handleWindowBlur = (): void => {
    this.releasePointer();
  };

  private releasePointer(): void {
    const pointerId = this.activePointerId;

    this.isDragging = false;
    this.activePointerId = null;

    if (!this.renderer) {
      return;
    }

    const canvas = this.renderer.domElement;
    canvas.style.cursor = 'grab';

    if (
      pointerId !== null &&
      canvas.hasPointerCapture(pointerId)
    ) {
      canvas.releasePointerCapture(pointerId);
    }
  }

  // Animação contínua
  private animate = (): void => {
    if (this.destroyed) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(
      this.animate,
    );

    if (
      !this.renderer ||
      !this.scene ||
      !this.camera ||
      !this.mesh
    ) {
      return;
    }

    // Animação de entrada
    if (!this.introComplete) {
      this.introProgress += 0.015;

      const progress = Math.min(
        this.introProgress,
        1,
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      this.mesh.scale.setScalar(
        0.7 + eased * 0.3,
      );

      this.mesh.rotation.y = -0.4 + eased * 0.4;

      if (progress >= 1) {
        this.introComplete = true;

        this.targetRotationX = this.mesh.rotation.x;
        this.targetRotationY = this.mesh.rotation.y;
      }
    }

    if (this.introComplete) {
      // Rotação automática quando não está sendo arrastado
      if (!this.isDragging) {
        this.autoRotationBlend = Math.min(
          this.autoRotationBlend +
            this.autoRotationBlendSpeed,
          1,
        );

        this.targetRotationY +=
          this.autoRotationSpeed *
          this.autoRotationBlend;
      }

      // Suavização da rotação
      this.mesh.rotation.x +=
        (this.targetRotationX -
          this.mesh.rotation.x) *
        this.smoothing;

      this.mesh.rotation.y +=
        (this.targetRotationY -
          this.mesh.rotation.y) *
        this.smoothing;
    }

    // Movimento vertical sutil
    this.mesh.position.y =
      Math.sin(performance.now() * 0.001) * 0.025;

    this.renderer.render(this.scene, this.camera);
  };

  private handleResize = (): void => {
    if (!this.camera || !this.renderer) {
      return;
    }

    const container = this.canvasContainer.nativeElement;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2),
    );
  };

  ngOnDestroy(): void {
    this.destroyed = true;

    cancelAnimationFrame(this.animationFrameId);

    window.removeEventListener(
      'resize',
      this.handleResize,
    );

    window.removeEventListener(
      'blur',
      this.handleWindowBlur,
    );

    this.releasePointer();

    const canvas = this.renderer?.domElement;

    canvas?.removeEventListener(
      'pointerdown',
      this.handlePointerDown,
    );

    canvas?.removeEventListener(
      'pointermove',
      this.handlePointerMove,
    );

    canvas?.removeEventListener(
      'pointerup',
      this.handlePointerUp,
    );

    canvas?.removeEventListener(
      'pointercancel',
      this.handlePointerUp,
    );

    canvas?.removeEventListener(
      'lostpointercapture',
      this.handlePointerUp,
    );

    this.mesh?.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.dispose();
          });
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer?.dispose();
    canvas?.remove();
  }
}
