import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-campus">
          Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600
        </span>
        <div className="footer-links">
          <a href="#normas" onClick={(e) => e.preventDefault()} className="footer-link">
            Normas del tablón
          </a>
          <a href="#ayuda" onClick={(e) => e.preventDefault()} className="footer-link">
            Mesa de ayuda
          </a>
          <a href="mailto:tablon@ulima.edu.pe" className="footer-link">
            tablon@ulima.edu.pe
          </a>
        </div>
      </div>
    </footer>
  );
}
