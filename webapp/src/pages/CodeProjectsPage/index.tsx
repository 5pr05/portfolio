import { useEffect } from "react";
import { Link } from "react-router-dom";
import css from "./index.module.scss";
import { projects } from "./projects";

export const CodeProjectsPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = "black";
    }, []);
    return (
        <div className={css.container}>
            <ul className={css.nav}>
                <li>
                    <Link className={css.link} to="/">[ home ]</Link>
                </li>
                <li>
                    <Link className={css.currentPage} to="/code">[ code ]</Link>
                </li>
                <li>
                    <Link className={css.link} to="/art">[ art ]</Link>
                </li>
            </ul>
            <div>
                <h1 className={ css.command }>$ git log█</h1>
            </div>
            {projects.map((project) => (
        <div key={project.name}>
          <img src={project.image} className={css.projectImage} alt={project.name} />
          <h2>name: {project.name}</h2>
          <h2>stack: {project.stack}</h2>
          <p>desc: {project.desc}</p>
          <a className={css.link} href={project.github_link}>GitHub</a>
          <a className={css.link} href={project.user_link}>Try</a>
        </div>
      ))}
        </div>
    );
}