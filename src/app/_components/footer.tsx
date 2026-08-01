export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Limitless Legacy</h3>
          <p>Inclusive learning support for children, families, and educators.</p>
        </div>
        <p>© {new Date().getFullYear()} Limitless Legacy. All rights reserved.</p>
      </div>
    </footer>
  );
}
