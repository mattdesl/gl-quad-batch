// vertex shader
attribute vec4 position;
attribute vec2 texcoord0;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
varying vec4 v_col;
varying vec2 v_tex0;

void main() {
   gl_Position = projection * position;
   v_col = color;
   v_tex0 = texcoord0;
   gl_PointSize = 1.0;
}