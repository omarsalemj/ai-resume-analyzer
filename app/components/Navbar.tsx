import { Link } from "react-router"

const Navbar = () => {
  return (
    <nav className="navbar">
        <Link to='/'>
            <p className="text-xl sm:text-2xl font-bold text-gradient">RESUMIND</p>
        </Link>
        <Link to='/upload' className="primary-button font-bold text-center w-fit">
            Upload
        </Link>
    </nav>
  )
}

export default Navbar