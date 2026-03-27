// src/components/Footer.js
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container">

        {/* Top Row */}
        <div className="row align-items-center mb-3">
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <h5 className="fw-bold mb-1">AlphaBurn 🔥</h5>
            <small className="text-secondary">Train hard. Burn bright. Stay alpha.</small>
          </div>

          <div className="col-md-4 text-center mb-3 mb-md-0">
            <div className="d-flex justify-content-center gap-3">
              {/* <Link to="/dashboard" className="text-white text-decoration-none small">Dashboard</Link>
              <Link to="/workout" className="text-white text-decoration-none small">Workouts</Link>
              <Link to="/metrics" className="text-white text-decoration-none small">Metrics</Link> */}

              
            </div>
          </div>

          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="https://github.com/snehaMishra27" className="text-white fs-5" title="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://www.instagram.com/" className="text-white fs-5" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://x.com/home" className="text-white fs-5" title="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-secondary" />

        {/* Bottom Row */}
        <div className="text-center">
          <small className="text-secondary">
            © {new Date().getFullYear()} AlphaBurn. Made with 💪 & ❤️ for fitness lovers.
          </small>
        </div>

      </div>
    </footer>
  );
}

export default Footer;