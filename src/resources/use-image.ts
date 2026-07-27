import type { ReactiveElement } from '../reactive-element'
import type { Resource } from './resource'

type ImageResource = {
  src: string
  width?: number
  height?: number
}

export function useImage(el: ReactiveElement, src: string): Resource<ImageResource> {
  return el.resource(
    `image:${src}`,
    async signal => {
      if (signal.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      const img = new Image()
      const cleanup = () => {
        img.onload = null
        img.onerror = null
      }

      const result = await new Promise<ImageResource>((resolve, reject) => {
        const abortListener = () => {
          cleanup()
          img.src = ''
          reject(new DOMException('Aborted', 'AbortError'))
        }

        signal.addEventListener('abort', abortListener, {
          once: true,
        })

        img.onload = async () => {
          try {
            if (typeof img.decode === 'function') {
              await img.decode()
            }
            resolve({
              src,
              width: img.naturalWidth,
              height: img.naturalHeight,
            })
          } catch (error) {
            reject(error)
          } finally {
            signal.removeEventListener('abort', abortListener)
            cleanup()
          }
        }

        img.onerror = event => {
          signal.removeEventListener('abort', abortListener)
          cleanup()
          reject(event instanceof Error ? event : new Error('Image load failed'))
        }

        img.src = src
      })

      return result
    },
    { keepPrevious: true }
  )
}
