'use client';

import React, { useEffect, useRef } from 'react';

export default function AuroraVeilCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
    if (!gl) return;

    let animationFrameId: number;

    const VERT = `#version 300 es
    precision highp float;
    void main(){
      vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
      gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    }`;

    const FRAG = `#version 300 es
    precision highp float;
    out vec4 fragColor;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
    
    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < 4; i++){
        v += a * noise(p);
        p = p * 2.1 + vec2(1.7, 3.2);
        a *= 0.52;
      }
      return v;
    }

    vec3 auroraPal(float t){
      // Emerald -> Cyan -> Deep Indigo
      vec3 colA = vec3(0.05, 0.77, 0.45);
      vec3 colB = vec3(0.12, 0.65, 0.95);
      vec3 colC = vec3(0.55, 0.25, 0.85);
      return mix(mix(colA, colB, smoothstep(0.0, 0.5, t)), colC, smoothstep(0.5, 1.0, t));
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

      float sway = (u_mouse.x - 0.5) * 0.8;
      float t = u_time * 0.25;

      vec3 bg = mix(vec3(0.02, 0.04, 0.08), vec3(0.01, 0.02, 0.05), uv.y);

      vec3 auroraSum = vec3(0.0);
      for (int i = 1; i <= 3; i++) {
        float fi = float(i);
        float wave = sin(p.x * 2.2 + t * 0.8 + fi * 1.5 + sway) * 0.25;
        float curtainDist = abs(p.y - wave + (fi * 0.15 - 0.25));
        
        vec2 fbmCoord = vec2(p.x * 3.0 + t * 0.4 + fi, p.y * 1.8 - t * 0.3);
        float pattern = fbm(fbmCoord);
        
        float glow = exp(-curtainDist * (8.0 + fi * 2.0)) * pattern * 1.4;
        vec3 col = auroraPal(fract(pattern + fi * 0.3 + t * 0.1));
        auroraSum += col * glow;
      }

      vec3 finalCol = bg + auroraSum * 0.75;
      fragColor = vec4(finalCol, 0.92);
    }`;

    function createShader(context: WebGL2RenderingContext, type: number, src: string) {
      const s = context.createShader(type)!;
      context.shaderSource(s, src);
      context.compileShader(s);
      return s;
    }

    const prg = gl.createProgram()!;
    gl.attachShader(prg, createShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prg, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prg);
    gl.useProgram(prg);

    const uRes = gl.getUniformLocation(prg, 'u_res');
    const uTime = gl.getUniformLocation(prg, 'u_time');
    const uMouse = gl.getUniformLocation(prg, 'u_mouse');

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();

    function render() {
      if (!gl || !canvas) return;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const elapsed = (performance.now() - startTime) / 1000.0;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-70"
    />
  );
}
