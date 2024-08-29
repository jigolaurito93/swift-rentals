import React from "react";
import { PiWarehouseBold } from "react-icons/pi";
import { Button } from "../ui/button";
import Link from "next/link";

const Logo = () => {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <PiWarehouseBold className="w-6 h-6" />
      </Link>
    </Button>
  );
};

export default Logo;
