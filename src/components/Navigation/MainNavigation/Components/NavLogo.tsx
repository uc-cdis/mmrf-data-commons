import React from 'react';
import { Navigation } from '../navigationInterfaces';
import Image from 'next/image';
import Link from 'next/link'

interface NavLogoProps {
  navigation: Navigation;
}

const NavLogo: React.FC<NavLogoProps> = ({ navigation }) => (
 <Link href={navigation.logo.href}>
  <Image
    src={navigation.logo.src}
    alt={navigation.logo.alt}
    width={navigation.logo.width}
    height={navigation.logo.height}
  />
 </Link>
);

export default NavLogo;
