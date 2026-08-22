import {
    Check,
    ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useDashboardStore } from "../stores/useDashStore";

function AcceptInvitation() {

    const { token } = useParams();

    const navigate = useNavigate();

    const fetchOrganizations =
        useDashboardStore(
            (state) => state.fetchOrganizations
        );

    const [isAccepting, setIsAccepting] =
        useState(false);

    const [accepted, setAccepted] =
        useState(false);


    const handleAccept = async () => {

        if (!token) {
            return;
        }

        setIsAccepting(true);

        try {

            await axiosInstance.post(
                `/invitations/${token}/accept`
            );

            setAccepted(true);

            await fetchOrganizations();

            setTimeout(() => {

                navigate("/dashboard");

            }, 1200);

        } catch (error) {

            console.error(
                "Invitation acceptance failed:",
                error
            );

        } finally {

            setIsAccepting(false);
        }
    };


    return (
        <main
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-[#0c100c]
                px-4
                font-mono
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    border
                    border-[#39452b]
                    bg-[#101510]
                    p-7
                "
            >

                {accepted ? (

                    <div className="text-center">

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                border
                                border-[#71833f]
                                bg-[#182012]
                                text-[#b9d06d]
                            "
                        >

                            <Check size={25} />

                        </div>

                        <h1
                            className="
                                mt-5
                                text-lg
                                font-bold
                                text-[#b9d06d]
                            "
                        >
                            INVITATION ACCEPTED
                        </h1>

                        <p
                            className="
                                mt-2
                                text-xs
                                text-[#718044]
                            "
                        >
                            Redirecting to dashboard...
                        </p>

                    </div>

                ) : (

                    <>

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                border
                                border-[#71833f]
                                text-[#b9d06d]
                            "
                        >

                            <ShieldAlert size={25} />

                        </div>


                        <div className="mt-6 text-center">

                            <p
                                className="
                                    text-[9px]
                                    tracking-[0.2em]
                                    text-[#596544]
                                "
                            >
                                ORGANIZATION
                            </p>

                            <h1
                                className="
                                    mt-2
                                    text-xl
                                    font-bold
                                    text-[#b9d06d]
                                "
                            >
                                YOU'RE INVITED
                            </h1>

                            <p
                                className="
                                    mt-3
                                    text-xs
                                    leading-5
                                    text-[#718044]
                                "
                            >
                                You have been invited to join
                                an organization.
                            </p>

                        </div>


                        <button
                            type="button"
                            disabled={
                                isAccepting ||
                                !token
                            }
                            onClick={
                                handleAccept
                            }
                            className="
                                mt-7
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                border
                                border-[#71833f]
                                bg-[#182012]
                                px-4
                                py-3
                                text-xs
                                font-bold
                                tracking-wider
                                text-[#b9d06d]
                                transition
                                hover:bg-[#202b17]
                                disabled:opacity-40
                            "
                        >

                            <Check size={15} />

                            {isAccepting
                                ? "ACCEPTING..."
                                : "ACCEPT INVITATION"}

                        </button>

                    </>

                )}

            </div>

        </main>
    );
}

export default AcceptInvitation;