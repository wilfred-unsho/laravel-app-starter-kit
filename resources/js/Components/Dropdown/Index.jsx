import { useState, createContext, useContext, Fragment } from 'react';
import { Transition } from '@headlessui/react';

const DropdownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropdownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropdownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { toggleOpen } = useContext(DropdownContext);

    return (
        <div onClick={toggleOpen}>
            {children}
        </div>
    );
};

const Content = ({ align = 'right', width = '48', contentClasses = 'py-1', children }) => {
    const { open, setOpen } = useContext(DropdownContext);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right ltr:left-0 rtl:right-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left ltr:right-0 rtl:left-0';
    }

    let widthClasses = '';
    if (width === '48') {
        widthClasses = 'w-48';
    }

    return (
        <>
            <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div className={`rounded-md ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 ${contentClasses}`}>
                        {children}
                    </div>
                </div>
            </Transition>

            {open && (
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
            )}
        </>
    );
};

const Link = ({ className = '', children, ...props }) => {
    return (
        <a
            {...props}
            className={
                'block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition duration-150 ease-in-out ' +
                className
            }
        >
            {children}
        </a>
    );
};

const Button = ({ className = '', children, ...props }) => {
    return (
        <button
            {...props}
            className={
                'block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition duration-150 ease-in-out ' +
                className
            }
        >
            {children}
        </button>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = Link;
Dropdown.Button = Button;

export { Dropdown };
