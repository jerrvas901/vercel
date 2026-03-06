import SiteNav from "@/components/site-nav";

export default function AboutPage() {
  return (
    <div className="page">
      <SiteNav current="about" />

      <header className="hero">
        <span className="pill">About Me</span>
        <h1>Building useful digital products with clean engineering.</h1>
        <p className="lead">
          I am Gervas Shukrani, a web developer focused on practical software
          that solves real user problems. I care about strong UX, efficient
          backend logic, and stable deployments.
        </p>
      </header>

      <section className="section twoCol">
        <article className="card">
          <h3>My Approach</h3>
          <p>
            I start by understanding business goals, then design clear user
            flows and implement them with maintainable code. I prioritize
            reliability, performance, and simplicity.
          </p>
        </article>
        <article className="card">
          <h3>What I Value</h3>
          <p>
            Honest communication, measurable results, and shipping software that
            works well in production environments like Vercel.
          </p>
        </article>
      </section>
    </div>
  );
}
