import {
    Bell,
    ChevronDown,
    UserRound,
    Check,
    Plus,
    Mail,
    Menu,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useDashboardStore } from "../stores/useDashStore";

interface DashboardHeaderProps {
    onCreateOrganization: () => void;
    onMobileMenuToggle?: () => void;
}

function DashboardHeader({
    onCreateOrganization,
    onMobileMenuToggle,
}: DashboardHeaderProps) {

    const navigate = useNavigate();

    const organizations = useDashboardStore(
        (state) => state.organizations
    );

    const selectedOrganization = useDashboardStore(
        (state) => state.selectedOrganization
    );

    const selectOrganization = useDashboardStore(
        (state) => state.selectOrganization
    );

    const invitations = useDashboardStore(
        (state) => state.invitations
    );

    const fetchInvitations = useDashboardStore(
        (state) => state.fetchInvitations
    );

    const acceptInvitation = useDashboardStore(
        (state) => state.acceptInvitation
    );

    const [showOrganizations, setShowOrganizations] =
        useState(false);

    const [showInvitations, setShowInvitations] =
        useState(false);

    const [isSwitching, setIsSwitching] =
        useState(false);

    const [processingInvitation, setProcessingInvitation] =
        useState<string | null>(null);


    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);


    const handleOrganizationChange = async (
        organization: typeof organizations[number]
    ) => {

        if (
            selectedOrganization?.org_id ===
            organization.org_id
        ) {
            setShowOrganizations(false);
            return;
        }

        setIsSwitching(true);

        try {

            await selectOrganization(
                organization
            );

        } finally {

            setIsSwitching(false);
            setShowOrganizations(false);
        }
    };


    const handleInvitationToggle = async () => {

        const nextState = !showInvitations;

        setShowInvitations(nextState);
        setShowOrganizations(false);

        if (nextState) {
            await fetchInvitations();
        }
    };


    const handleAcceptInvitation = async (
        token: string
    ) => {

        setProcessingInvitation(token);

        try {

            const accepted =
                await acceptInvitation(token);

            if (accepted) {
                toast.success(
                    "Invitation accepted successfully."
                );
            }

        } finally {

            setProcessingInvitation(null);
        }
    };


    return (
        <header
            className="
                relative
                z-50
                h-[68px]
                w-full
                border-b
                border-[#303a24]
                bg-[#0c100c]
                font-mono
            "
        >

            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-between
                    gap-3
                    px-3
                    sm:px-5
                "
            >

                {/* =================================================
                   LEFT
                ================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                        sm:gap-4
                    "
                >

                    {/* MOBILE MENU */}

                    <button
                        type="button"
                        onClick={onMobileMenuToggle}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
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
                            lg:hidden
                        "
                        title="Open menu"
                    >

                        <Menu
                            size={17}
                            strokeWidth={1.5}
                        />

                    </button>


                    {/* LOGO */}

                    <div className="flex shrink-0 items-center gap-3">

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                border
                                border-[#71833f]
                                text-sm
                                font-bold
                                text-[#b9d06d]
                            "
                        >
                            K
                        </div>

                        <span
                            className="
                                hidden
                                text-sm
                                font-bold
                                tracking-[0.18em]
                                text-[#b9d06d]
                                sm:block
                            "
                        >
                            KAIRO
                        </span>

                    </div>


                    <div
                        className="
                            hidden
                            h-7
                            w-px
                            bg-[#303a24]
                            sm:block
                        "
                    />


                    {/* =================================================
                       ORGANIZATION
                    ================================================= */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >

                        <div className="relative">

                            <button
                                type="button"
                                disabled={
                                    isSwitching ||
                                    organizations.length === 0
                                }
                                onClick={() => {
                                    setShowOrganizations(
                                        (previous) =>
                                            !previous
                                    );
                                    setShowInvitations(false);
                                }}
                                className="
                                    flex
                                    min-w-0
                                    max-w-[180px]
                                    items-center
                                    justify-between
                                    gap-2
                                    border
                                    border-[#303a24]
                                    bg-[#101510]
                                    px-3
                                    py-2
                                    text-left
                                    transition
                                    hover:border-[#71833f]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:min-w-[190px]
                                    sm:max-w-none
                                "
                            >

                                <div className="min-w-0">

                                    <p
                                        className="
                                            text-[8px]
                                            tracking-[0.15em]
                                            text-[#596544]
                                        "
                                    >
                                        ORGANIZATION
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            max-w-[125px]
                                            truncate
                                            text-xs
                                            font-bold
                                            text-[#b9d06d]
                                            sm:max-w-[140px]
                                        "
                                    >
                                        {isSwitching
                                            ? "SWITCHING..."
                                            : selectedOrganization?.name ??
                                              "SELECT ORGANIZATION"
                                        }
                                    </p>

                                </div>

                                <ChevronDown
                                    size={15}
                                    className={`
                                        shrink-0
                                        text-[#718044]
                                        transition
                                        ${
                                            showOrganizations
                                                ? "rotate-180"
                                                : ""
                                        }
                                    `}
                                />

                            </button>


                            {/* ORGANIZATION DROPDOWN */}

                            {showOrganizations && (

                                <div
                                    className="
                                        fixed
                                        left-3
                                        right-3
                                        top-[74px]
                                        z-[100]
                                        overflow-hidden
                                        border
                                        border-[#303a24]
                                        bg-[#101510]
                                        shadow-2xl
                                        sm:absolute
                                        sm:left-0
                                        sm:right-auto
                                        sm:top-[calc(100%+6px)]
                                        sm:w-[280px]
                                    "
                                >

                                    <div
                                        className="
                                            border-b
                                            border-[#303a24]
                                            px-4
                                            py-3
                                        "
                                    >

                                        <p
                                            className="
                                                text-[9px]
                                                tracking-[0.15em]
                                                text-[#596544]
                                            "
                                        >
                                            YOUR ORGANIZATIONS
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                text-[#465034]
                                            "
                                        >
                                            Select an organization to
                                            switch context.
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            max-h-[280px]
                                            overflow-y-auto
                                        "
                                    >

                                        {organizations.map(
                                            (organization) => {

                                                const isSelected =
                                                    selectedOrganization?.org_id ===
                                                    organization.org_id;

                                                return (
                                                    <button
                                                        key={
                                                            organization.org_id
                                                        }
                                                        type="button"
                                                        disabled={
                                                            isSwitching
                                                        }
                                                        onClick={() =>
                                                            handleOrganizationChange(
                                                                organization
                                                            )
                                                        }
                                                        className={`
                                                            flex
                                                            w-full
                                                            items-center
                                                            justify-between
                                                            gap-3
                                                            border-b
                                                            border-[#242d1c]
                                                            px-4
                                                            py-3
                                                            text-left
                                                            transition
                                                            last:border-b-0
                                                            hover:bg-[#182012]
                                                            ${
                                                                isSelected
                                                                    ? "bg-[#182012]"
                                                                    : ""
                                                            }
                                                        `}
                                                    >

                                                        <div className="min-w-0">

                                                            <p
                                                                className="
                                                                    truncate
                                                                    text-xs
                                                                    font-bold
                                                                    text-[#b9d06d]
                                                                "
                                                            >
                                                                {
                                                                    organization.name
                                                                }
                                                            </p>

                                                            <div
                                                                className="
                                                                    mt-1
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                            >

                                                                <span
                                                                    className="
                                                                        max-w-[150px]
                                                                        truncate
                                                                        text-[9px]
                                                                        text-[#596544]
                                                                    "
                                                                >
                                                                    {
                                                                        organization.slug
                                                                    }
                                                                </span>

                                                                <span className="text-[#303a24]">
                                                                    •
                                                                </span>

                                                                <span
                                                                    className="
                                                                        text-[9px]
                                                                        text-[#718044]
                                                                    "
                                                                >
                                                                    {
                                                                        organization.role
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>


                                                        {isSelected && (
                                                            <Check
                                                                size={15}
                                                                className="
                                                                    shrink-0
                                                                    text-[#b9d06d]
                                                                "
                                                            />
                                                        )}

                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* CREATE ORGANIZATION */}

                        <button
                            type="button"
                            onClick={() => {
                                setShowOrganizations(false);
                                setShowInvitations(false);
                                onCreateOrganization();
                            }}
                            title="Create organization"
                            className="
                                flex
                                h-[44px]
                                w-[44px]
                                shrink-0
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

                            <Plus
                                size={17}
                                strokeWidth={1.5}
                            />

                        </button>

                    </div>

                </div>


                {/* =================================================
                   RIGHT
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                        sm:gap-3
                    "
                >

                    {/* ROLE */}

                    {selectedOrganization && (

                        <div
                            className="
                                hidden
                                text-right
                                sm:block
                            "
                        >

                            <p
                                className="
                                    text-[8px]
                                    tracking-[0.15em]
                                    text-[#596544]
                                "
                            >
                                ROLE
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    font-bold
                                    text-[#718044]
                                "
                            >
                                {
                                    selectedOrganization.role
                                }
                            </p>

                        </div>

                    )}


                    {/* =================================================
                       INVITATIONS
                    ================================================= */}

                    <div className="relative">

                        <button
                            type="button"
                            onClick={
                                handleInvitationToggle
                            }
                            title="Pending invitations"
                            className="
                                relative
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                border
                                border-transparent
                                text-[#728249]
                                transition
                                hover:border-[#39452b]
                                hover:text-[#b9d06d]
                            "
                        >

                            <Bell
                                size={17}
                                strokeWidth={1.5}
                            />

                            {invitations.length > 0 && (

                                <span
                                    className="
                                        absolute
                                        right-0
                                        top-0
                                        flex
                                        min-h-[16px]
                                        min-w-[16px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#0c100c]
                                        bg-[#b9d06d]
                                        px-1
                                        text-[8px]
                                        font-bold
                                        text-[#0c100c]
                                    "
                                >
                                    {
                                        invitations.length > 9
                                            ? "9+"
                                            : invitations.length
                                    }
                                </span>

                            )}

                        </button>


                        {showInvitations && (

                            <div
                                className="
                                    fixed
                                    left-3
                                    right-3
                                    top-[74px]
                                    z-[200]
                                    overflow-hidden
                                    border
                                    border-[#303a24]
                                    bg-[#101510]
                                    shadow-2xl
                                    sm:absolute
                                    sm:left-auto
                                    sm:right-0
                                    sm:top-[calc(100%+8px)]
                                    sm:w-[340px]
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-[#303a24]
                                        px-4
                                        py-3
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
                                            ACTIONS
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-bold
                                                text-[#b9d06d]
                                            "
                                        >
                                            INVITATIONS
                                        </p>

                                    </div>

                                    {invitations.length > 0 && (
                                        <span
                                            className="
                                                text-[9px]
                                                text-[#718044]
                                            "
                                        >
                                            {
                                                invitations.length
                                            }{" "}
                                            PENDING
                                        </span>
                                    )}

                                </div>


                                {invitations.length === 0 ? (

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            px-5
                                            py-10
                                            text-center
                                        "
                                    >

                                        <Mail
                                            size={22}
                                            strokeWidth={1}
                                            className="
                                                mb-3
                                                text-[#596544]
                                            "
                                        />

                                        <p
                                            className="
                                                text-xs
                                                text-[#718044]
                                            "
                                        >
                                            NO PENDING INVITATIONS
                                        </p>

                                    </div>

                                ) : (

                                    <div
                                        className="
                                            max-h-[360px]
                                            overflow-y-auto
                                        "
                                    >

                                        {invitations.map(
                                            (invitation) => (

                                                <div
                                                    key={
                                                        invitation.token
                                                    }
                                                    className="
                                                        border-b
                                                        border-[#242d1c]
                                                        p-4
                                                        last:border-b-0
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
                                                                flex
                                                                h-8
                                                                w-8
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                border
                                                                border-[#39452b]
                                                                text-[#718044]
                                                            "
                                                        >

                                                            <Mail
                                                                size={14}
                                                            />

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p
                                                                className="
                                                                    break-words
                                                                    text-xs
                                                                    font-bold
                                                                    text-[#b9d06d]
                                                                "
                                                            >
                                                                {
                                                                    invitation.organization_name
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[10px]
                                                                    text-[#718044]
                                                                "
                                                            >
                                                                Invited by{" "}
                                                                {
                                                                    invitation.invited_by_name ??
                                                                    "Organization admin"
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[9px]
                                                                    text-[#596544]
                                                                "
                                                            >
                                                                ROLE:{" "}
                                                                {
                                                                    invitation.role
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        disabled={
                                                            processingInvitation ===
                                                            invitation.token
                                                        }
                                                        onClick={() =>
                                                            handleAcceptInvitation(
                                                                invitation.token
                                                            )
                                                        }
                                                        className="
                                                            mt-4
                                                            flex
                                                            w-full
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            border
                                                            border-[#71833f]
                                                            bg-[#182012]
                                                            px-3
                                                            py-2
                                                            text-[10px]
                                                            font-bold
                                                            text-[#b9d06d]
                                                            transition
                                                            hover:bg-[#202b17]
                                                            disabled:opacity-40
                                                        "
                                                    >

                                                        <Check
                                                            size={13}
                                                        />

                                                        {
                                                            processingInvitation ===
                                                            invitation.token
                                                                ? "ACCEPTING..."
                                                                : "ACCEPT INVITATION"
                                                        }

                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                       PROFILE
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/profile")
                        }
                        title="Profile"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            border
                            border-[#303a24]
                            text-[#7c8f49]
                            transition
                            hover:border-[#71833f]
                            hover:bg-[#182012]
                            hover:text-[#b9d06d]
                        "
                    >

                        <UserRound
                            size={17}
                            strokeWidth={1.5}
                        />

                    </button>

                </div>

            </div>

        </header>
    );
}

export default DashboardHeader;