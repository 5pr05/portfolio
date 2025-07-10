import { useEffect } from 'react'
import css from './index.module.scss'
import { Link } from 'react-router-dom'

export const ArtProjectsPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'white'
  }, [])

  return (
    <div className={css.container}>
      <div className={css.titleBar}>
        <span className={css.title}>
          untitled.png -
          <Link to="/" className={css.link}>
            Home
          </Link>
        </span>
      </div>

      <div className={css.menuBar}>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Image</span>
        <span>Colors</span>
        <span>Help</span>
      </div>

      <div className={css.body}>
        <div className={css.canvasArea}>
          <img className={css.tbd} src="/img/tbd.png" alt="To be done" />
          <Link to="/code" className={css.codeLink}>
            <img src="/img/codeLink.png" alt="Code" />
          </Link>
          <img className={css.artLink} src="/img/artLink.png" alt="Art" />
        </div>
      </div>
    </div>
  )
}
