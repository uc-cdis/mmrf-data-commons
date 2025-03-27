import React from 'react';
import { Navigation } from '../navigationInterfaces';
import Image from 'next/image';

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
