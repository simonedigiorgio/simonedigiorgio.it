(function () {

class Pixel {

  constructor (x, y) {
    this.x = x
    this.y = y
  }

  clone () {
    return new Pixel(this.x, this.y)
  }

  copy (pixel) {
    this.x = pixel.x
    this.y = pixel.y
    return this
  }

  equal (pixel) {
    return this.x == pixel.x && this.y == pixel.y
  }

}

class Snake {

  static get UP () { return 1 }
  static get DOWN () { return 2 }
  static get LEFT () { return 3 }
  static get RIGHT () { return 4 }

  constructor (x=0, y=0, max_x, max_y, delay=250) {
    this.direction = Snake.UP
    this.parts = [
      (new Pixel(x, y)),
      (new Pixel(x, y-1))
    ]
    this.max_x = max_x
    this.max_y = max_y
    this.delay = delay
  }

  get head () {
    return this.parts[0]
  }

  get tail () {
    return this.parts[this.length - 1]
  }

  get length () {
    return this.parts.length
  }

  check (apple) {
    return this.head.equal(apple)
  }

  eat () {
    let part = this.tail.clone()
    this.parts.push(part)
    if (this.delay > 60) {
      this.delay -= 5
    }
  }

  shift (i) {
    if (i <= 0) {
      return
    }
    let current = this.parts[i]
    let prev = this.parts[i - 1]
    current.copy(prev)
  }

  move () {
    for (let i = this.length-1; i >= 1; i--) {
      this.shift(i)
    }
    let head = this.head
    let max_x = this.max_x
    let max_y = this.max_y
    switch (this.direction) {
      case Snake.LEFT:
        if (head.x == 0) {
          head.x = max_x - 1
        } else {
          head.x -= 1
        }
        break
      case Snake.UP:
        if (head.y == 0) {
          head.y = max_y - 1
        } else {
          head.y -= 1
        }
        break
      case Snake.RIGHT:
        if (head.x == max_x - 1) {
          head.x = 0
        } else {
          head.x += 1
        }
        break
      case Snake.DOWN:
        if (head.y == max_y - 1) {
          head.y = 0
        } else {
          head.y += 1
        }
        break
    }
  }

  set moving (direction) {
    if (direction !== Snake.UP && direction !== Snake.DOWN &&
        direction !== Snake.LEFT && direction !== Snake.RIGHT) {
      return
    }

    if ((direction == Snake.UP || direction == Snake.DOWN) &&
        (this.direction == Snake.UP || this.direction == Snake.DOWN)) {
      return
    }

    if ((direction == Snake.LEFT || direction == Snake.RIGHT) &&
        (this.direction == Snake.LEFT || this.direction == Snake.RIGHT)) {
      return
    }

    this.direction = direction
  }

}

class Game {

  constructor (canvas, width=200, height=200, size=10) {
    this.canvas = canvas
    this.canvas.width = width
    this.canvas.height = height
    this.width = canvas.width
    this.height = canvas.height
    this.size = size
    this.max_x = Math.round(this.width / this.size)
    this.max_y = Math.round(this.height / this.size)
    this.snake = new Snake(Math.round(this.max_x/2), Math.round(this.max_y/2), this.max_x, this.max_y, 150)
    this.apple = new Pixel(this.random_x(), this.random_y())
    this.context = canvas.getContext('2d')

    this.tick = this.tick.bind(this)

    let input = document.createElement('input')
    input.autofocus = true
    // input.style.display = 'none'
    input.style.border = 'none'
    input.style.outline = 'none'
    input.style.width = '1px'
    input.style.height = '1px'
    input.style.padding = '0'
    input.style.color = '#fff'

    this.onkeydown = this.onkeydown.bind(this)
    input.addEventListener('keydown', this.onkeydown, false)

    this.canvas.parentNode.insertBefore(input, this.canvas)
    input.focus()
    this.gaming = true

    this.input = input

    this.onclick = this.onclick.bind(this)
    this.canvas.addEventListener('click', this.onclick, false)
  }

  onclick (event) {
    this.input.focus()
    this.gaming = true
  }

  onkeydown (event) {
    let keycode = event.keyCode

    switch (keycode) {
      case 37:
        this.snake.moving = Snake.LEFT
        break
      case 38:
        this.snake.moving = Snake.UP
        break
      case 39:
        this.snake.moving = Snake.RIGHT
        break
      case 40:
        this.snake.moving = Snake.DOWN
        break
    }
  }

  random (min, max) {
    let value = (Math.floor(Math.random() * (max - min + 1)) + min)
    return value
  }

  random_x () {
    let min = 0
    let max = Math.round(this.max_x - 1)
    let value = this.random(0, max)
    return value
  }

  random_y () {
    let min = 0
    let max = Math.round(this.max_y - 1)
    let value = this.random(0, max)
    return value
  }

  check () {
    if (this.snake.check(this.apple)) {
      this.snake.eat()
      this.apple.x = this.random_x()
      this.apple.y = this.random_y()
    }
  }

  paint () {
    this.snake.move()

    this.check()

    let size = this.size

    let context = this.context

    context.clearRect(0, 0, this.width, this.height)

    context.fillStyle = 'darkgreen'
    this.snake.parts.forEach(function (part) {
      context.fillRect(part.x * size, part.y * size, size, size)
    })

    context.fillStyle = 'red'
    context.fillRect(this.apple.x * size, this.apple.y * size, size, size)
  }

  tick () {
    let now = Date.now()
    if (now - this.last_tick > this.snake.delay) {
      this.last_tick = now
      this.paint()
    }
    requestAnimationFrame(this.tick)
  }

  start () {
    this.last_tick = Date.now()
    this.tick()
  }
}

window['Game'] = Game

// let canvas = document.getElementById('canvas')
// let game = new Game(canvas)
// game.start()

})()
