"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

function Header() {
  const { user } = useAuth();
  const isAdmin = user && user.isAdmin;
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Events",
      description:
        "Discover and connect with local events happening around you.",
      items: [
        {
          title: "Browse Events",
          href: "/events#discover-amazing-events",
        },
        {
          title: "Create Event",
          href: "mailto:akshatsing11@gmail.com?subject=Create%20New%20Event&body=Hello%2C%20I'd%20like%20to%20create%20a%20new%20event!",
        },
        {
          title: "My Events",
          href: isAdmin ? "/my-events" : "#",
          disabled: !isAdmin,
        },
        {
          title: "Event Map",
          href: "/events",
        },
      ],
    },
    {
      title: "Community",
      description: "Join live chat rooms and connect with like-minded people.",
      items: [
        {
          title: "Chat Rooms",
          href: "/events",
        },
        {
          title: "About Us",
          href: "/#everything-you-need",
        },
        {
          title: "Help Center",
          href: "mailto:akshatsing11@gmail.com",
        },
        {
          title: "Contact",
          href: "mailto:akshatsing11@gmail.com",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-white backdrop-blur-sm border-b border-gray-100">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center px-4">
        <div className="justify-start items-center gap-6 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-6 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <>
                      <NavigationMenuLink asChild>
                        <Link href={item.href}>
                          <Button
                            variant="ghost"
                            className="text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-purple-100"
                          >
                            {item.title}
                          </Button>
                        </Link>
                      </NavigationMenuLink>
                    </>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-purple-100 data-[state=open]:bg-purple-100 data-[state=open]:text-[#7C3AED]">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-lg font-semibold text-gray-900">
                                {item.title}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              className="mt-10 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                            >
                              <Link href="/events">Get Started</Link>
                            </Button>
                          </div>
                          <div className="flex flex-col text-base h-full justify-end">
                            {item.items?.map((subItem) =>
                              subItem.disabled ? (
                                <span
                                  key={subItem.title}
                                  className="flex flex-row justify-between items-center py-2 px-4 rounded text-gray-400 cursor-not-allowed opacity-60"
                                >
                                  <span>{subItem.title}</span>
                                  <MoveRight className="w-4 h-4 text-gray-300" />
                                </span>
                              ) : (
                                <Link
                                  href={subItem.href}
                                  key={subItem.title}
                                  className="flex flex-row justify-between items-center hover:bg-purple-50 py-2 px-4 rounded text-gray-600 hover:text-[#7C3AED]"
                                >
                                  <span>{subItem.title}</span>
                                  <MoveRight className="w-4 h-4 text-[#7C3AED]" />
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex lg:justify-center">
          <Link
            href="/"
            className="font-semibold text-[#7C3AED] text-2xl font-heading"
          >
            Event Sphere
          </Link>
        </div>
        <div className="flex justify-end w-full gap-4">
          <Button
            variant="ghost"
            asChild
            className="hidden md:inline text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-purple-100"
          >
            <a href="mailto:akshatsing11@gmail.com?subject=Create%20New%20Event&body=Hello%2C%20I'd%20like%20to%20create%20a%20new%20event!">
              Create Event
            </a>
          </Button>
          <div className="border-r border-purple-200 hidden md:inline"></div>
          <Button
            asChild
            className="text-base font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
          >
            <Link href="/events">Get Started</Link>
          </Button>
        </div>
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button
            variant="ghost"
            onClick={() => setOpen(!isOpen)}
            className="hover:bg-purple-100"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-[#7C3AED]" />
            ) : (
              <Menu className="w-6 h-6 text-[#7C3AED]" />
            )}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t border-purple-100 flex flex-col w-full right-0 bg-purple-50 shadow-lg py-4 container gap-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex justify-between items-center text-gray-700 hover:text-[#7C3AED]"
                      >
                        <span className="text-lg font-medium">
                          {item.title}
                        </span>
                        <MoveRight className="w-5 h-5 stroke-1 text-[#7C3AED]" />
                      </Link>
                    ) : (
                      <p className="text-lg font-medium text-gray-900">
                        {item.title}
                      </p>
                    )}
                    {item.items &&
                      item.items.map((subItem) =>
                        subItem.disabled ? (
                          <span
                            key={subItem.title}
                            className="flex justify-between items-center text-gray-400 cursor-not-allowed opacity-60"
                          >
                            <span className="text-base font-medium">
                              {subItem.title}
                            </span>
                            <MoveRight className="w-5 h-5 stroke-1 text-gray-300" />
                          </span>
                        ) : (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="flex justify-between items-center text-gray-600 hover:text-[#7C3AED]"
                          >
                            <span className="text-base font-medium">
                              {subItem.title}
                            </span>
                            <MoveRight className="w-5 h-5 stroke-1 text-[#7C3AED]" />
                          </Link>
                        )
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header };
