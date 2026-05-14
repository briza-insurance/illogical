import * as fs from 'fs'
import * as ttyModule from 'tty'

export type KeyEvent =
  | 'next'
  | 'prev'
  | 'first'
  | 'last'
  | 'quit'
  | 'exprDown'
  | 'exprUp'

export function setupKeyboard(onKey: (event: KeyEvent) => void): () => void {
  // Open /dev/tty directly so keyboard input works even when stdin is a pipe.
  const fd = fs.openSync('/dev/tty', 'r+')
  const tty = new ttyModule.ReadStream(fd)

  tty.setRawMode(true)
  tty.resume()
  tty.setEncoding('utf8')

  function onData(data: string) {
    switch (data) {
      case '\x1b[C': // right arrow
      case 'n':
        onKey('next')
        break
      case '\x1b[D': // left arrow
      case 'p':
        onKey('prev')
        break
      case '\x1b[H': // Home
      case 'g':
        onKey('first')
        break
      case '\x1b[F': // End
      case 'G':
        onKey('last')
        break
      case '\x1b[B': // down arrow
      case 'j':
        onKey('exprDown')
        break
      case '\x1b[A': // up arrow
      case 'k':
        onKey('exprUp')
        break
      case 'q':
      case '\x03': // Ctrl-C
        onKey('quit')
        break
    }
  }

  tty.on('data', onData)

  return () => {
    tty.removeListener('data', onData)
    tty.setRawMode(false)
    tty.pause()
    tty.destroy()
    fs.closeSync(fd)
  }
}
