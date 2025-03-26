import React from 'react';
import Image from 'next/image';
import { Navigation } from '../MainNavigation/navigationInterfaces';

interface NavLogoProps {
  navigation: Navigation;
}

const NavLogo: React.FC<NavLogoProps> = ({ navigation }) => (
  <Image
    src={navigation.logo.src}
    alt={navigation.logo.alt}
    width={navigation.logo.width}
    height={navigation.logo.height}
  />
);

export default NavLogo;
