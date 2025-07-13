import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Users, Building2, GraduationCap, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollingUp = scrollTop < lastScrollY;
      
      if (scrollTop > 100 && !scrollingUp) {
        setIsScrolled(true);
      } else if (scrollingUp || scrollTop <= 100) {
        setIsScrolled(false);
      }
      
      setLastScrollY(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navigation = [
    { name: "Our Producers", href: "#producers" },
    { name: "Behind the Scenes", href: "#behind-scenes" },
    { name: "Press & Events", href: "#press" },
    { name: "Contact Us", href: "#contact" },
  ];

  const screeningTypes = [
    {
      name: "Conference",
      href: "/conference",
      icon: Users,
      description: "AIM Conference Highlight",
    },
    {
      name: "Hospital/Clinic",
      href: "/hospital",
      icon: Hospital,
      description: "Angela's Event Highlight",
    },
    {
      name: "Education",
      href: "/education",
      icon: GraduationCap,
      description: "SLU Trudy Busch School",
    },
    {
      name: "Corporate",
      href: "/corporate",
      icon: Building2,
      description: "Morgan Stanley Event",
    },
  ];

  return (
    <header className={`bg-teal-500 text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      <nav className={`container mx-auto px-6 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-2xl font-display font-bold">
              <div className="text-lg leading-tight">24</div>
              <div className="text-sm font-medium">DAYS</div>
              <div className="text-xs tracking-wider">WITHOUT</div>
              <div className="text-sm italic">YOU</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isScrolled && navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-teal-200 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}

            {/* Screening Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center space-x-1 bg-white text-teal-600 hover:bg-cream-100 hover:text-teal-700 transition-colors duration-200 border-0 shadow-md font-semibold"
                >
                  <span>Request a Screening</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white text-gray-700">
                {screeningTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <DropdownMenuItem key={type.name} asChild>
                      <Link
                        href={type.href}
                        className="flex items-center px-4 py-3 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                      >
                        <Icon className="h-5 w-5 mr-3 text-teal-500" />
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {type.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {!isScrolled && navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="py-2 hover:text-teal-200 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className={`${!isScrolled ? 'border-t border-teal-400 pt-2 mt-2' : ''}`}>
                <div className="bg-white text-teal-600 rounded-md p-2 mb-2 shadow-md">
                  <div className="text-sm font-semibold mb-2">Request a Screening:</div>
                  {screeningTypes.map((type) => (
                    <Link
                      key={type.name}
                      href={type.href}
                      className="block py-2 pl-2 hover:text-teal-700 hover:bg-cream-100 rounded transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {type.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
