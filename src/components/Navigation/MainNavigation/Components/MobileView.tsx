import React, { useState } from "react";
import { Anchor, Burger, Drawer } from "@mantine/core";
import { Navigation } from "../navigationInterfaces";
import Image from "next/image";
import SearchBar from "./SearchBar";
import NavLogo from "./NavLogo";

interface MobileViewProps {
  navigation: Navigation;
}

const MobileView: React.FC<MobileViewProps> = ({ navigation }) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <div className="lg:hidden">
        <Burger
          opened={opened}
          onClick={() => setOpened((isOpen) => !isOpen)}
          aria-label="Toggle navigation"
        />
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          title={<NavLogo navigation={navigation} />}
          padding="md"
          size="md"
          zIndex={1200}
        >
          <div className="my-8 mx-2">
            {navigation.items.map((link, i) => (
              <Anchor
                key={i}
                href={link.href}
                className="block my-4 whitespace-nowrap"
              >
                <Image
                  src={link.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="inline mr-2"
                />
                {link.name}
              </Anchor>
            ))}

            <SearchBar
              iconSrc={navigation.Search.icon}
              placeholderText={navigation.Search.placeholderText}
            />
          </div>
        </Drawer>
      </div>
      <div className="lg:hidden items-center">
        <NavLogo navigation={navigation} />
      </div>
    </>
  );
};

export default MobileView;
