import { useEffect, useState } from "react";
import {
    FolderKanban,
    Plus,
    ChevronRight,
    X,
    Pencil,
    Archive,
    ArchiveRestore,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useDashboardStore } from "../../stores/useDashStore";
import { axiosInstance } from "../../lib/axios";


function Projects() {

    const navigate = useNavigate();


    // =========================================================
    // STORE
    // =========================================================

    const projects = useDashboardStore(
        (state) => state.projects
    );

    const isLoadingProjects = useDashboardStore(
        (state) => state.isLoadingProjects
    );

    const canManageProject = useDashboardStore(
        (state) => state.canManageProject
    );

    const selectProject = useDashboardStore(
        (state) => state.selectProject
    );

    const selectedOrganization = useDashboardStore(
        (state) => state.selectedOrganization
    );

    const createProject = useDashboardStore(
        (state) => state.createProject
    );

    const fetchProjects = useDashboardStore(
        (state) => state.fetchProjects
    );

    const isCreatingProject = useDashboardStore(
        (state) => state.isCreatingProject
    );


    // =========================================================
    // LOCAL STATE
    // =========================================================

    const [projectView, setProjectView] =
        useState<"ACTIVE" | "ARCHIVED">("ACTIVE");

    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    const [selectedProjectId, setSelectedProjectId] =
        useState<string | null>(null);

    const [projectName, setProjectName] =
        useState("");

    const [projectDescription, setProjectDescription] =
        useState("");

    const [isUpdatingProject, setIsUpdatingProject] =
        useState(false);

    const [isChangingProjectStatus, setIsChangingProjectStatus] =
        useState(false);


    // =========================================================
    // FETCH PROJECTS
    // =========================================================

    useEffect(() => {

        if (!selectedOrganization?.org_id) {
            return;
        }

        fetchProjects(
            selectedOrganization.org_id,
            projectView
        );

    }, [
        selectedOrganization?.org_id,
        projectView,
    ]);


    // =========================================================
    // PROJECT CLICK
    // =========================================================

    const handleProjectClick = async (
        project: typeof projects[number]
    ) => {

        if (project.status === "ARCHIVED") {
            return;
        }

        await selectProject(project);

        navigate("/dashboard/tasks");
    };


    // =========================================================
    // CREATE MODAL
    // =========================================================

    const openCreateModal = () => {

        setProjectName("");
        setProjectDescription("");

        setIsCreateModalOpen(true);
    };


    const closeCreateModal = () => {

        if (isCreatingProject) {
            return;
        }

        setIsCreateModalOpen(false);

        setProjectName("");
        setProjectDescription("");
    };


    // =========================================================
    // CREATE PROJECT
    // =========================================================

    const handleCreateProject = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        const name =
            projectName.trim();

        const description =
            projectDescription.trim();

        if (!name) {
            return;
        }

        if (!selectedOrganization?.org_id) {
            return;
        }

        const project =
            await createProject(
                selectedOrganization.org_id,
                {
                    name,
                    description,
                }
            );

        if (!project) {
            return;
        }

        setIsCreateModalOpen(false);

        setProjectName("");
        setProjectDescription("");

        await fetchProjects(
            selectedOrganization.org_id,
            "ACTIVE"
        );
    };


    // =========================================================
    // EDIT PROJECT
    // =========================================================

    const openEditModal = (
        event: React.MouseEvent,
        project: typeof projects[number]
    ) => {

        event.stopPropagation();

        setSelectedProjectId(
            project.project_id
        );

        setProjectName(
            project.name
        );

        setProjectDescription(
            project.description ?? ""
        );

        setIsEditModalOpen(true);
    };


    const closeEditModal = () => {

        if (isUpdatingProject) {
            return;
        }

        setIsEditModalOpen(false);

        setSelectedProjectId(null);

        setProjectName("");
        setProjectDescription("");
    };


    const handleUpdateProject = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (!selectedOrganization?.org_id) {
            return;
        }

        if (!selectedProjectId) {
            return;
        }

        const name =
            projectName.trim();

        const description =
            projectDescription.trim();

        if (!name) {
            return;
        }

        setIsUpdatingProject(true);

        try {

            const response =
                await axiosInstance.patch(
                    `/organizations/${selectedOrganization.org_id}/projects/${selectedProjectId}`,
                    {
                        name,
                        description,
                    }
                );

            const updatedProject =
                response.data.data;

            useDashboardStore.setState(
                (state) => ({

                    projects:
                        state.projects.map(
                            (project) =>
                                project.project_id ===
                                selectedProjectId
                                    ? updatedProject
                                    : project
                        ),

                    selectedProject:
                        state.selectedProject?.project_id ===
                        selectedProjectId
                            ? updatedProject
                            : state.selectedProject,

                })
            );

            await fetchProjects(
                selectedOrganization.org_id,
                projectView
            );

            closeEditModal();

        } catch (error: any) {

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                "Failed to update project.";

            console.error(
                "UPDATE PROJECT FAILED:",
                error
            );

            setProjectDescription(
                projectDescription
            );

            console.error(message);

        } finally {

            setIsUpdatingProject(false);

        }
    };


    // =========================================================
    // ARCHIVE / RESTORE
    // =========================================================

    const handleProjectStatusChange = async (
        event: React.MouseEvent,
        project: typeof projects[number]
    ) => {

        event.stopPropagation();

        if (!selectedOrganization?.org_id) {
            return;
        }

        const nextStatus =
            project.status === "ACTIVE"
                ? "ARCHIVED"
                : "ACTIVE";

        setIsChangingProjectStatus(true);

        try {

            const response =
                await axiosInstance.patch(
                    `/organizations/${selectedOrganization.org_id}/projects/${project.project_id}/archive`,
                    {
                        status: nextStatus,
                    }
                );

            const updatedProject =
                response.data.data;

            useDashboardStore.setState(
                (state) => ({

                    selectedProject:
                        state.selectedProject?.project_id ===
                        project.project_id
                            ? updatedProject
                            : state.selectedProject,

                })
            );

            await fetchProjects(
                selectedOrganization.org_id,
                projectView
            );

            if (
                nextStatus === "ARCHIVED" &&
                projectView === "ACTIVE"
            ) {

                useDashboardStore.setState({
                    selectedProject: null,
                    tasks: [],
                    comments: [],
                });

            }

        } catch (error: any) {

            console.error(
                "PROJECT STATUS UPDATE FAILED:",
                error
            );

        } finally {

            setIsChangingProjectStatus(false);

        }
    };


    // =========================================================
    // RENDER
    // =========================================================

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

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    sm:mb-8
                    sm:gap-5
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                "
            >

                <div className="min-w-0">

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
                            text-xl
                            font-bold
                            tracking-wide
                            text-[#b9d06d]
                            sm:text-2xl
                        "
                    >
                        PROJECTS
                    </h1>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            leading-5
                            text-[#667541]
                            sm:text-xs
                        "
                    >
                        Manage and access organization projects
                    </p>

                </div>


                <div
                    className="
                        flex
                        w-full
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:flex-wrap
                        sm:items-center
                        sm:gap-3
                        lg:w-auto
                        lg:justify-end
                    "
                >

                    {/* =================================================
                        ACTIVE / ARCHIVED SWITCH
                    ================================================= */}

                    <div
                        className="
                            flex
                            w-full
                            border
                            border-[#303a24]
                            bg-[#101510]
                            sm:w-auto
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setProjectView("ACTIVE")
                            }
                            className={`
                                flex-1
                                px-4
                                py-2.5
                                text-[10px]
                                font-bold
                                tracking-wider
                                transition
                                sm:flex-none
                                sm:py-2
                                ${
                                    projectView === "ACTIVE"
                                        ? "bg-[#182012] text-[#b9d06d]"
                                        : "text-[#596544] hover:text-[#b9d06d]"
                                }
                            `}
                        >
                            ACTIVE
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setProjectView("ARCHIVED")
                            }
                            className={`
                                flex-1
                                px-4
                                py-2.5
                                text-[10px]
                                font-bold
                                tracking-wider
                                transition
                                sm:flex-none
                                sm:py-2
                                ${
                                    projectView === "ARCHIVED"
                                        ? "bg-[#182012] text-[#b9d06d]"
                                        : "text-[#596544] hover:text-[#b9d06d]"
                                }
                            `}
                        >
                            ARCHIVED
                        </button>

                    </div>


                    {/* =================================================
                        CREATE PROJECT
                    ================================================= */}

                    {canManageProject() &&
                        projectView === "ACTIVE" && (

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    border
                                    border-[#71833f]
                                    bg-[#101510]
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    tracking-wider
                                    text-[#b9d06d]
                                    transition
                                    hover:bg-[#182012]
                                    sm:w-auto
                                    sm:py-2
                                "
                            >

                                <Plus size={15} />

                                CREATE PROJECT

                            </button>

                        )}

                </div>

            </div>


            {/* =====================================================
                LOADING
            ===================================================== */}

            {isLoadingProjects && (

                <div
                    className="
                        flex
                        min-h-[260px]
                        items-center
                        justify-center
                        sm:min-h-[300px]
                    "
                >

                    <p
                        className="
                            text-center
                            text-[10px]
                            tracking-widest
                            text-[#718044]
                            sm:text-xs
                        "
                    >
                        LOADING PROJECTS...
                    </p>

                </div>

            )}


            {/* =====================================================
                EMPTY
            ===================================================== */}

            {!isLoadingProjects &&
                projects.length === 0 && (

                    <div
                        className="
                            flex
                            min-h-[260px]
                            flex-col
                            items-center
                            justify-center
                            border
                            border-[#303a24]
                            bg-[#101510]
                            px-5
                            text-center
                            sm:min-h-[300px]
                        "
                    >

                        {projectView === "ARCHIVED" ? (

                            <>

                                <Archive
                                    size={30}
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
                                    NO ARCHIVED PROJECTS
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-[10px]
                                        leading-5
                                        text-[#596544]
                                        sm:text-xs
                                    "
                                >
                                    Archived projects will appear here.
                                </p>

                            </>

                        ) : (

                            <>

                                <FolderKanban
                                    size={30}
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
                                    NO PROJECTS FOUND
                                </p>


                                {canManageProject() && (

                                    <p
                                        className="
                                            mt-2
                                            text-[10px]
                                            leading-5
                                            text-[#596544]
                                            sm:text-xs
                                        "
                                    >
                                        Create your first project to get started.
                                    </p>

                                )}

                            </>

                        )}

                    </div>

                )}


            {/* =====================================================
                PROJECT GRID
            ===================================================== */}

            {!isLoadingProjects &&
                projects.length > 0 && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {projects.map((project) => (

                            <div
                                key={project.project_id}
                                className="
                                    group
                                    min-w-0
                                    border
                                    border-[#303a24]
                                    bg-[#101510]
                                    p-4
                                    transition
                                    hover:border-[#71833f]
                                    sm:p-5
                                "
                            >

                                {/* =================================================
                                    PROJECT HEADER
                                ================================================= */}

                                <button
                                    type="button"
                                    disabled={
                                        project.status === "ARCHIVED"
                                    }
                                    onClick={() =>
                                        handleProjectClick(project)
                                    }
                                    className="
                                        flex
                                        w-full
                                        min-w-0
                                        items-start
                                        justify-between
                                        gap-3
                                        text-left
                                        disabled:cursor-default
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
                                                border-[#39452b]
                                                text-[#71833f]
                                            "
                                        >

                                            <FolderKanban
                                                size={17}
                                                strokeWidth={1.5}
                                            />

                                        </div>


                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            <h2
                                                className="
                                                    max-w-full
                                                    truncate
                                                    text-sm
                                                    font-bold
                                                    text-[#b9d06d]
                                                "
                                            >
                                                {project.name}
                                            </h2>


                                            <p
                                                className="
                                                    mt-1
                                                    text-[9px]
                                                    text-[#596544]
                                                    sm:text-[10px]
                                                "
                                            >
                                                {project.status}
                                            </p>

                                        </div>

                                    </div>


                                    {project.status === "ACTIVE" && (

                                        <ChevronRight
                                            size={16}
                                            className="
                                                shrink-0
                                                text-[#596544]
                                                transition
                                                group-hover:translate-x-1
                                                group-hover:text-[#b9d06d]
                                            "
                                        />

                                    )}

                                </button>


                                {/* =================================================
                                    DESCRIPTION
                                ================================================= */}

                                <p
                                    className="
                                        mt-4
                                        min-h-[40px]
                                        break-words
                                        text-[10px]
                                        leading-5
                                        text-[#718044]
                                        sm:mt-5
                                        sm:text-xs
                                    "
                                >
                                    {
                                        project.description ||
                                        "No description provided."
                                    }
                                </p>


                                {/* =================================================
                                    FOOTER
                                ================================================= */}

                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-col
                                        gap-3
                                        border-t
                                        border-[#242d1c]
                                        pt-4
                                        sm:mt-5
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-[9px]
                                            text-[#596544]
                                            sm:text-[10px]
                                        "
                                    >
                                        CREATED{" "}
                                        {new Date(
                                            project.created_at
                                        ).toLocaleDateString()}
                                    </span>


                                    <div
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-end
                                            gap-2
                                            sm:w-auto
                                        "
                                    >

                                        {/* =================================================
                                            EDIT
                                        ================================================= */}

                                        {canManageProject() && (

                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    openEditModal(
                                                        event,
                                                        project
                                                    )
                                                }
                                                disabled={
                                                    isUpdatingProject
                                                }
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    items-center
                                                    justify-center
                                                    border
                                                    border-[#303a24]
                                                    text-[#596544]
                                                    transition
                                                    hover:border-[#71833f]
                                                    hover:text-[#b9d06d]
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-40
                                                "
                                                title="Edit project"
                                            >

                                                <Pencil size={13} />

                                            </button>

                                        )}


                                        {/* =================================================
                                            ARCHIVE / RESTORE
                                        ================================================= */}

                                        {(useDashboardStore.getState().isAdmin() ||
                                            useDashboardStore.getState().isManager()) && (

                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    handleProjectStatusChange(
                                                        event,
                                                        project
                                                    )
                                                }
                                                disabled={
                                                    isChangingProjectStatus
                                                }
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    items-center
                                                    justify-center
                                                    border
                                                    border-[#303a24]
                                                    text-[#596544]
                                                    transition
                                                    hover:border-[#71833f]
                                                    hover:text-[#b9d06d]
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-40
                                                "
                                                title={
                                                    project.status === "ACTIVE"
                                                        ? "Archive project"
                                                        : "Restore project"
                                                }
                                            >

                                                {project.status === "ACTIVE"
                                                    ? (
                                                        <Archive size={13} />
                                                    )
                                                    : (
                                                        <ArchiveRestore size={13} />
                                                    )}

                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}


            {/* =====================================================
                CREATE MODAL
            ===================================================== */}

            {isCreateModalOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[200]
                        flex
                        items-center
                        justify-center
                        overflow-y-auto
                        bg-black/70
                        px-3
                        py-4
                        sm:px-4
                        sm:py-6
                    "
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeCreateModal();
                        }

                    }}
                >

                    <div
                        className="
                            my-auto
                            w-full
                            max-w-lg
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
                                gap-3
                                border-b
                                border-[#303a24]
                                px-4
                                py-4
                                sm:px-5
                            "
                        >

                            <div className="min-w-0">

                                <p
                                    className="
                                        text-[8px]
                                        tracking-[0.2em]
                                        text-[#596544]
                                        sm:text-[9px]
                                    "
                                >
                                    PROJECT
                                </p>


                                <h2
                                    className="
                                        mt-1
                                        text-base
                                        font-bold
                                        text-[#b9d06d]
                                        sm:text-lg
                                    "
                                >
                                    CREATE PROJECT
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={closeCreateModal}
                                disabled={isCreatingProject}
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    text-[#596544]
                                    transition
                                    hover:text-[#b9d06d]
                                    disabled:opacity-50
                                "
                            >

                                <X size={17} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleCreateProject}
                            className="
                                p-4
                                sm:p-5
                            "
                        >

                            <label
                                className="
                                    text-[9px]
                                    tracking-widest
                                    text-[#718044]
                                    sm:text-[10px]
                                "
                            >
                                PROJECT NAME
                            </label>


                            <input
                                type="text"
                                value={projectName}
                                onChange={(event) =>
                                    setProjectName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Website Redesign"
                                autoFocus
                                disabled={isCreatingProject}
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
                                    disabled:opacity-50
                                "
                            />


                            <label
                                className="
                                    mt-5
                                    block
                                    text-[9px]
                                    tracking-widest
                                    text-[#718044]
                                    sm:text-[10px]
                                "
                            >
                                DESCRIPTION
                            </label>


                            <textarea
                                value={projectDescription}
                                onChange={(event) =>
                                    setProjectDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Describe what this project is about..."
                                rows={5}
                                disabled={isCreatingProject}
                                className="
                                    mt-2
                                    w-full
                                    resize-none
                                    border
                                    border-[#303a24]
                                    bg-[#0c100c]
                                    px-3
                                    py-3
                                    text-xs
                                    leading-5
                                    text-[#b9d06d]
                                    outline-none
                                    placeholder:text-[#3f4b32]
                                    focus:border-[#71833f]
                                    disabled:opacity-50
                                "
                            />


                            {/* ORGANIZATION */}

                            <div
                                className="
                                    mt-4
                                    overflow-hidden
                                    border
                                    border-[#242d1c]
                                    bg-[#101510]
                                    px-3
                                    py-3
                                "
                            >

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
                                        mt-1
                                        truncate
                                        text-xs
                                        font-bold
                                        text-[#b9d06d]
                                    "
                                >
                                    {
                                        selectedOrganization?.name ??
                                        "No organization selected"
                                    }
                                </p>

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
                                    onClick={closeCreateModal}
                                    disabled={isCreatingProject}
                                    className="
                                        w-full
                                        border
                                        border-[#303a24]
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-bold
                                        text-[#596544]
                                        hover:border-[#596544]
                                        hover:text-[#b9d06d]
                                        disabled:opacity-50
                                        sm:w-auto
                                    "
                                >
                                    CANCEL
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        isCreatingProject ||
                                        !projectName.trim() ||
                                        !selectedOrganization?.org_id
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        border
                                        border-[#71833f]
                                        bg-[#182012]
                                        px-5
                                        py-2.5
                                        text-xs
                                        font-bold
                                        tracking-wider
                                        text-[#b9d06d]
                                        hover:bg-[#202a18]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                        sm:w-auto
                                    "
                                >

                                    {isCreatingProject
                                        ? "CREATING..."
                                        : "CREATE PROJECT"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =====================================================
                EDIT MODAL
            ===================================================== */}

            {isEditModalOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[200]
                        flex
                        items-center
                        justify-center
                        overflow-y-auto
                        bg-black/70
                        px-3
                        py-4
                        sm:px-4
                        sm:py-6
                    "
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeEditModal();
                        }

                    }}
                >

                    <div
                        className="
                            my-auto
                            w-full
                            max-w-lg
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
                                gap-3
                                border-b
                                border-[#303a24]
                                px-4
                                py-4
                                sm:px-5
                            "
                        >

                            <div className="min-w-0">

                                <p
                                    className="
                                        text-[8px]
                                        tracking-[0.2em]
                                        text-[#596544]
                                        sm:text-[9px]
                                    "
                                >
                                    PROJECT
                                </p>


                                <h2
                                    className="
                                        mt-1
                                        text-base
                                        font-bold
                                        text-[#b9d06d]
                                        sm:text-lg
                                    "
                                >
                                    EDIT PROJECT
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={isUpdatingProject}
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    text-[#596544]
                                    transition
                                    hover:text-[#b9d06d]
                                    disabled:opacity-50
                                "
                            >

                                <X size={17} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleUpdateProject}
                            className="
                                p-4
                                sm:p-5
                            "
                        >

                            <label
                                className="
                                    text-[9px]
                                    tracking-widest
                                    text-[#718044]
                                    sm:text-[10px]
                                "
                            >
                                PROJECT NAME
                            </label>


                            <input
                                type="text"
                                value={projectName}
                                onChange={(event) =>
                                    setProjectName(
                                        event.target.value
                                    )
                                }
                                disabled={isUpdatingProject}
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
                                    disabled:opacity-50
                                "
                            />


                            <label
                                className="
                                    mt-5
                                    block
                                    text-[9px]
                                    tracking-widest
                                    text-[#718044]
                                    sm:text-[10px]
                                "
                            >
                                DESCRIPTION
                            </label>


                            <textarea
                                value={projectDescription}
                                onChange={(event) =>
                                    setProjectDescription(
                                        event.target.value
                                    )
                                }
                                rows={5}
                                disabled={isUpdatingProject}
                                className="
                                    mt-2
                                    w-full
                                    resize-none
                                    border
                                    border-[#303a24]
                                    bg-[#0c100c]
                                    px-3
                                    py-3
                                    text-xs
                                    leading-5
                                    text-[#b9d06d]
                                    outline-none
                                    focus:border-[#71833f]
                                    disabled:opacity-50
                                "
                            />


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
                                    onClick={closeEditModal}
                                    disabled={isUpdatingProject}
                                    className="
                                        w-full
                                        border
                                        border-[#303a24]
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-bold
                                        text-[#596544]
                                        hover:border-[#596544]
                                        hover:text-[#b9d06d]
                                        disabled:opacity-50
                                        sm:w-auto
                                    "
                                >
                                    CANCEL
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        isUpdatingProject ||
                                        !projectName.trim()
                                    }
                                    className="
                                        w-full
                                        border
                                        border-[#71833f]
                                        bg-[#182012]
                                        px-5
                                        py-2.5
                                        text-xs
                                        font-bold
                                        text-[#b9d06d]
                                        hover:bg-[#202a18]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                        sm:w-auto
                                    "
                                >

                                    {isUpdatingProject
                                        ? "SAVING..."
                                        : "SAVE CHANGES"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}


export default Projects;