import {
    Users,
    Plus,
    Mail,
    Shield,
    X,
    Copy,
    Check,
    Trash2,
    LogOut,
    Pencil,
    AlertTriangle,
} from "lucide-react";

import {
    useEffect,
    useState,
    type FormEvent,
} from "react";

import toast from "react-hot-toast";

import { useDashboardStore } from "../../stores/useDashStore";


type MemberRole =
    | "MEMBER"
    | "MANAGER"
    | "ADMIN";


type ConfirmationAction =
    | "REMOVE_MEMBER"
    | "LEAVE_ORGANIZATION"
    | "CHANGE_ROLE"
    | null;


interface ConfirmationData {
    action: ConfirmationAction;
    userId?: string;
    memberName?: string;
    newRole?: MemberRole;
}


function Team() {

    const members =
        useDashboardStore(
            (state) => state.members
        );

    const selectedOrganization =
        useDashboardStore(
            (state) => state.selectedOrganization
        );

    const isLoadingMembers =
        useDashboardStore(
            (state) => state.isLoadingMembers
        );

    const canManageMembers =
        useDashboardStore(
            (state) => state.canManageMembers
        );

    const fetchMembers =
        useDashboardStore(
            (state) => state.fetchMembers
        );


    const [showInvite, setShowInvite] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [role, setRole] =
        useState<"MEMBER" | "MANAGER">(
            "MEMBER"
        );

    const [isInviting, setIsInviting] =
        useState(false);

    const [inviteLink, setInviteLink] =
        useState("");

    const [copied, setCopied] =
        useState(false);


    /*
     * MEMBER MANAGEMENT
     */

    const [processingMemberId, setProcessingMemberId] =
        useState<string | null>(null);

    const [editingMemberId, setEditingMemberId] =
        useState<string | null>(null);

    const [selectedRole, setSelectedRole] =
        useState<MemberRole>("MEMBER");


    /*
     * LEAVE ORGANIZATION
     */

    const [isLeaving, setIsLeaving] =
        useState(false);


    /*
     * CUSTOM CONFIRMATION MODAL
     */

    const [confirmation, setConfirmation] =
        useState<ConfirmationData>({
            action: null,
        });


    const isAdmin =
        selectedOrganization?.role === "ADMIN";


    useEffect(() => {

        if (
            selectedOrganization?.org_id
        ) {

            fetchMembers(
                selectedOrganization.org_id
            );

        }

    }, [
        selectedOrganization?.org_id,
        fetchMembers,
    ]);


    // =========================================================
    // REFRESH MEMBERS
    // =========================================================

    const refreshMembers = async () => {

        if (
            !selectedOrganization?.org_id
        ) {
            return;
        }

        await fetchMembers(
            selectedOrganization.org_id
        );
    };


    // =========================================================
    // SEND INVITATION
    // =========================================================

    const handleInvite = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (
            !selectedOrganization?.org_id ||
            !email.trim()
        ) {
            return;
        }

        setIsInviting(true);

        try {

            const response =
                await fetch(
                    `${import.meta.env.VITE_BASE_URL}/organizations/${selectedOrganization.org_id}/invitations`,
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            email:
                                email.trim(),
                            role,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Failed to send invitation."
                );

                return;
            }


            toast.success(
                data.message ||
                "Invitation sent successfully."
            );


            setInviteLink(
                data.inviteLink || ""
            );

            setEmail("");


        } catch (error) {

            console.error(
                "Invitation failed:",
                error
            );

            toast.error(
                "Unable to connect to the server."
            );

        } finally {

            setIsInviting(false);
        }
    };


    // =========================================================
    // CHANGE MEMBER ROLE
    // =========================================================

    const requestChangeRole = (
        userId: string,
        memberName: string
    ) => {

        setConfirmation({
            action: "CHANGE_ROLE",
            userId,
            memberName,
            newRole: selectedRole,
        });
    };


    const handleChangeRole = async () => {

        if (
            !selectedOrganization?.org_id ||
            !confirmation.userId ||
            !confirmation.newRole
        ) {
            return;
        }


        const userId =
            confirmation.userId;

        const newRole =
            confirmation.newRole;

        setProcessingMemberId(userId);

        try {

            const response =
                await fetch(
                    `${import.meta.env.VITE_BASE_URL}/organizations/${selectedOrganization.org_id}/members/${userId}/role`,
                    {
                        method: "PATCH",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            role: newRole,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Failed to change member role."
                );

                return;
            }


            toast.success(
                data.message ||
                "Member role updated successfully."
            );


            setEditingMemberId(null);

            setConfirmation({
                action: null,
            });

            await refreshMembers();

        } catch (error) {

            console.error(
                "Change role failed:",
                error
            );

            toast.error(
                "Unable to connect to the server."
            );

        } finally {

            setProcessingMemberId(null);
        }
    };


    // =========================================================
    // REMOVE MEMBER
    // =========================================================

    const requestRemoveMember = (
        userId: string,
        memberName: string
    ) => {

        setConfirmation({
            action: "REMOVE_MEMBER",
            userId,
            memberName,
        });
    };


    const handleRemoveMember = async () => {

        if (
            !selectedOrganization?.org_id ||
            !confirmation.userId
        ) {
            return;
        }


        const userId =
            confirmation.userId;


        setProcessingMemberId(userId);

        try {

            const response =
                await fetch(
                    `${import.meta.env.VITE_BASE_URL}/organizations/${selectedOrganization.org_id}/members/${userId}`,
                    {
                        method: "DELETE",

                        credentials: "include",
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Failed to remove member."
                );

                return;
            }


            toast.success(
                data.message ||
                "Member removed successfully."
            );


            setConfirmation({
                action: null,
            });

            await refreshMembers();

        } catch (error) {

            console.error(
                "Remove member failed:",
                error
            );

            toast.error(
                "Unable to connect to the server."
            );

        } finally {

            setProcessingMemberId(null);
        }
    };


    // =========================================================
    // LEAVE ORGANIZATION
    // =========================================================

    const requestLeaveOrganization = () => {

        setConfirmation({
            action: "LEAVE_ORGANIZATION",
        });
    };


    const handleLeaveOrganization = async () => {

        if (
            !selectedOrganization?.org_id
        ) {
            return;
        }


        setIsLeaving(true);

        try {

            const response =
                await fetch(
                    `${import.meta.env.VITE_BASE_URL}/organizations/${selectedOrganization.org_id}/leave`,
                    {
                        method: "DELETE",

                        credentials: "include",
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Failed to leave organization."
                );

                return;
            }


            toast.success(
                data.message ||
                "You have left the organization."
            );


            setConfirmation({
                action: null,
            });


            /*
             * Refreshing the application ensures the
             * organization context is completely reset.
             */

            window.location.reload();

        } catch (error) {

            console.error(
                "Leave organization failed:",
                error
            );

            toast.error(
                "Unable to connect to the server."
            );

        } finally {

            setIsLeaving(false);
        }
    };


    // =========================================================
    // CONFIRM ACTION
    // =========================================================

    const handleConfirmation = async () => {

        switch (confirmation.action) {

            case "REMOVE_MEMBER":
                await handleRemoveMember();
                break;

            case "CHANGE_ROLE":
                await handleChangeRole();
                break;

            case "LEAVE_ORGANIZATION":
                await handleLeaveOrganization();
                break;

            default:
                break;
        }
    };


    // =========================================================
    // CLOSE CONFIRMATION
    // =========================================================

    const closeConfirmation = () => {

        if (
            processingMemberId ||
            isLeaving
        ) {
            return;
        }

        setConfirmation({
            action: null,
        });
    };


    // =========================================================
    // COPY INVITE LINK
    // =========================================================

    const copyInviteLink = async () => {

        if (!inviteLink) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                inviteLink
            );

            setCopied(true);

            toast.success(
                "Invitation link copied."
            );

            setTimeout(() => {

                setCopied(false);

            }, 1500);

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

            toast.error(
                "Failed to copy invitation link."
            );
        }
    };


    // =========================================================
    // CLOSE INVITE MODAL
    // =========================================================

    const closeModal = () => {

        if (isInviting) {
            return;
        }

        setShowInvite(false);
        setInviteLink("");
        setEmail("");
        setRole("MEMBER");
        setCopied(false);
    };


    // =========================================================
    // START ROLE EDIT
    // =========================================================

    const startEditingRole = (
        userId: string,
        currentRole: MemberRole
    ) => {

        setEditingMemberId(userId);

        setSelectedRole(
            currentRole
        );
    };


    // =========================================================
    // CANCEL ROLE EDIT
    // =========================================================

    const cancelEditingRole = () => {

        setEditingMemberId(null);

        setSelectedRole("MEMBER");
    };


    // =========================================================
    // CONFIRMATION MODAL CONTENT
    // =========================================================

    const getConfirmationContent = () => {

        switch (confirmation.action) {

            case "REMOVE_MEMBER":

                return {
                    title: "REMOVE MEMBER",
                    description: (
                        <>
                            Are you sure you want to remove{" "}
                            <span className="font-bold text-[#b9d06d]">
                                {confirmation.memberName}
                            </span>{" "}
                            from this organization?
                        </>
                    ),
                    warning:
                        "They will immediately lose access to this organization.",
                    button: "REMOVE MEMBER",
                };


            case "CHANGE_ROLE":

                return {
                    title: "CHANGE MEMBER ROLE",
                    description: (
                        <>
                            Change{" "}
                            <span className="font-bold text-[#b9d06d]">
                                {confirmation.memberName}
                            </span>
                            's role to{" "}
                            <span className="font-bold text-[#b9d06d]">
                                {confirmation.newRole}
                            </span>
                            ?
                        </>
                    ),
                    warning:
                        "Their permissions will change immediately.",
                    button: "CHANGE ROLE",
                };


            case "LEAVE_ORGANIZATION":

                return {
                    title: "LEAVE ORGANIZATION",
                    description: (
                        <>
                            Are you sure you want to leave{" "}
                            <span className="font-bold text-[#b9d06d]">
                                {selectedOrganization?.name}
                            </span>
                            ?
                        </>
                    ),
                    warning:
                        "You will immediately lose access to this organization's projects, tasks and team.",
                    button: "LEAVE ORGANIZATION",
                };


            default:

                return null;
        }
    };


    const confirmationContent =
        getConfirmationContent();


    return (
        <section
            className="
                min-h-[calc(100vh-68px)]
                bg-[#0c100c]
                p-6
                font-mono
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    mb-8
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-[10px]
                            tracking-[0.2em]
                            text-[#596544]
                        "
                    >
                        ORGANIZATION
                    </p>

                    <h1
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            text-[#b9d06d]
                        "
                    >
                        TEAM
                    </h1>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-[#667541]
                        "
                    >
                        Manage organization members
                    </p>

                </div>


                <div className="flex gap-3">

                    {canManageMembers() && (

                        <button
                            type="button"
                            onClick={() =>
                                setShowInvite(true)
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                border
                                border-[#71833f]
                                bg-[#101510]
                                px-4
                                py-2
                                text-xs
                                font-bold
                                tracking-wider
                                text-[#b9d06d]
                                transition
                                hover:bg-[#182012]
                            "
                        >

                            <Plus size={15} />

                            INVITE MEMBER

                        </button>

                    )}

                </div>

            </div>


            {/* =================================================
                MEMBERS
            ================================================= */}

            {isLoadingMembers ? (

                <div
                    className="
                        flex
                        min-h-[300px]
                        items-center
                        justify-center
                    "
                >

                    <p
                        className="
                            text-xs
                            tracking-widest
                            text-[#718044]
                        "
                    >
                        LOADING TEAM...
                    </p>

                </div>

            ) : members.length === 0 ? (

                <div
                    className="
                        flex
                        min-h-[300px]
                        flex-col
                        items-center
                        justify-center
                        border
                        border-[#303a24]
                        bg-[#101510]
                    "
                >

                    <Users
                        size={34}
                        strokeWidth={1}
                        className="mb-4 text-[#596544]"
                    />

                    <p
                        className="
                            text-sm
                            text-[#718044]
                        "
                    >
                        NO MEMBERS FOUND
                    </p>

                </div>

            ) : (

                <div
                    className="
                        overflow-hidden
                        border
                        border-[#303a24]
                        bg-[#101510]
                    "
                >

                    <div
                        className="
                            hidden
                            grid-cols-[1fr_180px_220px]
                            border-b
                            border-[#303a24]
                            px-5
                            py-3
                            text-[9px]
                            tracking-[0.15em]
                            text-[#596544]
                            sm:grid
                        "
                    >

                        <span>
                            MEMBER
                        </span>

                        <span>
                            EMAIL
                        </span>

                        <span>
                            ROLE / ACTIONS
                        </span>

                    </div>


                    {members.map((member) => {

                        const memberIsAdmin =
                            member.role === "ADMIN";

                        const isProcessing =
                            processingMemberId ===
                            member.user_id;

                        const isEditing =
                            editingMemberId ===
                            member.user_id;


                        return (

                            <div
                                key={member.user_id}
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    border-b
                                    border-[#242d1c]
                                    px-5
                                    py-4
                                    last:border-b-0
                                    sm:grid-cols-[1fr_180px_220px]
                                    sm:items-center
                                "
                            >

                                {/* MEMBER */}

                                <div
                                    className="
                                        flex
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
                                            border-[#39452b]
                                            text-[#718044]
                                        "
                                    >

                                        <Users
                                            size={15}
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                text-[#b9d06d]
                                            "
                                        >
                                            {member.name}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                text-[#596544]
                                            "
                                        >
                                            MEMBER ID:{" "}
                                            {member.user_id.slice(
                                                0,
                                                8
                                            )}
                                            ...
                                        </p>

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-[#718044]
                                    "
                                >

                                    <Mail
                                        size={13}
                                    />

                                    <span
                                        className="
                                            truncate
                                        "
                                    >
                                        {member.email}
                                    </span>

                                </div>


                                {/* ROLE + ACTIONS */}

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    {!isEditing ? (

                                        <>

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    border
                                                    border-[#39452b]
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    font-bold
                                                    text-[#718044]
                                                "
                                            >

                                                <Shield
                                                    size={11}
                                                />

                                                {
                                                    member.role
                                                }

                                            </span>


                                            {isAdmin &&
                                                !memberIsAdmin && (

                                                    <>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            onClick={() =>
                                                                startEditingRole(
                                                                    member.user_id,
                                                                    member.role as MemberRole
                                                                )
                                                            }
                                                            title="Change role"
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-1
                                                                border
                                                                border-[#39452b]
                                                                px-2
                                                                py-1
                                                                text-[9px]
                                                                text-[#718044]
                                                                transition
                                                                hover:border-[#71833f]
                                                                hover:text-[#b9d06d]
                                                                disabled:opacity-40
                                                            "
                                                        >

                                                            <Pencil
                                                                size={11}
                                                            />

                                                            ROLE

                                                        </button>


                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            onClick={() =>
                                                                requestRemoveMember(
                                                                    member.user_id,
                                                                    member.name
                                                                )
                                                            }
                                                            title="Remove member"
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-1
                                                                border
                                                                border-[#4a302c]
                                                                px-2
                                                                py-1
                                                                text-[9px]
                                                                text-[#9d665d]
                                                                transition
                                                                hover:border-[#a06a60]
                                                                hover:text-[#d38b80]
                                                                disabled:opacity-40
                                                            "
                                                        >

                                                            <Trash2
                                                                size={11}
                                                            />

                                                            {isProcessing
                                                                ? "..."
                                                                : "REMOVE"}

                                                        </button>

                                                    </>

                                                )}

                                        </>

                                    ) : (

                                        <>

                                            <select
                                                value={
                                                    selectedRole
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSelectedRole(
                                                        event
                                                            .target
                                                            .value as MemberRole
                                                    )
                                                }
                                                disabled={
                                                    isProcessing
                                                }
                                                className="
                                                    border
                                                    border-[#39452b]
                                                    bg-[#0c100c]
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    font-bold
                                                    text-[#b9d06d]
                                                    outline-none
                                                    focus:border-[#71833f]
                                                "
                                            >

                                                <option value="MEMBER">
                                                    MEMBER
                                                </option>

                                                <option value="MANAGER">
                                                    MANAGER
                                                </option>

                                                <option value="ADMIN">
                                                    ADMIN
                                                </option>

                                            </select>


                                            <button
                                                type="button"
                                                disabled={
                                                    isProcessing
                                                }
                                                onClick={() =>
                                                    requestChangeRole(
                                                        member.user_id,
                                                        member.name
                                                    )
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    border
                                                    border-[#71833f]
                                                    bg-[#182012]
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    font-bold
                                                    text-[#b9d06d]
                                                    disabled:opacity-40
                                                "
                                            >

                                                <Check
                                                    size={11}
                                                />

                                                SAVE

                                            </button>


                                            <button
                                                type="button"
                                                disabled={
                                                    isProcessing
                                                }
                                                onClick={
                                                    cancelEditingRole
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    border
                                                    border-[#303a24]
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    text-[#596544]
                                                    disabled:opacity-40
                                                "
                                            >

                                                <X
                                                    size={11}
                                                />

                                                CANCEL

                                            </button>

                                        </>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}


            {/* =================================================
                LEAVE ORGANIZATION
            ================================================= */}

            {selectedOrganization && (

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        gap-4
                        border
                        border-[#303a24]
                        bg-[#101510]
                        px-5
                        py-4
                    "
                >

                    <div>

                        <p
                            className="
                                text-[9px]
                                tracking-[0.15em]
                                text-[#596544]
                            "
                        >
                            DANGER ZONE
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-[#718044]
                            "
                        >
                            Leave{" "}
                            <span className="font-bold text-[#b9d06d]">
                                {
                                    selectedOrganization.name
                                }
                            </span>
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            requestLeaveOrganization
                        }
                        disabled={isLeaving}
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                            border
                            border-[#4a302c]
                            px-4
                            py-2
                            text-[10px]
                            font-bold
                            text-[#9d665d]
                            transition
                            hover:border-[#a06a60]
                            hover:text-[#d38b80]
                            disabled:opacity-40
                        "
                    >

                        <LogOut
                            size={13}
                        />

                        LEAVE ORGANIZATION

                    </button>

                </div>

            )}


            {/* =================================================
                INVITE MODAL
            ================================================= */}

            {showInvite && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[200]
                        flex
                        items-center
                        justify-center
                        bg-black/70
                        px-4
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-lg
                            border
                            border-[#39452b]
                            bg-[#0f140f]
                            shadow-2xl
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-[#303a24]
                                px-5
                                py-4
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        tracking-[0.2em]
                                        text-[#596544]
                                    "
                                >
                                    TEAM
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        text-lg
                                        font-bold
                                        text-[#b9d06d]
                                    "
                                >
                                    INVITE MEMBER
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isInviting}
                                className="
                                    text-[#596544]
                                    hover:text-[#b9d06d]
                                    disabled:opacity-40
                                "
                            >

                                <X size={18} />

                            </button>

                        </div>


                        {!inviteLink ? (

                            <form
                                onSubmit={handleInvite}
                                className="p-5"
                            >

                                <label
                                    className="
                                        text-[9px]
                                        tracking-widest
                                        text-[#718044]
                                    "
                                >
                                    EMAIL
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="member@example.com"
                                    className="
                                        mt-2
                                        w-full
                                        border
                                        border-[#303a24]
                                        bg-[#0c100c]
                                        px-3
                                        py-3
                                        text-xs
                                        text-[#b9d06d]
                                        outline-none
                                        placeholder:text-[#3f4b32]
                                        focus:border-[#71833f]
                                    "
                                />


                                <label
                                    className="
                                        mt-5
                                        block
                                        text-[9px]
                                        tracking-widest
                                        text-[#718044]
                                    "
                                >
                                    ROLE
                                </label>

                                <select
                                    value={role}
                                    onChange={(event) =>
                                        setRole(
                                            event.target.value as
                                                | "MEMBER"
                                                | "MANAGER"
                                        )
                                    }
                                    className="
                                        mt-2
                                        w-full
                                        border
                                        border-[#303a24]
                                        bg-[#0c100c]
                                        px-3
                                        py-3
                                        text-xs
                                        text-[#b9d06d]
                                        outline-none
                                        focus:border-[#71833f]
                                    "
                                >

                                    <option value="MEMBER">
                                        MEMBER
                                    </option>

                                    <option value="MANAGER">
                                        MANAGER
                                    </option>

                                </select>


                                <div
                                    className="
                                        mt-6
                                        flex
                                        justify-end
                                        gap-3
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isInviting}
                                        className="
                                            border
                                            border-[#303a24]
                                            px-4
                                            py-2
                                            text-xs
                                            text-[#596544]
                                            disabled:opacity-40
                                        "
                                    >
                                        CANCEL
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={isInviting}
                                        className="
                                            border
                                            border-[#71833f]
                                            bg-[#182012]
                                            px-5
                                            py-2
                                            text-xs
                                            font-bold
                                            text-[#b9d06d]
                                            disabled:opacity-40
                                        "
                                    >

                                        {isInviting
                                            ? "SENDING..."
                                            : "SEND INVITE"}

                                    </button>

                                </div>

                            </form>

                        ) : (

                            <div className="p-5">

                                <div
                                    className="
                                        border
                                        border-[#39452b]
                                        bg-[#101510]
                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <Check
                                            size={16}
                                            className="
                                                text-[#b9d06d]
                                            "
                                        />

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                text-[#b9d06d]
                                            "
                                        >
                                            INVITATION CREATED
                                        </p>

                                    </div>


                                    <p
                                        className="
                                            mt-2
                                            text-[10px]
                                            leading-5
                                            text-[#718044]
                                        "
                                    >
                                        Share this link with the
                                        invited user.
                                    </p>


                                    <div
                                        className="
                                            mt-4
                                            flex
                                            gap-2
                                        "
                                    >

                                        <input
                                            readOnly
                                            value={inviteLink}
                                            className="
                                                min-w-0
                                                flex-1
                                                border
                                                border-[#303a24]
                                                bg-[#0c100c]
                                                px-3
                                                py-2
                                                text-[10px]
                                                text-[#718044]
                                                outline-none
                                            "
                                        />


                                        <button
                                            type="button"
                                            onClick={
                                                copyInviteLink
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                border
                                                border-[#39452b]
                                                px-3
                                                text-[10px]
                                                text-[#b9d06d]
                                            "
                                        >

                                            {copied ? (
                                                <Check
                                                    size={13}
                                                />
                                            ) : (
                                                <Copy
                                                    size={13}
                                                />
                                            )}

                                            {copied
                                                ? "COPIED"
                                                : "COPY"}

                                        </button>

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        text-right
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="
                                            border
                                            border-[#71833f]
                                            px-5
                                            py-2
                                            text-xs
                                            font-bold
                                            text-[#b9d06d]
                                        "
                                    >
                                        DONE
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            )}


            {/* =================================================
                CUSTOM CONFIRMATION MODAL
            ================================================= */}

            {confirmation.action &&
                confirmationContent && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-[300]
                            flex
                            items-center
                            justify-center
                            bg-black/75
                            px-4
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-md
                                border
                                border-[#39452b]
                                bg-[#0f140f]
                                shadow-2xl
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-[#303a24]
                                    px-5
                                    py-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            border
                                            border-[#4a302c]
                                            bg-[#17110f]
                                            text-[#b2776b]
                                        "
                                    >

                                        <AlertTriangle
                                            size={16}
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[9px]
                                                tracking-[0.2em]
                                                text-[#596544]
                                            "
                                        >
                                            CONFIRM ACTION
                                        </p>

                                        <h2
                                            className="
                                                mt-1
                                                text-sm
                                                font-bold
                                                text-[#b9d06d]
                                            "
                                        >
                                            {
                                                confirmationContent.title
                                            }
                                        </h2>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        closeConfirmation
                                    }
                                    disabled={
                                        !!processingMemberId ||
                                        isLeaving
                                    }
                                    className="
                                        text-[#596544]
                                        transition
                                        hover:text-[#b9d06d]
                                        disabled:opacity-40
                                    "
                                >

                                    <X size={18} />

                                </button>

                            </div>


                            {/* BODY */}

                            <div className="p-5">

                                <p
                                    className="
                                        text-xs
                                        leading-6
                                        text-[#718044]
                                    "
                                >
                                    {
                                        confirmationContent.description
                                    }
                                </p>


                                <div
                                    className="
                                        mt-4
                                        border
                                        border-[#4a302c]
                                        bg-[#17110f]
                                        px-3
                                        py-3
                                    "
                                >

                                    <p
                                        className="
                                            text-[10px]
                                            leading-5
                                            text-[#9d665d]
                                        "
                                    >
                                        {
                                            confirmationContent.warning
                                        }
                                    </p>

                                </div>


                                {/* ACTIONS */}

                                <div
                                    className="
                                        mt-6
                                        flex
                                        justify-end
                                        gap-3
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            closeConfirmation
                                        }
                                        disabled={
                                            !!processingMemberId ||
                                            isLeaving
                                        }
                                        className="
                                            border
                                            border-[#303a24]
                                            px-4
                                            py-2
                                            text-[10px]
                                            font-bold
                                            text-[#596544]
                                            transition
                                            hover:border-[#39452b]
                                            hover:text-[#718044]
                                            disabled:opacity-40
                                        "
                                    >
                                        CANCEL
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleConfirmation
                                        }
                                        disabled={
                                            !!processingMemberId ||
                                            isLeaving
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            border
                                            border-[#4a302c]
                                            bg-[#211513]
                                            px-4
                                            py-2
                                            text-[10px]
                                            font-bold
                                            text-[#c17b70]
                                            transition
                                            hover:bg-[#2a1816]
                                            disabled:opacity-40
                                        "
                                    >

                                        {processingMemberId ||
                                        isLeaving ? (
                                            <>
                                                PROCESSING...
                                            </>
                                        ) : (
                                            <>
                                                <Check
                                                    size={12}
                                                />

                                                {
                                                    confirmationContent.button
                                                }
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

        </section>
    );
}

export default Team;