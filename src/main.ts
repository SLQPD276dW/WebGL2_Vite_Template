import vs from "./vs.vert?raw";
import fs from "./fs.frag?raw";

type Mouse = {
  x: number;
  y: number;
};

window.onload = () => {
  let mp: Mouse = { x: 0.5, y: 0.5 };

  const canvas = document.querySelector("canvas") as HTMLCanvasElement;

  canvas.onmousemove = (e: MouseEvent) => {
    mp.x = e.offsetX / canvas.width;
    mp.y = e.offsetY / canvas.height;
  };

  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  const program = gl.createProgram() as WebGLProgram;

  const vertex_shader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
  gl.shaderSource(vertex_shader, vs);
  gl.compileShader(vertex_shader);
  if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertex_shader));
  }

  const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
  gl.shaderSource(fragment_shader, fs);
  gl.compileShader(fragment_shader);
  if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragment_shader));
  }

  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  const time_location = gl.getUniformLocation(program, "time");
  const mouse_location = gl.getUniformLocation(program, "mouse");
  const resolution_location = gl.getUniformLocation(program, "resolution");
  const radius_location = gl.getUniformLocation(program, "radius");

  const position = [
    -1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
  ];
  const index = [0, 2, 1, 1, 2, 3];

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(index), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  const attLocation = gl.getAttribLocation(program, "position");
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.enableVertexAttribArray(attLocation);
  gl.vertexAttribPointer(attLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  const startTime = new Date().getTime();
  let time = 0.0;

  function render() {
    time = (new Date().getTime() - startTime) * 0.001;

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(time_location, time);
    gl.uniform2fv(mouse_location, [mp.x, mp.y]);
    gl.uniform2fv(resolution_location, [canvas.width, canvas.height]);
    gl.uniform1f(radius_location, 0.1);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();

    requestAnimationFrame(render);
  }
  render();
};
