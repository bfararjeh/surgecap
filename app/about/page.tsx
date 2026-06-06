export default function About() {
  return (
    <main>
      <div className="subpage-title">
        About
      </div>
      <div className="about-content">
        <div className="subpage-yap">
          <p> 
            This is SurgeCap! Created as a proof of concept for what I will one day turn into a full fledged puzzle game, this is a puzzle game in which you charge a battery by connecting cells in a grid. Each cell is worth a certain amount of charge, with some special modifier cells affecting cells around it or your total charge.
            <br/><br/>
            Built over a few days as a personal project, I used this web-app to experiment and learn TypeScript in a practical context, get some familiarity with the whole web-app design and development process, and lastly bring life to an idea I was sitting on. This site is built almost exclusively in Next.js and TypeScript, with plain CSS for styling, and is hosted on Vercel.
            <br/><br/>
            The game has plenty of room to grow, while the current list of mechanics are small, the ideas were endless. Cells that retroactively affected other cells, cells that transported you to other cells, or simply cells you needed to pass through; the core idea is fun and understandable enough to allow much versatility.
            <br/><br/>
          </p>
        </div>
        <div className="tech-stack">
            <h2>Tech Stack</h2>
            <div className="tech-tags">
                <span className="tech-tag">Next.js</span>
                <span className="tech-tag">React</span>
                <span className="tech-tag">TypeScript</span>
                <span className="tech-tag">CSS</span>
                <span className="tech-tag">Vercel</span>
            </div>
        </div>
        <div className="links-section">
            <h2>Links</h2>
            <div className="links-row">
                <a href="https://github.com/bfararjeh/surgecap" target="_blank">GitHub</a>
                <a href="http://www.linkedin.com/in/bfararjeh" target="_blank">LinkedIn</a>
                <a href="https://bahaalfararjeh.dev/" target="_blank">Portfolio</a>
            </div>
        </div>
      </div>
    </main>
  )
}