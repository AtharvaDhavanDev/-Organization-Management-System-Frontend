import {
    FolderKanban,
    ListTodo,
    CheckCircle2,
    Users,
} from "lucide-react";

import { useDashboardStore } from "../../stores/useDashStore";


function DashboardOverview() {

    const dashboard = useDashboardStore(
        (state) => state.dashboard
    );

    const isLoadingDashboard = useDashboardStore(
        (state) => state.isLoadingDashboard
    );


    if (isLoadingDashboard || !dashboard) {

        return (
            <div
                className="
                    flex
                    min-h-[calc(100vh-68px)]
                    items-center
                    justify-center
                    px-4
                "
            >

                <p
                    className="
                        text-center
                        font-mono
                        text-xs
                        tracking-wider
                        text-[#718044]
                        sm:text-sm
                    "
                >
                    LOADING DASHBOARD...
                </p>

            </div>
        );
    }


    const stats = [
        {
            label: "PROJECTS",
            value: dashboard.totalProjects,
            icon: FolderKanban,
        },
        {
            label: "TASKS",
            value: dashboard.taskStatistics.total_tasks,
            icon: ListTodo,
        },
        {
            label: "COMPLETED",
            value: dashboard.taskStatistics.completed_tasks,
            icon: CheckCircle2,
        },
        {
            label: "MEMBERS",
            value: dashboard.totalMembers,
            icon: Users,
        },
    ];


    return (
        <section
            className="
                min-h-[calc(100vh-68px)]
                bg-[#0c100c]
                p-4
                font-mono
                sm:p-6
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 sm:mb-8">

                <p
                    className="
                        text-[9px]
                        tracking-[0.2em]
                        text-[#596544]
                        sm:text-[10px]
                    "
                >
                    ORGANIZATION
                </p>


                <h1
                    className="
                        mt-2
                        break-words
                        text-xl
                        font-bold
                        tracking-wide
                        text-[#b9d06d]
                        sm:text-2xl
                    "
                >
                    {dashboard.organization.name}
                </h1>


                <p
                    className="
                        mt-1
                        max-w-full
                        truncate
                        text-[10px]
                        text-[#667541]
                        sm:text-xs
                    "
                >
                    {dashboard.organization.slug}
                </p>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-2
                    sm:gap-4
                    xl:grid-cols-4
                "
            >

                {stats.map((stat) => {

                    const Icon = stat.icon;


                    return (
                        <div
                            key={stat.label}
                            className="
                                border
                                border-[#303a24]
                                bg-[#101510]
                                p-4
                                transition
                                hover:border-[#71833f]
                                sm:p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                "
                            >

                                <span
                                    className="
                                        text-[8px]
                                        tracking-[0.12em]
                                        text-[#718044]
                                        sm:text-[10px]
                                        sm:tracking-[0.15em]
                                    "
                                >
                                    {stat.label}
                                </span>


                                <Icon
                                    size={16}
                                    strokeWidth={1.5}
                                    className="
                                        shrink-0
                                        text-[#71833f]
                                        sm:h-[17px]
                                        sm:w-[17px]
                                    "
                                />

                            </div>


                            <p
                                className="
                                    mt-4
                                    text-2xl
                                    font-bold
                                    text-[#b9d06d]
                                    sm:mt-5
                                    sm:text-3xl
                                "
                            >
                                {stat.value}
                            </p>

                        </div>
                    );

                })}

            </div>


            {/* =================================================
                LOWER CARDS
            ================================================= */}

            <div
                className="
                    mt-4
                    grid
                    grid-cols-1
                    gap-4
                    sm:mt-6
                    lg:grid-cols-2
                "
            >

                {/* =================================================
                    TASK STATUS
                ================================================= */}

                <div
                    className="
                        border
                        border-[#303a24]
                        bg-[#101510]
                        p-4
                        sm:p-5
                    "
                >

                    <p
                        className="
                            text-[9px]
                            tracking-[0.15em]
                            text-[#718044]
                            sm:text-[10px]
                        "
                    >
                        TASK STATUS
                    </p>


                    <div className="mt-5 space-y-4 sm:mt-6">

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                text-xs
                            "
                        >

                            <span className="text-[#718044]">
                                TODO
                            </span>

                            <span
                                className="
                                    shrink-0
                                    text-[#b9d06d]
                                "
                            >
                                {
                                    dashboard
                                        .taskStatistics
                                        .todo_tasks
                                }
                            </span>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                text-xs
                            "
                        >

                            <span className="text-[#718044]">
                                IN PROGRESS
                            </span>

                            <span
                                className="
                                    shrink-0
                                    text-[#b9d06d]
                                "
                            >
                                {
                                    dashboard
                                        .taskStatistics
                                        .in_progress_tasks
                                }
                            </span>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                text-xs
                            "
                        >

                            <span className="text-[#718044]">
                                COMPLETED
                            </span>

                            <span
                                className="
                                    shrink-0
                                    text-[#b9d06d]
                                "
                            >
                                {
                                    dashboard
                                        .taskStatistics
                                        .completed_tasks
                                }
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ORGANIZATION
                ================================================= */}

                <div
                    className="
                        border
                        border-[#303a24]
                        bg-[#101510]
                        p-4
                        sm:p-5
                    "
                >

                    <p
                        className="
                            text-[9px]
                            tracking-[0.15em]
                            text-[#718044]
                            sm:text-[10px]
                        "
                    >
                        ORGANIZATION
                    </p>


                    <div
                        className="
                            mt-5
                            space-y-4
                            sm:mt-6
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-6
                                text-xs
                            "
                        >

                            <span
                                className="
                                    shrink-0
                                    text-[#718044]
                                "
                            >
                                SLUG
                            </span>


                            <span
                                className="
                                    min-w-0
                                    break-all
                                    text-right
                                    text-[#b9d06d]
                                "
                            >
                                {
                                    dashboard
                                        .organization
                                        .slug
                                }
                            </span>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-6
                                text-xs
                            "
                        >

                            <span className="text-[#718044]">
                                YOUR ROLE
                            </span>


                            <span
                                className="
                                    shrink-0
                                    text-[#b9d06d]
                                "
                            >
                                {
                                    dashboard
                                        .organization
                                        .role
                                }
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default DashboardOverview;