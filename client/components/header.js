import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={label}>
          <Link legacyBehavior href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <Link legacyBehavior href={"/"}>
            <a className="navbar-brand">Ticketrr</a>
          </Link>

          <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">{links}</ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
