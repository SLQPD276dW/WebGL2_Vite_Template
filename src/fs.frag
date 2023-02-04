#version 300 es

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float radius;

out vec4 outColor;

void main() {
  vec2 mouse = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
  vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float lapse = sin(time) + 1.0;
  vec2 color = (vec2(1.0, 1.0) + position.xy) * 0.5;
  float circle = mix(0.0, 1.0, step(length(mouse - position), radius));
  outColor = vec4(vec3(color, 1.0) * circle * lapse, 1.0);
}