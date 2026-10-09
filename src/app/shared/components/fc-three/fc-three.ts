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

  private mouseX = 0;
  private mouseY = 0;

  private targetRotationX = 0;
  private targetRotationY = 0;

  private introProgress = 0;
  private introComplete = false;

  ngAfterViewInit(): void {
    this.initScene();
    this.createObject();
    this.animate();
  }

  private initScene(): void {
    const container = this.canvasContainer.nativeElement;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      0.1,
      100
    );

    this.camera.position.set(0, 0, 7);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(this.renderer.domElement);

    this.addLights();

    window.addEventListener(
      'resize',
      this.handleResize
    );
    
    window.addEventListener(
      'mousemove',
      this.handleMouseMove
    );  
  }

  private addLights(): void {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.2
    );

    this.scene.add(ambientLight);

    // Luz principal — vem do canto superior direito
    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      5
    );

    keyLight.position.set(4, 5, 6);

    this.scene.add(keyLight);

    // Luz lateral quente — cria o reflexo champagne
    const accentLight = new THREE.PointLight(
      0xb8b0a0,
      18,
      12
    );

    accentLight.position.set(
      -4,
      2,
      4
    );

    this.scene.add(accentLight);

    // Luz de recorte — destaca a silhueta
    const rimLight = new THREE.PointLight(
      0xffffff,
      10,
      10
    );

    rimLight.position.set(
      3,
      -2,
      -3
    );

    this.scene.add(rimLight);
  }

  private createObject(): void {
    const group = new THREE.Group();

    group.scale.set(0.7, 0.7, 0.7);
    group.rotation.y = -0.4;

    const material = new THREE.MeshStandardMaterial({
      color: 0x3a3936,
      metalness: 0.9,
      roughness: 0.22,
    });

    // =========================
    // F
    // =========================

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

    const fGeometry = new THREE.ExtrudeGeometry(
      fShape,
      {
        depth: 0.35,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.05,
        bevelSegments: 3,
      }
    );

    const fMesh = new THREE.Mesh(
      fGeometry,
      material
    );

    group.add(fMesh);

    // =========================
    // C
    // =========================

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
      false
    );

    cShape.absarc(
      1.05,
      0,
      innerRadius,
      endAngle,
      startAngle,
      true
    );

    cShape.closePath();

    const cGeometry = new THREE.ExtrudeGeometry(
      cShape,
      {
        depth: 0.35,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.05,
        bevelSegments: 3,
      }
    );

    const cMesh = new THREE.Mesh(
      cGeometry,
      material
    );

    group.add(cMesh);

    // =========================
    // GRUPO FC
    // =========================

    group.position.x = 0;
    group.position.y = 0;

    group.scale.set(0.85, 0.85, 0.85);

    this.mesh = group;

    this.scene.add(group);
  }

  private handleMouseMove = (
    event: MouseEvent
  ): void => {
    this.mouseX =
      (event.clientX / window.innerWidth) * 2 - 1;

    this.mouseY =
      (event.clientY / window.innerHeight) * 2 - 1;

    this.targetRotationY =
      this.mouseX * 0.18;

    this.targetRotationX =
      this.mouseY * 0.1;
  };

  private animate = (): void => {
    this.animationFrameId =
      requestAnimationFrame(this.animate);

    if (this.mesh) {
      // =========================
      // ANIMAÇÃO DE ENTRADA
      // =========================

      if (!this.introComplete) {
        this.introProgress += 0.015;

        const progress = Math.min(
          this.introProgress,
          1
        );

        // Ease-out
        const eased =
          1 - Math.pow(1 - progress, 3);

        this.mesh.scale.setScalar(
          0.7 + eased * 0.3
        );

        this.mesh.rotation.y =
          -0.4 + eased * 0.4;

        if (progress >= 1) {
          this.introComplete = true;
        }
      }

      // =========================
      // MOVIMENTO DO MOUSE
      // =========================

      this.mesh.rotation.x +=
        (this.targetRotationX -
          this.mesh.rotation.x) * 0.03;

      this.mesh.rotation.y +=
        (this.targetRotationY -
          this.mesh.rotation.y) * 0.03;

      // Movimento próprio extremamente sutil
      this.mesh.position.y =
        Math.sin(performance.now() * 0.001) *
        0.025;
    }

    this.renderer.render(
      this.scene,
      this.camera
    );
  };

  private handleResize = (): void => {
    const container =
      this.canvasContainer.nativeElement;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      width,
      height
    );
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(
      this.animationFrameId
    );

    window.removeEventListener(
      'resize',
      this.handleResize
    );

    this.mesh?.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach(
            material => material.dispose()
          );
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer?.dispose();
  }
}
