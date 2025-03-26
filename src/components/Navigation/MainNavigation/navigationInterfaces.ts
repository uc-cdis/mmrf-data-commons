export interface Navigation {
  logo: Logo;
  items: NavigationItem[];
  Search: Search;
}

interface Logo {
  src: string;
  width: number;
  height: number;
  href: string;
  alt: string;
}

interface NavigationItem {
  icon: string;
  href: string;
  name: string;
}

interface Search {
  icon: string;
}
