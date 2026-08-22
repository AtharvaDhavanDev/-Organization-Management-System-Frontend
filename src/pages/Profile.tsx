import {
    UserRound,
    Mail,
    Fingerprint,
    ShieldCheck,
    LogOut,
    Trash2,
    X,
    AlertTriangle,
} from "lucide-react";

import { useState } from "react";

import { useAuthStore } from "../stores/useAuthStore";
import { useDashboardStore } from "../stores/useDashStore";
import { axiosInstance } from "../lib/axios";


function Profile() {

    const authUser = useAuthStore(
        (state) => state.authUser
    );

    const logOut = useAuthStore(
        (state) => state.logOut
    );


    const selectedOrganization =
        useDashboardStore(
            (state) => state.selectedOrganization
        );

    const fetchOrganizations =
        useDashboardStore(
            (state) => state.fetchOrganizations
        );

    const isAdmin =
        useDashboardStore(
            (state) => state.isAdmin
        );


    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    const [deleteConfirmation, setDeleteConfirmation] =
        useState("");

    const [isDeletingOrganization, setIsDeletingOrganization] =
        useState(false);

    const [deleteError, setDeleteError] =
        useState("");


    const openDeleteModal = () => {

        setDeleteConfirmation("");

        setDeleteError("");

        setIsDeleteModalOpen(true);
    };


    const closeDeleteModal = () => {

        if (isDeletingOrganization) {
            return;
        }

        setIsDeleteModalOpen(false);

        setDeleteConfirmation("");

        setDeleteError("");
    };


    const handleDeleteOrganization = async () => {

        if (!selectedOrganization?.org_id) {
            return;
        }


        if (
            deleteConfirmation !==
            selectedOrganization.name
        ) {

            setDeleteError(
                "Organization name does not match."
            );

            return;
        }


        setIsDeletingOrganization(true);

        setDeleteError("");


        try {

            await axiosInstance.delete(
                `/organizations/${selectedOrganization.org_id}`
            );


            await fetchOrganizations();


            setIsDeleteModalOpen(false);

            setDeleteConfirmation("");


        } catch (error: any) {

            console.error(
                "deleteOrganization failed:",
                error
            );


            setDeleteError(
                error?.response?.data?.message ||
                "Failed to delete organization."
            );


        } finally {

            setIsDeletingOrganization(false);

        }
    };


    if (!authUser) {
        return null;
    }


    return (
        <main
            className="
                min-h-screen
                bg-[#0c100c]
                p-4
                font-mono
                text-[#b9d06d]
                sm:p-6
            "
        >

            <div className="mx-auto max-w-4xl">

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
                        ACCOUNT
                    </p>


                    <h1
                        className="
                            mt-2
                            text-xl
                            font-bold
                            tracking-wide
                            text-[#b9d06d]
                            sm:text-2xl
                        "
                    >
                        PROFILE
                    </h1>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-[#667541]
                            sm:text-xs
                        "
                    >
                        Manage your account information
                    </p>

                </div>


                {/* PROFILE CARD */}

                <div
                    className="
                        border
                        border-[#303a24]
                        bg-[#101510]
                    "
                >

                    {/* PROFILE INTRO */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            border-b
                            border-[#303a24]
                            p-4
                            sm:gap-5
                            sm:p-6
                            md:flex-row
                            md:items-center
                        "
                    >

                        <div
                            className="
                                flex
                                h-16
                                w-16
                                shrink-0
                                items-center
                                justify-center
                                border
                                border-[#71833f]
                                bg-[#182012]
                                text-[#b9d06d]
                                sm:h-20
                                sm:w-20
                            "
                        >

                            <UserRound
                                size={28}
                                strokeWidth={1.2}
                                className="sm:hidden"
                            />

                            <UserRound
                                size={34}
                                strokeWidth={1.2}
                                className="hidden sm:block"
                            />

                        </div>


                        <div className="min-w-0">

                            <p
                                className="
                                    text-[9px]
                                    tracking-[0.2em]
                                    text-[#596544]
                                "
                            >
                                KAIRO USER
                            </p>


                            <h2
                                className="
                                    mt-2
                                    break-words
                                    text-lg
                                    font-bold
                                    text-[#b9d06d]
                                    sm:text-xl
                                "
                            >
                                {authUser.name}
                            </h2>


                            <p
                                className="
                                    mt-1
                                    break-all
                                    text-[10px]
                                    text-[#718044]
                                    sm:text-xs
                                "
                            >
                                {authUser.email}
                            </p>

                        </div>

                    </div>


                    {/* ACCOUNT INFORMATION */}

                    <div className="p-4 sm:p-6">

                        <div className="mb-4 sm:mb-5">

                            <p
                                className="
                                    text-[9px]
                                    tracking-[0.2em]
                                    text-[#596544]
                                "
                            >
                                ACCOUNT INFORMATION
                            </p>

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                sm:gap-4
                                md:grid-cols-2
                            "
                        >

                            {/* NAME */}

                            <div
                                className="
                                    border
                                    border-[#242d1c]
                                    bg-[#0c100c]
                                    p-3
                                    sm:p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[#596544]
                                    "
                                >

                                    <UserRound
                                        size={14}
                                        strokeWidth={1.5}
                                    />

                                    <span
                                        className="
                                            text-[9px]
                                            tracking-[0.15em]
                                        "
                                    >
                                        NAME
                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-3
                                        break-words
                                        text-sm
                                        font-bold
                                        text-[#b9d06d]
                                    "
                                >
                                    {authUser.name}
                                </p>

                            </div>


                            {/* EMAIL */}

                            <div
                                className="
                                    border
                                    border-[#242d1c]
                                    bg-[#0c100c]
                                    p-3
                                    sm:p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[#596544]
                                    "
                                >

                                    <Mail
                                        size={14}
                                        strokeWidth={1.5}
                                    />

                                    <span
                                        className="
                                            text-[9px]
                                            tracking-[0.15em]
                                        "
                                    >
                                        EMAIL
                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-3
                                        break-all
                                        text-sm
                                        font-bold
                                        text-[#b9d06d]
                                    "
                                >
                                    {authUser.email}
                                </p>

                            </div>


                            {/* USER ID */}

                            <div
                                className="
                                    border
                                    border-[#242d1c]
                                    bg-[#0c100c]
                                    p-3
                                    sm:p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[#596544]
                                    "
                                >

                                    <Fingerprint
                                        size={14}
                                        strokeWidth={1.5}
                                    />

                                    <span
                                        className="
                                            text-[9px]
                                            tracking-[0.15em]
                                        "
                                    >
                                        USER ID
                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-3
                                        break-all
                                        text-[10px]
                                        leading-5
                                        text-[#718044]
                                        sm:text-xs
                                    "
                                >
                                    {authUser.userId}
                                </p>

                            </div>


                            {/* ACCOUNT TYPE */}

                            <div
                                className="
                                    border
                                    border-[#242d1c]
                                    bg-[#0c100c]
                                    p-3
                                    sm:p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[#596544]
                                    "
                                >

                                    <ShieldCheck
                                        size={14}
                                        strokeWidth={1.5}
                                    />

                                    <span
                                        className="
                                            text-[9px]
                                            tracking-[0.15em]
                                        "
                                    >
                                        ACCOUNT
                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        font-bold
                                        text-[#b9d06d]
                                    "
                                >
                                    ACTIVE
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* SESSION */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            border-t
                            border-[#303a24]
                            p-4
                            sm:p-6
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div className="min-w-0">

                            <p
                                className="
                                    text-[9px]
                                    tracking-[0.2em]
                                    text-[#596544]
                                "
                            >
                                SESSION
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-[10px]
                                    leading-5
                                    text-[#718044]
                                    sm:text-xs
                                "
                            >
                                Sign out from your current session.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={logOut}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                border
                                border-[#39452b]
                                bg-[#101510]
                                px-5
                                py-3
                                text-xs
                                font-bold
                                tracking-wider
                                text-[#718044]
                                transition
                                hover:border-[#71833f]
                                hover:bg-[#182012]
                                hover:text-[#b9d06d]
                                sm:w-auto
                                sm:py-2.5
                            "
                        >

                            <LogOut
                                size={15}
                                strokeWidth={1.5}
                            />

                            LOG OUT

                        </button>

                    </div>


                    {/* DANGER ZONE */}

                    {isAdmin() &&
                        selectedOrganization && (

                            <div
                                className="
                                    border-t
                                    border-[#4a2b2b]
                                    bg-[#120d0d]
                                    p-4
                                    sm:p-6
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            mt-0.5
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            border
                                            border-[#5a3030]
                                            bg-[#1a1010]
                                            text-[#c86b6b]
                                        "
                                    >

                                        <AlertTriangle
                                            size={15}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p
                                            className="
                                                text-[9px]
                                                font-bold
                                                tracking-[0.2em]
                                                text-[#c86b6b]
                                            "
                                        >
                                            DANGER ZONE
                                        </p>


                                        <h3
                                            className="
                                                mt-2
                                                text-sm
                                                font-bold
                                                text-[#d98a8a]
                                            "
                                        >
                                            DELETE ORGANIZATION
                                        </h3>


                                        <p
                                            className="
                                                mt-2
                                                max-w-2xl
                                                text-[10px]
                                                leading-5
                                                text-[#8c6262]
                                                sm:text-xs
                                            "
                                        >
                                            Permanently delete{" "}
                                            <span className="font-bold text-[#c88989]">
                                                {selectedOrganization.name}
                                            </span>{" "}
                                            and all of its projects,
                                            tasks, comments, members,
                                            invitations, and related data.
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-5">

                                    <button
                                        type="button"
                                        onClick={openDeleteModal}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            border
                                            border-[#6a3535]
                                            bg-[#180f0f]
                                            px-5
                                            py-3
                                            text-xs
                                            font-bold
                                            tracking-wider
                                            text-[#c86b6b]
                                            transition
                                            hover:border-[#a24d4d]
                                            hover:bg-[#241313]
                                            hover:text-[#df8b8b]
                                            sm:w-auto
                                            sm:justify-start
                                            sm:py-2.5
                                        "
                                    >

                                        <Trash2
                                            size={15}
                                        />

                                        DELETE ORGANIZATION

                                    </button>

                                </div>

                            </div>

                        )}

                </div>

            </div>


            {/* DELETE CONFIRMATION MODAL */}

            {isDeleteModalOpen &&
                selectedOrganization && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-[300]
                            flex
                            items-center
                            justify-center
                            overflow-y-auto
                            bg-black/75
                            p-3
                            sm:p-4
                        "
                        onMouseDown={(event) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeDeleteModal();
                            }

                        }}
                    >

                        <div
                            className="
                                my-auto
                                max-h-[94vh]
                                w-full
                                max-w-lg
                                overflow-y-auto
                                border
                                border-[#5a3030]
                                bg-[#100d0d]
                                shadow-2xl
                                sm:max-h-[90vh]
                            "
                        >

                            {/* MODAL HEADER */}

                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-3
                                    border-b
                                    border-[#3d2525]
                                    p-4
                                    sm:p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            border
                                            border-[#6a3535]
                                            bg-[#1a1010]
                                            text-[#c86b6b]
                                        "
                                    >

                                        <Trash2
                                            size={17}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p
                                            className="
                                                text-[9px]
                                                tracking-[0.2em]
                                                text-[#8c6262]
                                            "
                                        >
                                            PERMANENT ACTION
                                        </p>


                                        <h2
                                            className="
                                                mt-1
                                                text-base
                                                font-bold
                                                text-[#d98a8a]
                                                sm:text-lg
                                            "
                                        >
                                            DELETE ORGANIZATION
                                        </h2>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    disabled={
                                        isDeletingOrganization
                                    }
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        text-[#8c6262]
                                        transition
                                        hover:text-[#d98a8a]
                                        disabled:opacity-40
                                    "
                                >

                                    <X size={17} />

                                </button>

                            </div>


                            {/* MODAL BODY */}

                            <div className="p-4 sm:p-5">

                                <div
                                    className="
                                        border
                                        border-[#3d2525]
                                        bg-[#160f0f]
                                        p-3
                                        sm:p-4
                                    "
                                >

                                    <p
                                        className="
                                            text-[10px]
                                            leading-5
                                            text-[#9b6a6a]
                                            sm:text-xs
                                        "
                                    >
                                        This action cannot be undone.
                                        The organization and all related
                                        projects, tasks, comments, members,
                                        and invitations will be permanently
                                        deleted.
                                    </p>

                                </div>


                                <div className="mt-5">

                                    <label
                                        className="
                                            text-[9px]
                                            font-bold
                                            tracking-widest
                                            text-[#9b6a6a]
                                            sm:text-[10px]
                                        "
                                    >
                                        TYPE ORGANIZATION NAME TO CONFIRM
                                    </label>


                                    <p
                                        className="
                                            mt-2
                                            break-all
                                            text-xs
                                            font-bold
                                            text-[#d98a8a]
                                        "
                                    >
                                        {selectedOrganization.name}
                                    </p>


                                    <input
                                        type="text"
                                        value={
                                            deleteConfirmation
                                        }
                                        onChange={(event) => {

                                            setDeleteConfirmation(
                                                event.target.value
                                            );

                                            setDeleteError("");

                                        }}
                                        placeholder="Type organization name"
                                        autoFocus
                                        disabled={
                                            isDeletingOrganization
                                        }
                                        className="
                                            mt-3
                                            w-full
                                            border
                                            border-[#4a2b2b]
                                            bg-[#0c0a0a]
                                            px-3
                                            py-3
                                            text-xs
                                            text-[#d98a8a]
                                            outline-none
                                            placeholder:text-[#5d4141]
                                            focus:border-[#8a4545]
                                            disabled:opacity-50
                                        "
                                    />


                                    {deleteError && (

                                        <p
                                            className="
                                                mt-2
                                                text-xs
                                                text-[#d16f6f]
                                            "
                                        >
                                            {deleteError}
                                        </p>

                                    )}

                                </div>


                                {/* ACTIONS */}

                                <div
                                    className="
                                        mt-6
                                        flex
                                        flex-col-reverse
                                        gap-2
                                        sm:flex-row
                                        sm:justify-end
                                        sm:gap-3
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={closeDeleteModal}
                                        disabled={
                                            isDeletingOrganization
                                        }
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            px-4
                                            py-3
                                            text-xs
                                            font-bold
                                            text-[#718044]
                                            transition
                                            hover:border-[#596544]
                                            hover:text-[#b9d06d]
                                            disabled:opacity-40
                                            sm:w-auto
                                            sm:py-2.5
                                        "
                                    >
                                        CANCEL
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleDeleteOrganization
                                        }
                                        disabled={
                                            isDeletingOrganization ||
                                            deleteConfirmation !==
                                                selectedOrganization.name
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            border
                                            border-[#6a3535]
                                            bg-[#241313]
                                            px-5
                                            py-3
                                            text-xs
                                            font-bold
                                            tracking-wider
                                            text-[#d98a8a]
                                            transition
                                            hover:border-[#a24d4d]
                                            hover:bg-[#301818]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-30
                                            sm:w-auto
                                            sm:py-2.5
                                        "
                                    >

                                        <Trash2
                                            size={14}
                                        />

                                        {isDeletingOrganization
                                            ? "DELETING..."
                                            : "DELETE PERMANENTLY"}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

        </main>
    );
}


export default Profile;