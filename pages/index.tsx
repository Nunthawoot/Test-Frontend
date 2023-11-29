import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen items-center justify-center gap-x-6 ${inter.className}`}
    >
      <Link
        href="/test1"
        className=" px-4 py-3 rounded-lg bg-blue-700 text-6 text-white border border-blue-700"
      >
        <button>Test1</button>
      </Link>
      <Link
        href="/test2"
        className=" px-4 py-3 rounded-lg bg-blue-700 text-6 text-white border border-blue-700"
      >
        <button>Test2</button>
      </Link>
    </main>
  );
}
