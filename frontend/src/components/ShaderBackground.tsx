"use client"

import { useEffect, useRef } from "react"

// Modified fragment shader with earth tone palette
const fragmentShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_intensity;
  
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), 
                  dot(p, vec2(269.5, 183.3)), 
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(dot(hash3(i + vec2(0.0,0.0)).xy, f - vec2(0.0,0.0)), 
                   dot(hash3(i + vec2(1.0,0.0)).xy, f - vec2(1.0,0.0)), u.x),
               mix(dot(hash3(i + vec2(0.0,1.0)).xy, f - vec2(0.0,1.0)), 
                   dot(hash3(i + vec2(1.0,1.0)).xy, f - vec2(1.0,1.0)), u.x), u.y);
  }
  
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 0.25;
    
    for(int i = 0; i < 10; i++) {
      if(i >= octaves) break;
      value += amplitude * noise(p * frequency);
      amplitude *= 0.52;
      frequency *= 1.13;
    }
    return value;
  }
  
  float voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 50.0;
    
    for(int i = -2; i <= 2; i++) {
      for(int j = -2; j <= 2; j++) {
        vec2 g = vec2(i, j);
        vec2 o = hash3(n + g).xy;
        o = 0.5 + 0.41 * sin(u_time * 1.5 + 6.28 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        md = min(md, d);
      }
    }
    return sqrt(md);
  }
  
  float plasma(vec2 p, float time) {
    float a = sin(p.x * 8.0 + time * 2.0);
    float b = sin(p.y * 8.0 + time * 1.7);
    float c = sin((p.x + p.y) * 6.0 + time * 1.3);
    float d = sin(sqrt(p.x * p.x + p.y * p.y) * 8.0 + time * 2.3);
    return (a + b + c + d) * 0.5;
  }
  
  vec2 curl(vec2 p, float time) {
    float eps = 0.5;
    float n1 = fbm(p + vec2(eps, 0.0), 6);
    float n2 = fbm(p - vec2(eps, 0.0), 6);
    float n3 = fbm(p + vec2(0.0, eps), 6);
    float n4 = fbm(p - vec2(0.0, eps), 6);
    
    return vec2((n3 - n4) / (2.0 * eps), (n2 - n1) / (2.0 * eps));
  }

  float grain(vec2 uv, float time) {
    vec2 seed = uv * time;
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 st = (uv - 0.5) * 2.0;
    st.x *= u_resolution.x / u_resolution.y;
    
    float time = u_time * 0.15;
    
    vec2 curlForce = curl(st * 2.0, time) * 0.4;
    vec2 flowField = st + curlForce;
    
    float dist1 = fbm(flowField * 1.5 + time * 1.2, 8) * 0.4;
    float dist2 = fbm(flowField * 2.3 - time * 0.8, 6) * 0.3;
    float dist3 = fbm(flowField * 3.1 + time * 1.8, 4) * 0.2;
    float dist4 = fbm(flowField * 4.7 - time * 1.1, 3) * 0.15;
    
    float cells = voronoi(flowField * 2.5 + time * 0.5);
    cells = smoothstep(0.1, 0.7, cells);
    
    float plasmaEffect = plasma(flowField + vec2(dist1, dist2), time * 1.5) * 0.2;
    float totalDist = dist1 + dist2 + dist3 + dist4 + plasmaEffect;
    
    // Earth tone palette colors
    // #606c38 - olive green
    // #283618 - dark forest green
    // #fefae0 - cream
    // #dda15e - warm tan
    // #bc6c25 - warm brown
    
    vec3 color1 = vec3(0.88, 0.84, 0.55);   // #dda15e warm tan
    vec3 color2 = vec3(0.74, 0.42, 0.15);   // #bc6c25 warm brown
    vec3 color3 = vec3(0.38, 0.42, 0.22);   // #606c38 olive green
    vec3 color4 = vec3(0.16, 0.21, 0.10);   // #283618 dark green
    vec3 color5 = vec3(0.99, 0.98, 0.88);   // #fefae0 cream
    vec3 color6 = vec3(0.45, 0.50, 0.32);   // lighter olive
    vec3 color7 = vec3(0.85, 0.75, 0.60);   // lighter tan
    
    float gradient = 1.0 - uv.y;
    float colorNoise = fbm(flowField * 3.0 + time * 0.5, 4) * 0.5 + 0.5;
    float colorShift = sin(time * 1.5 + st.y * 2.0) * 0.5 + 0.5;
    
    vec3 finalColor;
    
    float t1 = smoothstep(0.85, 1.0, gradient);
    float t2 = smoothstep(0.7, 0.85, gradient);
    float t3 = smoothstep(0.5, 0.7, gradient);
    float t4 = smoothstep(0.3, 0.5, gradient);
    float t5 = smoothstep(0.15, 0.3, gradient);
    float t6 = smoothstep(0.0, 0.15, gradient);
    
    finalColor = mix(color4, color3, t6);
    finalColor = mix(finalColor, color6, t5);
    finalColor = mix(finalColor, color2, t4);
    finalColor = mix(finalColor, color1, t3);
    finalColor = mix(finalColor, color7, t2);
    finalColor = mix(finalColor, color5, t1);
    
    finalColor = mix(finalColor, color3, colorNoise * 0.4);
    finalColor = mix(finalColor, color1, colorShift * 0.3);
    
    vec2 aberration = curlForce * 0.02;
    vec3 aberrationColor = finalColor;
    aberrationColor.r = mix(finalColor.r, color1.r, length(aberration) * 1.0);
    aberrationColor.b = mix(finalColor.b, color3.b, length(aberration) * 0.8);
    aberrationColor.g = mix(finalColor.g, color2.g, length(aberration) * 0.6);
    
    float pulse1 = sin(time * 2.0 + st.y * 6.0) * 0.5 + 0.5;
    float pulse2 = sin(time * 3.0 - st.y * 8.0) * 0.5 + 0.5;
    float energyPulse = smoothstep(0.3, 0.7, pulse1 * pulse2);
    
    float streak1 = sin((st.x + totalDist) * 8.0 + time * 2.0) * 0.5 + 0.5;
    float streak2 = sin((st.x + totalDist * 0.7) * 12.0 - time * 1.5) * 0.5 + 0.5;
    
    streak1 = smoothstep(0.3, 0.7, streak1);
    streak2 = smoothstep(0.2, 0.8, streak2);
    
    float combinedStreaks = streak1 * 0.6 + streak2 * 0.4;
    
    float intensity = (0.3 + combinedStreaks * 0.4) * (1.0 + energyPulse * 0.2);
    intensity *= (1.0 + cells * 0.1);
    intensity *= 0.6;
    
    vec3 result = aberrationColor * intensity;
    
    float bloom = smoothstep(0.4, 1.0, intensity) * 0.3;
    result += bloom * finalColor * 0.2;
    
    result = pow(result, vec3(0.90));
    result = mix(result, result * result, 0.15);
    
    float vignette = 1.0 - length(uv - 0.5) * 0.6;
    vignette = smoothstep(0.2, 1.0, vignette);
    
    vec3 bgColor = vec3(0.99, 0.98, 0.88) + finalColor * 0.02;
    result = mix(bgColor, result, smoothstep(0.0, 0.3, intensity));
    result *= vignette;
    
    result = mix(vec3(dot(result, vec3(0.299, 0.587, 0.114))), result, 1.1);

    float grainAmount = 0.06;
    float grainValue = grain(uv, time * 0.5) * 2.0 - 1.0;
    result += grainValue * grainAmount;

    float scanline = sin(uv.y * u_resolution.y * 2.0) * 0.02;
    result += scanline;
    
    gl_FragColor = vec4(result, 1.0);
  }
`

const vertexShader = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    glRef.current = gl

    // Create shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShader)
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShader)

    if (!vertShader || !fragShader) return

    const program = gl.createProgram()
    if (!program) return

    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program))
      return
    }

    programRef.current = program

    // Create buffer
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )

    const positionLocation = gl.getAttribLocation(program, "position")
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
    const intensityLocation = gl.getUniformLocation(program, "u_intensity")

    // Resize canvas to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation loop
    const animate = () => {
      const time = (Date.now() - startTimeRef.current) * 0.001

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1f(timeLocation, time)
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
      gl.uniform1f(intensityLocation, 0.6)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        background: "#fefae0",
      }}
    />
  )
}
