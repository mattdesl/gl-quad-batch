function get2(obj) {
    return [obj.position.x, obj.position.y]
}

function draw(ctx, opt) {
    var pos1 = opt.position
    var result = get2({
        position: pos1
    })
    var o2 = opt.size
    ctx.fillRect(result[0], result[1], o2[0], o2[1])
}

require('canvas-testbed')(function(ctx, width, height) {
    for (var i=0; i<1000; i++) {
        // No GC thrashing
        ctx.fillRect(Math.random()*width, Math.random()*height, Math.random()*10, Math.random()*10)

        // GC thrashing
        // draw(ctx, {
        //     position: { x: Math.random()*width, y: Math.random()*height },
        //     size: [ Math.random()*10, Math.random()*10 ]
        // })
    }
})