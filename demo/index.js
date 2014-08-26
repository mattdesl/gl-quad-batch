var baboon = require('baboon-image')
var createTex = require('gl-texture2d')
var mat4 = require('gl-mat4')


// var createShader = require('gl-basic-shader')
var glslify = require('glslify')

var createShader = glslify({
    vertex: '../vert.glsl',
    fragment: '../frag.glsl'
})

require('canvas-testbed')(render, start, {
    context: 'webgl'
})


var ortho = mat4.create()
var batch, tex, shader, time=0


function render(gl, width, height, dt) {
    time+=dt
    var anim = Math.sin(time/1000)/2+0.5

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.viewport(0, 0, width, height)
    shader.bind()
    shader.uniforms.texture0 = 0

    //setup ortho projection
    mat4.ortho(ortho, 0, width, height, 0, 0, 1)
    shader.uniforms.projection = ortho

    //bind our texture atlas
    tex.bind()

    ///// update our sprites (position, UVs, color, etc)
    
    // Make sure to clear the batch before we add to it,
    // otherwise it will fill up very quickly!
    batch.clear()

    //we can animate vertex colors like so
    batch.color(1, 0, 0, anim)
         .add(tex, anim * 100, 0)
         .color(1) //reset color to full opaque
         .add(tex, (1-anim)*100, 100, 250, 250)

    batch.bind()
    batch.draw()
    batch.unbind()
}

function start(gl) {
    batch = require('../')(gl, {
        // size: 5
    })
    tex = createTex(gl, baboon)

    shader = createShader(gl)
    console.log(shader)
}