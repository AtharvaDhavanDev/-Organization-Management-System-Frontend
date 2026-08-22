import {
    Bell,
    CheckCircle2,
    MessageSquare,
    ClipboardList,
    FolderKanban,
    Building2,
    UserPlus,
} from "lucide-react";

import { useEffect } from "react";

import { useDashboardStore } from "../../stores/useDashStore";


const getNotificationIcon = (
    type: string
) => {

    const normalizedType =
        type.toLowerCase();

    if (
        normalizedType.includes("comment")
    ) {
        return MessageSquare;
    }

    if (
        normalizedType.includes("task")
    ) {
        return ClipboardList;
    }

    if (
        normalizedType.includes("project")
    ) {
        return FolderKanban;
    }

    if (
        normalizedType.includes("organization") ||
        normalizedType.includes("org")
    ) {
        return Building2;
    }

    if (
        normalizedType.includes("member") ||
        normalizedType.includes("user")
    ) {
        return UserPlus;
    }

    return Bell;
};


const formatNotificationType = (
    type: string
) => {

    return type
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .toUpperCase();
};


const formatDate = (
    value: string
) => {

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "UNKNOWN TIME";
    }

    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );
};


function Notifications() {

    const notifications =
        useDashboardStore(
            (state) => state.notifications
        );

    const isLoadingNotifications =
        useDashboardStore(
            (state) =>
                state.isLoadingNotifications
        );

    const fetchNotifications =
        useDashboardStore(
            (state) => state.fetchNotifications
        );


    useEffect(() => {

        fetchNotifications();

    }, [fetchNotifications]);


    return (
        <section
            className="
                min-h-[calc(100vh-68px)]
                overflow-x-hidden
                bg-[#0c100c]
                p-4
                font-mono
                sm:p-6
            "
        >

            {/* HEADER */}

            <div className="mb-6 sm:mb-8">

                <p
                    className="
                        text-[9px]
                        tracking-[0.2em]
                        text-[#596544]
                        sm:text-[10px]
                    "
                >
                    ACTIVITY
                </p>

                <h1
                    className="
                        mt-2
                        text-xl
                        font-bold
                        text-[#b9d06d]
                        sm:text-2xl
                    "
                >
                    NOTIFICATIONS
                </h1>

                <p
                    className="
                        mt-1
                        max-w-xl
                        text-[10px]
                        leading-5
                        text-[#667541]
                        sm:text-xs
                    "
                >
                    Task, project, organization and
                    comment activity
                </p>

            </div>


            {/* LOADING */}

            {isLoadingNotifications ? (

                <div
                    className="
                        flex
                        min-h-[240px]
                        items-center
                        justify-center
                        border
                        border-[#303a24]
                        bg-[#101510]
                        px-4
                        sm:min-h-[280px]
                    "
                >

                    <p
                        className="
                            text-[10px]
                            tracking-widest
                            text-[#718044]
                            sm:text-xs
                        "
                    >
                        LOADING ACTIVITY...
                    </p>

                </div>

            ) : notifications.length === 0 ? (

                /* EMPTY */

                <div
                    className="
                        flex
                        min-h-[240px]
                        flex-col
                        items-center
                        justify-center
                        border
                        border-[#303a24]
                        bg-[#101510]
                        px-4
                        text-center
                        sm:min-h-[280px]
                    "
                >

                    <CheckCircle2
                        size={34}
                        strokeWidth={1}
                        className="
                            mb-4
                            text-[#596544]
                        "
                    />

                    <p
                        className="
                            text-xs
                            text-[#718044]
                            sm:text-sm
                        "
                    >
                        NO ACTIVITY YET
                    </p>

                    <p
                        className="
                            mt-2
                            text-[10px]
                            text-[#596544]
                            sm:text-xs
                        "
                    >
                        You're all caught up.
                    </p>

                </div>

            ) : (

                /* ACTIVITY LIST */

                <div
                    className="
                        overflow-hidden
                        border
                        border-[#303a24]
                        bg-[#101510]
                    "
                >

                    {notifications.map(
                        (notification) => {

                            const Icon =
                                getNotificationIcon(
                                    notification.type
                                );

                            return (
                                <article
                                    key={
                                        notification.notification_id
                                    }
                                    className="
                                        flex
                                        gap-3
                                        border-b
                                        border-[#242d1c]
                                        p-4
                                        transition
                                        hover:bg-[#121a11]
                                        last:border-b-0
                                        sm:gap-4
                                        sm:p-5
                                    "
                                >

                                    {/* ICON */}

                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            border
                                            border-[#39452b]
                                            bg-[#0c100c]
                                            text-[#718044]
                                            sm:h-10
                                            sm:w-10
                                        "
                                    >

                                        <Icon
                                            size={16}
                                            strokeWidth={1.5}
                                            className="sm:hidden"
                                        />

                                        <Icon
                                            size={17}
                                            strokeWidth={1.5}
                                            className="hidden sm:block"
                                        />

                                    </div>


                                    {/* CONTENT */}

                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-1
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                                sm:gap-2
                                            "
                                        >

                                            <p
                                                className="
                                                    break-words
                                                    text-[8px]
                                                    font-bold
                                                    tracking-[0.15em]
                                                    text-[#718044]
                                                    sm:text-[9px]
                                                "
                                            >
                                                {
                                                    formatNotificationType(
                                                        notification.type
                                                    )
                                                }
                                            </p>

                                            <p
                                                className="
                                                    break-words
                                                    text-[8px]
                                                    text-[#596544]
                                                    sm:text-[9px]
                                                "
                                            >
                                                {
                                                    formatDate(
                                                        notification.created_at
                                                    )
                                                }
                                            </p>

                                        </div>


                                        <p
                                            className="
                                                mt-2
                                                break-words
                                                text-[11px]
                                                leading-5
                                                text-[#b9d06d]
                                                sm:text-xs
                                            "
                                        >
                                            {
                                                notification.message
                                            }
                                        </p>


                                        {notification.reference_id && (

                                            <p
                                                className="
                                                    mt-2
                                                    break-all
                                                    text-[8px]
                                                    leading-4
                                                    text-[#465034]
                                                    sm:text-[9px]
                                                "
                                            >
                                                REFERENCE:{" "}
                                                {
                                                    notification.reference_id
                                                }
                                            </p>

                                        )}

                                    </div>

                                </article>
                            );
                        }
                    )}

                </div>

            )}

        </section>
    );
}


export default Notifications;