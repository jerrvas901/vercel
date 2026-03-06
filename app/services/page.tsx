import SiteNav from "@/components/site-nav";

const services = [
  {
    title: "Portfolio Websites",
    detail:
      "Modern personal or business websites with responsive design and strong visual identity.",
  },
  {
    title: "Full-Stack MVPs",
    detail:
      "Fast product prototypes with authentication, database models, API routes, and deployment.",
  },
  {
    title: "Maintenance & Optimization",
    detail:
      "Bug fixes, performance tuning, SEO basics, and production support for existing projects.",
  },
];

export default function ServicesPage() {
  return (
    <div className="page">
      <SiteNav current="services" />

      <header className="hero">
        <span className="pill">Services</span>
        <h1>Services I provide for clients and teams.</h1>
        <p className="lead">
          End-to-end development from planning to deployment, with clear scopes
          and reliable execution.
        </p>
      </header>

      <section className="section">
        <div className="grid">
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
