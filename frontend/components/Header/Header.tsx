import { Menu, Popover, Transition } from "@headlessui/react";

import { Fragment, Suspense } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import firebase from "../../firebase/firebase";
import { useRouter } from "next/router";
import Link from "next/link";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "/settings" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const auth = getAuth(firebase);

const HeaderButton = () => {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();
  console.log(user);
  if (user) {
    return (
      <>
        <Menu as="div" className="relative flex-shrink-0 ml-5">
          <div>
            <Menu.Button className="flex bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block py-2 px-4 text-sm text-gray-700"
                      )}
                    >
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={async () => {
                      await router.push("/");
                      await signOut(auth);
                    }}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block py-2 px-4 text-sm text-gray-700"
                    )}
                  >
                    Sign out
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </>
    );
  } else {
    return (
      <>
        <Link href={"/auth"}>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 ml-6 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Sign in
          </a>
        </Link>
      </>
    );
  }
};

const Header = () => {
  return (
    <Popover
      as="header"
      className={({ open }) =>
        classNames(
          open ? "fixed inset-0 z-40 overflow-y-auto" : "",
          "bg-white shadow-sm lg:static lg:overflow-y-visible"
        )
      }
    >
      {({ open }) => (
        <>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
              <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                <div className="flex items-center flex-shrink-0">
                  <a href="#">
                    <img
                      className="block w-auto h-8"
                      src="https://tailwindui.com/img/logos/workflow-mark.svg?color=rose&shade=500"
                      alt="Workflow"
                    />
                  </a>
                </div>
              </div>
              <div className="flex-1 min-w-0 md:px-8 lg:px-0 xl:col-span-6">
                <div className="flex items-center px-6 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                  <div className="flex h-full py-4 ml-6 space-x-8">
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                    <a
                      href="#"
                      className="inline-flex items-center px-1 py-4 pt-1 text-sm font-medium text-gray-900 border-b-2 border-rose-500 hover:border-rose-300 hover:text-gray-700"
                    >
                      Home
                    </a>

                    {/* <a
                      href="#"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700"
                    >
                      Calendar
                    </a> */}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end xl:col-span-4">
                <HeaderButton />
              </div>
            </div>
          </div>
        </>
      )}
    </Popover>
  );
};

export default Header;
