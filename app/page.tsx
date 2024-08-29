import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Homepage</h1>
      <Button variant="outline" size={"lg"} className="capitalize m-8">
        click me
      </Button>
    </div>
  );
}
