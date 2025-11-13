import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { Text } from 'troika-three-text';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('canvas', { static: true }) 
  canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private textMesh!: Text;
  private cube!: THREE.Mesh;
  private sphere!: THREE.Mesh;
  private animationId: number = 0;

  ngOnInit(): void {
    // Initialization will happen in ngAfterViewInit
  }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.createTextMesh();
    this.animate();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private createTextMesh(): void {
    // Create troika-three-text mesh
    this.textMesh = new Text();
    
    // Set text properties
    this.textMesh.text = 'Hello World!\nWelcome to Troika.js\nwith Angular 20';
    this.textMesh.fontSize = 0.5;
    this.textMesh.font = '/Roboto-Regular.ttf';  // Use local font file
    this.textMesh.position.set(0, 0, 0);
    this.textMesh.color = 0x00ff00;
    this.textMesh.textAlign = 'center';
    this.textMesh.anchorX = 'center';
    this.textMesh.anchorY = 'middle';
    
    // Sync the text to update the geometry
    // Use callback to handle async font loading
    this.textMesh.sync(() => {
      console.log('Text mesh synced successfully');
    });
    
    this.scene.add(this.textMesh);
    
    // Add a simple cube as a fallback/additional visual element
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(-2, 0, 0);
    this.scene.add(this.cube);
    
    // Add a simple sphere
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.set(2, 0, 0);
    this.scene.add(this.sphere);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate the text
    if (this.textMesh) {
      this.textMesh.rotation.y += 0.01;
    }
    
    // Rotate the cube
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
    
    // Rotate the sphere
    if (this.sphere) {
      this.sphere.rotation.x += 0.02;
      this.sphere.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  ngOnDestroy(): void {
    // Clean up
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.textMesh) {
      this.textMesh.dispose();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}
