import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen px-3">
      <Link href="/dashboard">
        <Button className="cursor-pointer">Dashboard</Button>
      </Link>
    </div>
  );
}1
