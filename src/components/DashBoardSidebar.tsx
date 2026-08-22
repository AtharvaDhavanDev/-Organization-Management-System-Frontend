import {
    Bell,
    CheckSquare,
    Folder,
    Home,
    Users,
    PanelLeftClose,
    PanelLeftOpen,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

interface DashboardSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

function DashboardSidebar({
    isOpen,
    onToggle,
}: DashboardSidebarProps) {

    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: Home,
        },
        {
            name: "Projects",
            path: "/dashboard/projects",
            icon: Folder,
        },
        {
            name: "Tasks",
            path: "/dashboard/tasks",
            icon: CheckSquare,
        },
        {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: Bell,
        },
        {
            name: "Team",
            path: "/dashboard/team",
            icon: Users,
        },
    ];


    return (
        <>
            {/* =====================================================
                MOBILE BACKDROP
            ===================================================== */}

            {isOpen && (

                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onToggle}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/60
                        lg:hidden
                    "
                />

            )}


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside
                className={`
                    fixed
                    left-0
                    top-[68px]
                    z-50
                    flex
                    h-[calc(100vh-68px)]
                    flex-col
                    border-r
                    border-[#303a24]
                    bg-[#0c100c]
                    font-mono
                    transition-all
                    duration-300
                    ease-in-out
                    lg:relative
                    lg:top-0
                    lg:z-auto
                    ${
                        isOpen
                            ? "w-[254px] translate-x-0"
                            : "-translate-x-full lg:w-[72px] lg:translate-x-0"
                    }
                `}
            >

                {/* =================================================
                   SIDEBAR TOP / TOGGLE
                ================================================= */}

                <div
                    className={`
                        flex
                        h-[60px]
                        shrink-0
                        items-center
                        border-b
                        border-[#20281a]
                        ${
                            isOpen
                                ? "justify-between px-4"
                                : "justify-center px-0"
                        }
                    `}
                >

                    {/* MOBILE TITLE */}

                    <span
                        className="
                            text-[10px]
                            font-bold
                            tracking-[0.15em]
                            text-[#596544]
                            lg:hidden
                        "
                    >
                        NAVIGATION
                    </span>


                    <button
                        type="button"
                        onClick={onToggle}
                        title={
                            isOpen
                                ? "Collapse sidebar"
                                : "Expand sidebar"
                        }
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            border
                            border-[#39452b]
                            bg-[#101510]
                            text-[#718044]
                            transition
                            hover:border-[#71833f]
                            hover:bg-[#182012]
                            hover:text-[#b9d06d]
                        "
                    >

                        {/* MOBILE */}

                        <X
                            size={15}
                            strokeWidth={1.5}
                            className="lg:hidden"
                        />


                        {/* DESKTOP */}

                        {isOpen ? (
                            <PanelLeftClose
                                size={15}
                                strokeWidth={1.5}
                                className="hidden lg:block"
                            />
                        ) : (
                            <PanelLeftOpen
                                size={15}
                                strokeWidth={1.5}
                                className="hidden lg:block"
                            />
                        )}

                    </button>

                </div>


                {/* =================================================
                   NAVIGATION
                ================================================= */}

                <nav
                    className={`
                        flex
                        flex-col
                        gap-1
                        p-4
                        ${
                            isOpen
                                ? ""
                                : "items-center"
                        }
                    `}
                >

                    {navigation.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => {

                                    /*
                                     * Close the mobile drawer
                                     * after navigation.
                                     */

                                    if (
                                        window.innerWidth <
                                        1024
                                    ) {
                                        onToggle();
                                    }

                                }}
                                title={
                                    !isOpen
                                        ? item.name
                                        : undefined
                                }
                                className={({ isActive }) =>
                                    `
                                    group
                                    flex
                                    h-11
                                    items-center
                                    border
                                    text-[11px]
                                    font-bold
                                    tracking-[0.08em]
                                    transition-all
                                    duration-300
                                    ${
                                        isOpen
                                            ? "w-full gap-4 px-4"
                                            : "w-11 justify-center px-0"
                                    }
                                    ${
                                        isActive
                                            ? `
                                                border-[#71833f]
                                                bg-[#27321e]
                                                text-[#b9d06d]
                                            `
                                            : `
                                                border-transparent
                                                text-[#718044]
                                                hover:border-[#39452b]
                                                hover:bg-[#151b13]
                                                hover:text-[#a9be64]
                                            `
                                    }
                                    `
                                }
                            >

                                <Icon
                                    size={18}
                                    strokeWidth={1.5}
                                    className="shrink-0"
                                />


                                <span
                                    className={`
                                        overflow-hidden
                                        whitespace-nowrap
                                        transition-all
                                        duration-200
                                        ${
                                            isOpen
                                                ? "w-auto opacity-100"
                                                : "w-0 opacity-0"
                                        }
                                    `}
                                >
                                    {item.name.toUpperCase()}
                                </span>

                            </NavLink>
                        );

                    })}

                </nav>

            </aside>
        </>
    );
}

export default DashboardSidebar;