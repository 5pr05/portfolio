import { useEffect, useRef, useState } from 'react'
import css from './index.module.scss'
import inside from 'point-in-polygon'
import { useScrollAnimation } from './useScrollAnimation'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  const [cursorColor, setCursorColor] = useState('#003CFF')
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [displayedText, setDisplayedText] = useState('')
  const screenRef = useRef<HTMLDivElement>(null)
  const { currentFrame, hasStarted, isLastFrame, isStaticFrame } = useScrollAnimation(30, isLoading)

  const colors = ['#FFFF00', '#00FF00', '#FF0000']
  const colorIndexRef = useRef(0)

  const isTouchingEdgeRef = useRef(false)
  const wasInsideColorRef = useRef(false)

  useEffect(() => {
    document.body.style.backgroundColor = 'black'

    const textToType = 'spros: 2799'
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < textToType.length) {
        setDisplayedText(textToType.slice(0, currentIndex + 1))
        currentIndex += 1
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    const frameImages = Array.from({ length: 30 }, (_, i) => `/img/frames/${String(i + 1).padStart(3, '0')}.webp`)
    const additionalImages = ['/img/sticker.png', '/img/stickerBack.png']
    const allImages = [...frameImages, ...additionalImages]

    let loadedCount = 0
    const totalImages = allImages.length

    const handleImageLoad = () => {
      loadedCount += 1
      if (loadedCount === totalImages) {
        setTimeout(() => setIsLoading(false), 3000)
      }
    }

    const handleImageError = () => {
      console.error('Error loading an image')
      loadedCount += 1
      if (loadedCount === totalImages) {
        setTimeout(() => setIsLoading(false), 3000)
      }
    }

    allImages.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = handleImageLoad
      img.onerror = handleImageError
    })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = screenRef.current?.getBoundingClientRect()
      if (!rect) return

      const normalize = (points: { x: number; y: number }[]): [number, number][] =>
        points.map((point) => [rect.left + (point.x / 100) * rect.width, rect.top + (point.y / 100) * rect.height])

      const clipPathForCursor = normalize([
        { x: 29, y: 21 },
        { x: 72, y: 21 },
        { x: 72, y: 85 },
        { x: 29, y: 85 },
      ])

      const clipPathForColor = normalize([
        { x: 51, y: 21 },
        { x: 68, y: 23 },
        { x: 68, y: 83 },
        { x: 33, y: 83 },
        { x: 33, y: 23 },
      ])

      const cursorPoint: [number, number] = [e.clientX, e.clientY]
      const isInsideCursor = inside(cursorPoint, clipPathForCursor)
      const isInsideColor = inside(cursorPoint, clipPathForColor)

      const getDistanceToPolygon = (point: [number, number], polygon: [number, number][]) => {
        let minDistance = Infinity
        for (let i = 0; i < polygon.length; i++) {
          const [x1, y1] = polygon[i]
          const [x2, y2] = polygon[(i + 1) % polygon.length]
          const A = point[0] - x1
          const B = point[1] - y1
          const C = x2 - x1
          const D = y2 - y1

          const dot = A * C + B * D
          const lenSq = C * C + D * D
          let param = -1
          if (lenSq !== 0) param = dot / lenSq

          let xx, yy
          if (param < 0) {
            xx = x1
            yy = y1
          } else if (param > 1) {
            xx = x2
            yy = y2
          } else {
            xx = x1 + param * C
            yy = y1 + param * D
          }

          const dx = point[0] - xx
          const dy = point[1] - yy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < minDistance) minDistance = dist
        }
        return minDistance
      }

      setVisible(isInsideCursor)

      if (isInsideCursor) {
        setCursorPos({ x: e.clientX, y: e.clientY })
      }

      if (isInsideColor) {
        const distanceToEdge = getDistanceToPolygon(cursorPoint, clipPathForColor)
        const isTouchingEdge = distanceToEdge < 8

        if (isTouchingEdge && !isTouchingEdgeRef.current && wasInsideColorRef.current) {
          colorIndexRef.current = (colorIndexRef.current + 1) % colors.length
          setCursorColor(colors[colorIndexRef.current])
        }

        isTouchingEdgeRef.current = isTouchingEdge
        wasInsideColorRef.current = true
      } else {
        isTouchingEdgeRef.current = false
        wasInsideColorRef.current = false
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(typingInterval)
    }
  }, [])

  return (
    <div className={css.wrapper}>
      {isLoading ? (
        <div className={css.preloader}>
          <span className={css.preloaderText}>{displayedText}</span>
          <span className={css.blinkingCursor}>█</span>
        </div>
      ) : (
        <div className={css.imageWrapper}>
          <img src={`/img/frames/${String(currentFrame).padStart(3, '0')}.webp`} className={css.image} alt="Home" />
          <div className={css.screenArea} ref={screenRef}>
            <div className={css.glitch}></div>
          </div>

          {visible && (
            <div
              className={css.customCursor}
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                width: '10vw',
                height: 'auto',
              }}
            >
              <svg
                viewBox="0 0 595 180"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                width="100%"
                height="100%"
              >
                <ellipse cx="297.589" cy="90.2143" rx="297.074" ry="89.7857" fill={cursorColor} />
                <path
                  d="M216.543 84.578L209.316 86.6234C208.861 85.4189 208.191 84.2484 207.305 83.1121C206.441 81.953 205.259 80.9984 203.759 80.2484C202.259 79.4984 200.339 79.1234 197.998 79.1234C194.793 79.1234 192.123 79.8621 189.986 81.3394C187.873 82.7939 186.816 84.6462 186.816 86.8962C186.816 88.8962 187.543 90.4757 188.998 91.6348C190.452 92.7939 192.725 93.7598 195.816 94.5325L203.589 96.4416C208.27 97.578 211.759 99.3166 214.055 101.658C216.35 103.976 217.498 106.964 217.498 110.623C217.498 113.623 216.634 116.305 214.907 118.669C213.202 121.033 210.816 122.896 207.748 124.26C204.680 125.623 201.111 126.305 197.043 126.305C191.702 126.305 187.282 125.146 183.782 122.828C180.282 120.51 178.066 117.123 177.134 112.669L184.77 110.76C185.498 113.578 186.873 115.692 188.895 117.101C190.941 118.51 193.611 119.214 196.907 119.214C200.657 119.214 203.634 118.419 205.839 116.828C208.066 115.214 209.18 113.283 209.18 111.033C209.18 109.214 208.543 107.692 207.27 106.464C205.998 105.214 204.043 104.283 201.407 103.669L192.68 101.623C187.884 100.487 184.361 98.7257 182.111 96.3394C179.884 93.9303 178.77 90.9189 178.77 87.3053C178.77 84.3507 179.6 81.7371 181.259 79.4644C182.941 77.1916 185.225 75.4075 188.111 74.1121C191.02 72.8166 194.316 72.1689 197.998 72.1689C203.18 72.1689 207.248 73.3053 210.202 75.578C213.18 77.8507 215.293 80.8507 216.543 84.578ZM229.609 144.851V72.8507H237.381V81.1689H238.336C238.927 80.2598 239.745 79.1007 240.79 77.6916C241.859 76.2598 243.381 74.9871 245.359 73.8734C247.359 72.7371 250.063 72.1689 253.472 72.1689C257.881 72.1689 261.768 73.2712 265.131 75.4757C268.495 77.6803 271.12 80.8053 273.006 84.8507C274.893 88.8962 275.836 93.6689 275.836 99.1689C275.836 104.714 274.893 109.521 273.006 113.589C271.12 117.635 268.506 120.771 265.165 122.998C261.824 125.203 257.972 126.305 253.609 126.305C250.245 126.305 247.552 125.748 245.529 124.635C243.506 123.498 241.949 122.214 240.859 120.783C239.768 119.328 238.927 118.123 238.336 117.169H237.654V144.851H229.609ZM237.518 99.0325C237.518 102.987 238.097 106.476 239.256 109.498C240.415 112.498 242.109 114.851 244.336 116.555C246.563 118.237 249.29 119.078 252.518 119.078C255.881 119.078 258.688 118.192 260.938 116.419C263.211 114.623 264.915 112.214 266.052 109.192C267.211 106.146 267.79 102.76 267.79 99.0325C267.79 95.3507 267.222 92.0325 266.086 89.078C264.972 86.1007 263.279 83.7484 261.006 82.0212C258.756 80.2712 255.927 79.3962 252.518 79.3962C249.245 79.3962 246.495 80.2257 244.268 81.8848C242.04 83.5212 240.359 85.8166 239.222 88.7712C238.086 91.703 237.518 95.1234 237.518 99.0325ZM288.109 125.214V72.8507H295.881V80.7598H296.427C297.381 78.1689 299.109 76.0666 301.609 74.453C304.109 72.8394 306.927 72.0325 310.063 72.0325C310.654 72.0325 311.393 72.0439 312.279 72.0666C313.165 72.0894 313.836 72.1234 314.29 72.1689V80.3507C314.018 80.2825 313.393 80.1803 312.415 80.0439C311.461 79.8848 310.449 79.8053 309.381 79.8053C306.836 79.8053 304.563 80.3394 302.563 81.4075C300.586 82.453 299.018 83.9075 297.859 85.7712C296.722 87.6121 296.154 89.7144 296.154 92.078V125.214H288.109ZM343.506 126.305C338.779 126.305 334.631 125.18 331.063 122.93C327.518 120.68 324.745 117.533 322.745 113.487C320.768 109.442 319.779 104.714 319.779 99.3053C319.779 93.8507 320.768 89.0894 322.745 85.0212C324.745 80.953 327.518 77.7939 331.063 75.5439C334.631 73.2939 338.779 72.1689 343.506 72.1689C348.234 72.1689 352.37 73.2939 355.915 75.5439C359.484 77.7939 362.256 80.953 364.234 85.0212C366.234 89.0894 367.234 93.8507 367.234 99.3053C367.234 104.714 366.234 109.442 364.234 113.487C362.256 117.533 359.484 120.68 355.915 122.93C352.37 125.18 348.234 126.305 343.506 126.305ZM343.506 119.078C347.097 119.078 350.052 118.158 352.37 116.317C354.688 114.476 356.404 112.055 357.518 109.055C358.631 106.055 359.188 102.805 359.188 99.3053C359.188 95.8053 358.631 92.5439 357.518 89.5212C356.404 86.4984 354.688 84.0553 352.37 82.1916C350.052 80.328 347.097 79.3962 343.506 79.3962C339.915 79.3962 336.961 80.328 334.643 82.1916C332.324 84.0553 330.609 86.4984 329.495 89.5212C328.381 92.5439 327.824 95.8053 327.824 99.3053C327.824 102.805 328.381 106.055 329.495 109.055C330.609 112.055 332.324 114.476 334.643 116.317C336.961 118.158 339.915 119.078 343.506 119.078ZM416.606 84.578L409.378 86.6234C408.924 85.4189 408.253 84.2484 407.367 83.1121C406.503 81.953 405.322 80.9984 403.822 80.2484C402.322 79.4984 400.401 79.1234 398.06 79.1234C394.856 79.1234 392.185 79.8621 390.049 81.3394C387.935 82.7939 386.878 84.6462 386.878 86.8962C386.878 88.8962 387.606 90.4757 389.06 91.6348C390.515 92.7939 392.787 93.7598 395.878 94.5325L403.651 96.4416C408.333 97.578 411.822 99.3166 414.117 101.658C416.412 103.976 417.56 106.964 417.56 110.623C417.56 113.623 416.697 116.305 414.969 118.669C413.265 121.033 410.878 122.896 407.81 124.26C404.742 125.623 401.174 126.305 397.106 126.305C391.765 126.305 387.344 125.146 383.844 122.828C380.344 120.51 378.128 117.123 377.197 112.669L384.833 110.76C385.56 113.578 386.935 115.692 388.958 117.101C391.003 118.51 393.674 119.214 396.969 119.214C400.719 119.214 403.697 118.419 405.901 116.828C408.128 115.214 409.242 113.283 409.242 111.033C409.242 109.214 408.606 107.692 407.333 106.464C406.06 105.214 404.106 104.283 401.469 103.669L392.742 101.623C387.947 100.487 384.424 98.7257 382.174 96.3394C379.947 93.9303 378.833 90.9189 378.833 87.3053C378.833 84.3507 379.662 81.7371 381.322 79.4644C383.003 77.1916 385.287 75.4075 388.174 74.1121C391.083 72.8166 394.378 72.1689 398.06 72.1689C403.242 72.1689 407.31 73.3053 410.265 75.578C413.242 77.8507 415.356 80.8507 416.606 84.578Z"
                  fill="white"
                />
              </svg>
            </div>
          )}

          {(!hasStarted || isStaticFrame) && (
            <>
              <ul className={css.nav}>
                <li>
                  <Link className={css.navItem} to="/code">
                    CODE
                  </Link>
                </li>
                <li>
                  <Link className={css.navItem} to="/art">
                    ART
                  </Link>
                </li>
              </ul>
              <div className={css.swipeTooltip}>
                <p>Scroll</p>
              </div>
            </>
          )}

          {isLastFrame && (
            <>
              <div className={css.stickerWrapper}>
                <div className={css.stickerClip}>
                  <img className={css.sticker} src="/img/sticker.png" alt="sticker" />
                  <img className={css.stickerBack} src="/img/stickerBack.png" alt="sticker" />
                </div>
              </div>
              <div className={css.links}>
                <a
                  href="https://t.me/isfndr"
                  className={css.linkTelegram}
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                <a
                  href="https://www.linkedin.com/in/isfndr"
                  className={css.linkLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                <a
                  href="mailto:isfndr.png@gmail.com"
                  className={css.linkGmail}
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                <a
                  href="https://www.behance.net/isfandiyar"
                  className={css.linkBehance}
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                <a
                  href="https://www.instagram.com/5pr05"
                  className={css.linkInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
