var createBuffer = require('gl-buffer')
var createVAO = require('gl-vao')
var colorToFloat = require('number-util').colorToFloat

var vertNumFloats = 5

function QuadBatch(gl, options) {
    if (!(this instanceof QuadBatch))
        return new QuadBatch(gl, options)
    if (!gl)
        throw new Error("must specify gl context")

    options = options||{}

    this._lastTexture = null
    this.premultiplied = false

    this.state = {
        rotation: 0,
        color: colorToFloat(0xFF, 0xFF, 0xFF, 0xFF)
    }

    var size = typeof options.size === 'number' ? options.size : 500

    // 65535 is max index, so 65535 / 6 = 10922.
    if (size > 10922)
        throw new Error("Can't have more than 10922 quads per batch: " + size)
    
    
    //the total number of floats in our batch
    var numVerts = size * 4 * vertNumFloats

    //the total number of indices in our batch
    var numIndices = size * 6

    this._total = size
    this._count = 0
    this.idx = 0
    this.dirty = false

    //vertex data
    this.vertices = new Float32Array(numVerts)
    //index data
    this.indices = new Uint16Array(numIndices)
    
    for (var i=0, j=0; i < numIndices; i += 6, j += 4) {
        this.indices[i + 0] = j + 0 
        this.indices[i + 1] = j + 1
        this.indices[i + 2] = j + 2
        this.indices[i + 3] = j + 0
        this.indices[i + 4] = j + 2
        this.indices[i + 5] = j + 3
    }

    this.vertexBuffer = createBuffer(gl, this.vertices, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW)
    this.indexBuffer = createBuffer(gl, this.indices, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW)

    var stride = 5 * 4
    this.vao = createVAO(gl, [
        { //position XY
            buffer: this.vertexBuffer,
            size: 2,
            stride: stride
        }, 
        { //texcoord UV
            buffer: this.vertexBuffer,
            size: 2,
            offset: 2 * 4,
            stride: stride
        },
        { //color (packed) C
            buffer: this.vertexBuffer,
            size: 4,
            stride: stride,
            offset: 4 * 4,
            type: gl.UNSIGNED_BYTE,
            normalized: true
        }
    ], this.indexBuffer)

}

Object.defineProperty(QuadBatch.prototype, "count", {
    get: function() {
        return this._count
    }
})
Object.defineProperty(QuadBatch.prototype, "total", {
    get: function() {
        return this._total
    }
})

//"Clears" the batch so that subsequent add() calls
//will override previous sprites starting from index 0
QuadBatch.prototype.clear = function() {
    this.dirty = true
    this.idx = 0
}

//Draws up to the current count of elements.
QuadBatch.prototype.add = function(texture, x, y, width, height, u1, v1, u2, v2) {
    if (this.idx === this.vertices.length)
        return this

    this.dirty = true

    width = typeof width === 'number' ? width : texture.shape[0]
    height = typeof height === 'number' ? height : texture.shape[1]
    x = x || 0;
    y = y || 0;

    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;


    u1 = u1 || 0;
    v1 = v1 || 0;
    u2 = typeof u2 === 'number' ? u2 : 1
    v2 = typeof v2 === 'number' ? v2 : 1

    var c = this.state.color,
        verts = this.vertices

    //xy
    verts[this.idx++] = x1;
    verts[this.idx++] = y1;
    //uv
    verts[this.idx++] = u1;
    verts[this.idx++] = v1;
    //color
    verts[this.idx++] = c;

    //xy
    verts[this.idx++] = x2;
    verts[this.idx++] = y1;
    //uv
    verts[this.idx++] = u2;
    verts[this.idx++] = v1;
    //color
    verts[this.idx++] = c;

    //xy
    verts[this.idx++] = x2;
    verts[this.idx++] = y2;
    //uv
    verts[this.idx++] = u2;
    verts[this.idx++] = v2;
    //color
    verts[this.idx++] = c;

    //xy
    verts[this.idx++] = x1;
    verts[this.idx++] = y2;
    //uv
    verts[this.idx++] = u1;
    verts[this.idx++] = v2;
    //color
    verts[this.idx++] = c;

    return this
}

QuadBatch.prototype.color = function(r, g, b, a) {
    var rnum = typeof r === "number";

    //if r,g,b is given, make sure to default our alpha to 1.0
    if (rnum
            && typeof g === "number"
            && typeof b === "number") {
        //default alpha to one 
        a = typeof a === "number" ? a : 1.0;
    } 
    //if not all three r,g,b are given, just assume grayscale or "reset to white"
    else {
        r = g = b = a = rnum ? r : 1.0;
    }
    
    if (this.premultiplied) {
        r *= a;
        g *= a;
        b *= a;
    }

    var packed = colorToFloat(
        ~~(r * 255),
        ~~(g * 255),
        ~~(b * 255),
        ~~(a * 255)
    );
    this.dirty = packed !== this.state.color

    this.state.color = packed
    return this
}

QuadBatch.prototype.bind = function() {
    this.vao.bind()
}

QuadBatch.prototype.update = function() {
    var view = this.vertices.subarray(0, this.idx);

    this.vertexBuffer.update(view, 0)
}

QuadBatch.prototype.draw = function() {
    if (this.dirty) {
        this.dirty = false
        this.update()
    }
    var sprites = (this.idx / (vertNumFloats * 4))
    if (sprites > 0)
        this.vao.draw(gl.TRIANGLES, sprites * 6, 0)
}

QuadBatch.prototype.unbind = function() {
    this.vao.unbind()
}

module.exports = QuadBatch