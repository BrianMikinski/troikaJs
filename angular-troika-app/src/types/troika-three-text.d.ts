declare module 'troika-three-text' {
  import * as THREE from 'three';

  export class Text extends THREE.Mesh {
    text: string;
    fontSize: number;
    font?: string;
    color: number | string | THREE.Color;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    anchorX?: number | string;
    anchorY?: number | string;
    maxWidth?: number;
    lineHeight?: number;
    letterSpacing?: number;
    
    sync(callback?: () => void): void;
    dispose(): void;
  }
}
