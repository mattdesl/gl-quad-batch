# work in progress

-- 

# gl-quad-batch

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Fast rendering of 2D quads where vertex attributes are updated on the CPU. This is inspired by the efficient rendering techniques of LibGDX and Pixi, but combined with small modules.

## gory details

This uses indexed quads,

## roadmap

- modularize! Surely some stuff here can be broken out. 

## Usage

[![NPM](https://nodei.co/npm/gl-quad-batch.png)](https://nodei.co/npm/gl-quad-batch/)

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/gl-quad-batch/blob/master/LICENSE.md) for details.


batch.clear()

batch.color(1)
	 .rotation(2)
	 .transform(mtx)
	 .add(sprite, x, y)

batch.bind()
batch.draw()
batch.unbind()