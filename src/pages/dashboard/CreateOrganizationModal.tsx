import { useState } from "react";
import type { FormEvent } from "react";
import { X, Building2 } from "lucide-react";
import { useDashboardStore } from "../../stores/useDashStore";

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateOrganizationModal({
    isOpen,
    onClose,
}: CreateOrganizationModalProps) {

    const createOrganization =
        useDashboardStore(
            (state) => state.createOrganization
        );

    const isCreatingOrganization =
        useDashboardStore(
            (state) => state.isCreatingOrganization
        );

    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        const trimmedName =
            name.trim();

        const trimmedDescription =
            description.trim();

        if (!trimmedName) {
            return;
        }

        const organization =
            await createOrganization({
                name: trimmedName,
                description:
                    trimmedDescription || null,
            });

        if (organization) {

            setName("");
            setDescription("");

            onClose();
        }
    };

    const handleClose = () => {

        if (isCreatingOrganization) {
            return;
        }

        setName("");
        setDescription("");

        onClose();
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                px-4
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose();
                }

            }}
        >

            <div
                className="
                    w-full
                    max-w-lg
                    border
                    border-[#39452b]
                    bg-[#0c100c]
                    font-mono
                    shadow-2xl
                "
            >

                {/* =========================================
                    HEADER
                ========================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[#303a24]
                        px-6
                        py-5
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
                                border-[#39452b]
                                bg-[#151b13]
                                text-[#b9d06d]
                            "
                        >
                            <Building2
                                size={17}
                                strokeWidth={1.5}
                            />
                        </div>

                        <div>

                            <p
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#718044]
                                "
                            >
                                Organization
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-sm
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-[#b9d06d]
                                "
                            >
                                Create Organization
                            </h2>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={
                            isCreatingOrganization
                        }
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            border
                            border-transparent
                            text-[#718044]
                            transition
                            hover:border-[#39452b]
                            hover:bg-[#151b13]
                            hover:text-[#b9d06d]
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <X
                            size={17}
                            strokeWidth={1.5}
                        />
                    </button>

                </div>


                {/* =========================================
                    FORM
                ========================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    {/* NAME */}

                    <div className="mb-5">

                        <label
                            htmlFor="organization-name"
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-[#718044]
                            "
                        >
                            Organization Name
                        </label>

                        <input
                            id="organization-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Kairo Technologies"
                            maxLength={100}
                            autoFocus
                            disabled={
                                isCreatingOrganization
                            }
                            className="
                                h-11
                                w-full
                                border
                                border-[#39452b]
                                bg-[#101510]
                                px-4
                                font-mono
                                text-sm
                                text-[#b9d06d]
                                outline-none
                                placeholder:text-[#4f5c3b]
                                focus:border-[#71833f]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        />

                        <p
                            className="
                                mt-2
                                text-[9px]
                                text-[#4f5c3b]
                            "
                        >
                            Your organization slug will
                            be generated automatically.
                        </p>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="mb-7">

                        <label
                            htmlFor="organization-description"
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-[#718044]
                            "
                        >
                            Description
                            <span
                                className="
                                    ml-2
                                    font-normal
                                    normal-case
                                    tracking-normal
                                    text-[#4f5c3b]
                                "
                            >
                                Optional
                            </span>
                        </label>

                        <textarea
                            id="organization-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="What is this organization about?"
                            maxLength={500}
                            rows={4}
                            disabled={
                                isCreatingOrganization
                            }
                            className="
                                w-full
                                resize-none
                                border
                                border-[#39452b]
                                bg-[#101510]
                                px-4
                                py-3
                                font-mono
                                text-sm
                                text-[#b9d06d]
                                outline-none
                                placeholder:text-[#4f5c3b]
                                focus:border-[#71833f]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        />

                        <div
                            className="
                                mt-2
                                flex
                                justify-end
                                text-[9px]
                                text-[#4f5c3b]
                            "
                        >
                            {description.length}/500
                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-[#20281a]
                            pt-5
                        "
                    >

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={
                                isCreatingOrganization
                            }
                            className="
                                h-10
                                border
                                border-[#39452b]
                                px-5
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-[#718044]
                                transition
                                hover:bg-[#151b13]
                                hover:text-[#b9d06d]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                !name.trim() ||
                                isCreatingOrganization
                            }
                            className="
                                h-10
                                border
                                border-[#71833f]
                                bg-[#27321e]
                                px-6
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-[#b9d06d]
                                transition
                                hover:bg-[#303d24]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            {isCreatingOrganization
                                ? "Creating..."
                                : "Create Organization"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}