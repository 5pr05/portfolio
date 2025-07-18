import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import css from './index.module.scss'
import { projects } from './projects'

export const CodeProjectsPage = () => {
  const commandText = '$ git log'
  const [displayedCommand, setDisplayedCommand] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([])

  const projectRefs = useRef<(HTMLDivElement | null)[]>([])

  document.body.style.backgroundColor = 'black'

  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      if (idx < commandText.length) {
        setDisplayedCommand(commandText.slice(0, idx + 1))
        idx++
      } else {
        clearInterval(interval)
        setCursorVisible(false)
        setTimeout(() => {
          projects.forEach((_, i) => {
            setTimeout(() => {
              setVisibleIndexes((prev) => [...prev, i])
            }, i * 150)
          })
        }, 500)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={css.container}>
      <ul className={css.nav}>
        <li className={css.leftItem}>
          <Link className={css.link} to="/">
            [ home ]
          </Link>
        </li>
        <div className={css.rightGroup}>
          <li>
            <Link className={css.currentPage} to="/code">
              [ code ]
            </Link>
          </li>
          <li>
            <Link className={css.link} to="/art">
              [ art ]
            </Link>
          </li>
        </div>
      </ul>

      <h1 className={css.command}>
        {displayedCommand}
        {cursorVisible && <span className={css.cursor}>█</span>}
      </h1>

      {projects.map((project, i) => (
        <div
          className={`${css.projectCard} ${visibleIndexes.includes(i) ? css.visible : ''}`}
          key={project.name}
          ref={(el) => {
            projectRefs.current[i] = el
          }}
          style={{
            transitionDelay: `${i * 0.15}s`,
          }}
        >
          <img src={project.image} className={css.projectImage} alt={project.name} />
          <div className={css.projectInfo}>
            <div className={css.projectTexts}>
              <h2>
                <span>
                  <span className={css.currentPage}>name:</span> &nbsp;
                </span>
                {project.name}
              </h2>
              <h2>
                <span>
                  <span className={css.currentPage}>stack:</span>{' '}
                </span>
                {project.stack}
              </h2>
              <p>
                <span>
                  <span className={css.currentPage}>desc:</span> &nbsp;
                </span>
                {project.desc}
              </p>
            </div>
            <div className={css.projectLinks}>
              {!project.github_link ? (
                <span></span>
              ) : project.github_link === 'wip' ? (
                <span>[ WIP ]</span>
              ) : (
                <a className={css.link} href={project.github_link} target="_blank" rel="noopener noreferrer">
                  [ github ]
                </a>
              )}

              {project.user_link ? (
                <a className={css.link} href={project.user_link} target="_blank" rel="noopener noreferrer">
                  [ link ]
                </a>
              ) : (
                <span></span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
