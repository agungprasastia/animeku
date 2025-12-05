import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 bg-black text-white flex gap-6">
      <Link href="/">Home</Link>
      <Link href="/search">Search</Link>
    </nav>
  );
}
