import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, signal, effect } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Text } from 'troika-three-text';

@Component({
    selector: 'app-graph',
    imports: [MatSelectModule, MatFormFieldModule],
    templateUrl: './graph.html',
    styleUrl: './graph.scss'
})
export class Graph implements AfterViewInit {

    @ViewChild('canvas', { static: true })
    canvasRef!: ElementRef<HTMLCanvasElement>;

    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private textMesh!: Text;
    private cube!: THREE.Mesh;
    private sphere!: THREE.Mesh;
    private animationId: number = 0;
    private controls!: OrbitControls;

    selectedCanvas = signal<"exampleOne" | "exampleTwo" | "exampleThree" | "exampleFour" | ''>('');

    constructor() {
        // Create an effect that runs whenever selectedCanvas changes
        effect(() => {
            const canvasType = this.selectedCanvas();

            if (canvasType) {

                switch (canvasType) {
                    case 'exampleOne':
                        this.initThreeJSExampleOne();
                        this.animate();
                        break;
                    case 'exampleTwo':
                        this.initThreeJsExampleTwo();
                        this.animate();
                        break;
                    case 'exampleThree':
                        this.initThreeJsExampleThree();
                        this.animate();
                        break;
                    default:
                        console.warn(`Unknown canvas type: ${canvasType}`);
                }
            }
        });
    }

    onCanvasChange($event: any) {
        this.selectedCanvas.set($event.value as any);
    }

    ngAfterViewInit(): void {
        this.selectedCanvas.set('exampleOne');
    }

    private initThreeJSExampleOne(): void {
        const canvas = this.canvasRef.nativeElement;

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.set(0, 0, 200);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Add orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Example well log data (depth vs GR)
        const depths = [...Array(200).keys()].map(i => i * 0.5); // 0 to 100 ft
        const gammaRay = depths.map(d => 50 + 30 * Math.sin(d / 5)); // synthetic GR values

        // Build geometry
        const points = depths.map((d, i) => new THREE.Vector3(gammaRay[i], -d, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Build line material
        const material = new THREE.LineBasicMaterial({ color: 0x00ff88, linewidth: 2 });

        // Create line
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);

        // Optional grid/axes helper
        const grid = new THREE.GridHelper(200, 10, 0x444444, 0x222222);
        grid.rotation.x = Math.PI / 2;
        this.scene.add(grid);

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

    private initThreeJsExampleTwo(): void {

        const canvas = this.canvasRef.nativeElement;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, -50, 200);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //document.body.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // Example data
        const depths = [...Array(200).keys()].map(i => i * 0.5);
        const gammaRay = depths.map(d => 50 + 30 * Math.sin(d / 5));

        // Geometry
        const points = depths.map((d, i) => new THREE.Vector3(gammaRay[i], -d, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Line
        const material = new THREE.LineBasicMaterial({ color: 0x00ff88 });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);

        // Axis lines
        const axisMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
        const axisGeoX = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(150, 0, 0)
        ]);

        const axisGeoY = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -100, 0)
        ]);

        this.scene.add(new THREE.Line(axisGeoX, axisMaterial));
        this.scene.add(new THREE.Line(axisGeoY, axisMaterial));

        // Axis labels
        this.makeText('Gamma Ray (API)', 50, 10, 4, 0x00ff88);
        this.makeText('Depth (ft)', -20, -50, 4, 0xffffff).rotation.z = Math.PI / 2;

        // Depth ticks
        for (let d = 0; d <= 100; d += 10) {

            const tickGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, -d, 0),
                new THREE.Vector3(-2, -d, 0)
            ]);

            this.scene.add(new THREE.Line(tickGeo, axisMaterial));
            this.makeText(`${d}`, -8, -d, 2, 0xaaaaaa);
        }

        // X-axis ticks
        for (let x = 0; x <= 150; x += 30) {

            const tickGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, 0, 0),
                new THREE.Vector3(x, 2, 0)
            ]);

            this.scene.add(new THREE.Line(tickGeo, axisMaterial));
            this.makeText(`${x}`, x - 2, 4, 2, 0xaaaaaa);
        }
    }

    private initThreeJsExampleThree(): void {

        const canvas = this.canvasRef.nativeElement;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, -50, 300);

        this.renderer = new THREE.WebGLRenderer({canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // --- Data ---
        const depths = [...Array(200).keys()].map(i => i * 0.5); // 0–100 ft

        // synthetic logs
        const gammaRay = depths.map(d => 50 + 30 * Math.sin(d / 5));
        const density = depths.map(d => 2.3 + 0.1 * Math.cos(d / 8));
        const neutron = depths.map(d => 0.25 + 0.05 * Math.sin(d / 6));

        // --- Track Layout ---
        const trackSpacing = 100; // distance between tracks in X
        const trackConfigs = [
            { name: 'Gamma Ray', color: 0x00ff88, data: gammaRay, x0: 0, xScale: 1 },
            { name: 'Density', color: 0xffcc00, data: density.map(v => (v - 2.0) * 200), x0: trackSpacing, xScale: 1 },
            { name: 'Neutron', color: 0x00aaff, data: neutron.map(v => v * 400), x0: trackSpacing * 2, xScale: 1 }
        ];

        // --- Shared Depth Axis ---
        this.makeLine([new THREE.Vector3(-10, 0, 0), new THREE.Vector3(-10, -100, 0)], 0xaaaaaa);
        this.makeText('Depth (ft)', -20, -50, 4, 0xffffff).rotation.z = Math.PI / 2;

        for (let d = 0; d <= 100; d += 10) {
            this.makeLine([new THREE.Vector3(-10, -d, 0), new THREE.Vector3(-12, -d, 0)], 0x666666);
            this.makeText(`${d}`, -18, -d, 2, 0xaaaaaa);
        }

        // --- Draw Each Track ---
        trackConfigs.forEach(track => {
            const points = depths.map((d, i) => new THREE.Vector3(track.x0 + track.data[i] * track.xScale, -d, 0));
            this.makeLine(points, track.color);

            // Track Title
            this.makeText(track.name, track.x0 + 25, 8, 4, track.color);

            // Track bounding box
            this.makeLine([
                new THREE.Vector3(track.x0, 0, 0),
                new THREE.Vector3(track.x0 + 80, 0, 0),
                new THREE.Vector3(track.x0 + 80, -100, 0),
                new THREE.Vector3(track.x0, -100, 0),
                new THREE.Vector3(track.x0, 0, 0)
            ], 0x333333);

            // X-axis ticks
            for (let x = 0; x <= 80; x += 20) {
                this.makeLine([
                    new THREE.Vector3(track.x0 + x, 0, 0),
                    new THREE.Vector3(track.x0 + x, 2, 0)
                ], 0x666666);
                this.makeText(`${x}`, track.x0 + x - 4, 4, 2, 0xaaaaaa);
            }
        });
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

        this.animate();
    }

    private animate(): void {

        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        // this.animationId = requestAnimationFrame(() => this.animate());

        // // Rotate the text
        // if (this.textMesh) {
        //     this.textMesh.rotation.y += 0.01;
        // }

        // // Rotate the cube
        // if (this.cube) {
        //     this.cube.rotation.x += 0.01;
        //     this.cube.rotation.y += 0.01;
        // }

        // // Rotate the sphere
        // if (this.sphere) {
        //     this.sphere.rotation.x += 0.02;
        //     this.sphere.rotation.y += 0.01;
        // }

        // this.renderer.render(this.scene, this.camera);
    }

    makeText(str: string, x: number, y: number, size = 3, color = 0xffffff) {
        const text = new Text();
        text.text = str;
        text.fontSize = size;
        text.color = color;
        text.position.set(x, y, 0);
        text.sync();
        this.scene.add(text);
        return text;
    }

    makeLine(points: THREE.Vector3[], color = 0xffffff) {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color });
        const line = new THREE.Line(geo, mat);
        this.scene.add(line);
        return line;
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
