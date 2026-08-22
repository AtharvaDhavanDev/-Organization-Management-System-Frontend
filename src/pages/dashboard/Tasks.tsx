import {
    ListTodo,
    Plus,
    ChevronLeft,
    ChevronRight,
    X,
    MoreVertical,
    Pencil,
    UserRound,
    Trash2,
    RefreshCw,
    MessageCircle,
    FolderKanban,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useDashboardStore } from "../../stores/useDashStore";
import { useAuthStore } from "../../stores/useAuthStore";
import Comments from "./Comments";


function Tasks() {

    const navigate = useNavigate();


    const selectedProject = useDashboardStore(
        (state) => state.selectedProject
    );

    const selectedOrganization = useDashboardStore(
        (state) => state.selectedOrganization
    );

    const tasks = useDashboardStore(
        (state) => state.tasks
    );

    const members = useDashboardStore(
        (state) => state.members
    );

    const isLoadingTasks = useDashboardStore(
        (state) => state.isLoadingTasks
    );

    const isCreatingTask = useDashboardStore(
        (state) => state.isCreatingTask
    );

    const isUpdatingTask = useDashboardStore(
        (state) => state.isUpdatingTask
    );

    const isDeletingTask = useDashboardStore(
        (state) => state.isDeletingTask
    );

    const taskPage = useDashboardStore(
        (state) => state.taskPage
    );

    const totalTaskPages = useDashboardStore(
        (state) => state.totalTaskPages
    );

    const fetchTasks = useDashboardStore(
        (state) => state.fetchTasks
    );

    const createTask = useDashboardStore(
        (state) => state.createTask
    );

    const updateTask = useDashboardStore(
        (state) => state.updateTask
    );

    const updateTaskStatus = useDashboardStore(
        (state) => state.updateTaskStatus
    );

    const assignTask = useDashboardStore(
        (state) => state.assignTask
    );

    const deleteTask = useDashboardStore(
        (state) => state.deleteTask
    );

    const canCreateTask = useDashboardStore(
        (state) => state.canCreateTask
    );

    const canUpdateTask = useDashboardStore(
        (state) => state.canUpdateTask
    );

    const canAssignTask = useDashboardStore(
        (state) => state.canAssignTask
    );

    const canDeleteTask = useDashboardStore(
        (state) => state.canDeleteTask
    );

    const authUser = useAuthStore(
        (state) => state.authUser
    );


    /* =====================================================
       MODALS
    ===================================================== */

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [showAssignModal, setShowAssignModal] =
        useState(false);

    const [showStatusModal, setShowStatusModal] =
        useState(false);

    const [showCommentsModal, setShowCommentsModal] =
        useState(false);

    const [deleteTaskId, setDeleteTaskId] =
        useState<string | null>(null);


    /* =====================================================
       SELECTED TASK
    ===================================================== */

    const [selectedTaskId, setSelectedTaskId] =
        useState<string | null>(null);


    /* =====================================================
       CREATE FORM
    ===================================================== */

    const [title, setTitle] = useState("");

    const [description, setDescription] =
        useState("");

    const [priority, setPriority] =
        useState<"LOW" | "MEDIUM" | "HIGH">(
            "MEDIUM"
        );

    const [assignedTo, setAssignedTo] =
        useState("");

    const [dueDate, setDueDate] =
        useState("");


    /* =====================================================
       EDIT FORM
    ===================================================== */

    const [editTitle, setEditTitle] =
        useState("");

    const [editDescription, setEditDescription] =
        useState("");

    const [editPriority, setEditPriority] =
        useState<"LOW" | "MEDIUM" | "HIGH">(
            "MEDIUM"
        );

    const [editDueDate, setEditDueDate] =
        useState("");


    /* =====================================================
       ASSIGN FORM
    ===================================================== */

    const [newAssignee, setNewAssignee] =
        useState("");


    /* =====================================================
       STATUS
    ===================================================== */

    const [newStatus, setNewStatus] =
        useState<
            "TODO" |
            "IN_PROGRESS" |
            "DONE"
        >("TODO");


    /* =====================================================
       SELECTED TASK OBJECT
    ===================================================== */

    const selectedTask = tasks.find(
        (task) =>
            task.task_id === selectedTaskId
    );


    /* =====================================================
       NO PROJECT
    ===================================================== */

    if (!selectedProject) {

        return (
            <section
                className="
                    flex
                    min-h-[calc(100vh-68px)]
                    items-center
                    justify-center
                    bg-[#0c100c]
                    px-4
                    py-6
                    font-mono
                    sm:px-6
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        border
                        border-[#303a24]
                        bg-[#101510]
                        p-6
                        text-center
                        sm:p-8
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            border
                            border-[#39452b]
                            bg-[#182012]
                            text-[#718044]
                        "
                    >

                        <FolderKanban
                            size={26}
                            strokeWidth={1.2}
                        />

                    </div>


                    <p
                        className="
                            mt-5
                            text-sm
                            font-bold
                            tracking-wider
                            text-[#b9d06d]
                        "
                    >
                        NO PROJECT SELECTED
                    </p>


                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-sm
                            text-[10px]
                            leading-5
                            text-[#596544]
                            sm:text-xs
                        "
                    >
                        Select a project before viewing
                        or managing its tasks.
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard/projects"
                            )
                        }
                        className="
                            mx-auto
                            mt-6
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            border
                            border-[#71833f]
                            bg-[#182012]
                            px-5
                            py-3
                            text-xs
                            font-bold
                            tracking-wider
                            text-[#b9d06d]
                            transition
                            hover:bg-[#202a18]
                            sm:w-auto
                        "
                    >

                        <FolderKanban
                            size={15}
                        />

                        SELECT PROJECT

                    </button>

                </div>

            </section>
        );
    }


    /* =====================================================
       HELPERS
    ===================================================== */

    const getAssignedUserName = (
        userId?: string | null
    ) => {

        if (!userId) {
            return "UNASSIGNED";
        }

        const member = members.find(
            (member) =>
                member.user_id === userId
        );

        return member?.name || "UNKNOWN USER";
    };


    const getStatusStyle = (
        status: string
    ) => {

        switch (status) {

            case "DONE":
                return "border-[#53652f] text-[#a9c35d]";

            case "IN_PROGRESS":
                return "border-[#6b6331] text-[#c5b75b]";

            default:
                return "border-[#39452b] text-[#718044]";
        }
    };


    const getPriorityStyle = (
        taskPriority: string
    ) => {

        switch (taskPriority) {

            case "HIGH":
                return "text-[#d08070]";

            case "MEDIUM":
                return "text-[#c5b75b]";

            default:
                return "text-[#718044]";
        }
    };


    const isAdminOrManager =
        selectedOrganization?.role === "ADMIN" ||
        selectedOrganization?.role === "MANAGER";


    const isTaskAssignedToMe = (
        assignedToUserId?: string | null
    ) => {

        return (
            !!authUser?.userId &&
            !!assignedToUserId &&
            authUser.userId === assignedToUserId
        );
    };


    /* =====================================================
       CREATE TASK
    ===================================================== */

    const resetCreateForm = () => {

        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setAssignedTo("");
        setDueDate("");
    };


    const closeCreateModal = () => {

        if (isCreatingTask) {
            return;
        }

        resetCreateForm();
        setShowCreateModal(false);
    };


    const handleCreateTask = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!title.trim()) {
            toast.error("Task title is required.");
            return;
        }

        if (!description.trim()) {
            toast.error("Task description is required.");
            return;
        }

        if (!dueDate) {
            toast.error("Due date is required.");
            return;
        }

        const task = await createTask(
            selectedProject.project_id,
            {
                title: title.trim(),
                description: description.trim(),
                status: "TODO",
                priority,
                assigned_to:
                    assignedTo || undefined,
                due_date: dueDate,
            }
        );

        if (task) {

            resetCreateForm();
            setShowCreateModal(false);
        }
    };


    /* =====================================================
       EDIT
    ===================================================== */

    const openEditModal = (
        taskId: string
    ) => {

        const task = tasks.find(
            (item) =>
                item.task_id === taskId
        );

        if (!task) {
            return;
        }

        setSelectedTaskId(task.task_id);

        setEditTitle(task.title);

        setEditDescription(
            task.description
        );

        setEditPriority(
            task.priority
        );

        setEditDueDate(
            task.due_date
                ? task.due_date.slice(0, 10)
                : ""
        );

        setShowEditModal(true);
    };


    const handleUpdateTask = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!selectedTask) {
            return;
        }

        if (!editTitle.trim()) {
            toast.error("Task title is required.");
            return;
        }

        if (!editDescription.trim()) {
            toast.error("Task description is required.");
            return;
        }

        const updatedTask =
            await updateTask(
                selectedProject.project_id,
                selectedTask.task_id,
                {
                    title: editTitle.trim(),
                    description:
                        editDescription.trim(),
                    priority: editPriority,
                    due_date: editDueDate
                }
            );

        if (updatedTask) {

            setShowEditModal(false);
            setSelectedTaskId(null);
        }
    };


    /* =====================================================
       ASSIGN
    ===================================================== */

    const openAssignModal = (
        taskId: string
    ) => {

        const task = tasks.find(
            (item) =>
                item.task_id === taskId
        );

        if (!task) {
            return;
        }

        setSelectedTaskId(task.task_id);

        setNewAssignee(
            task.assigned_to || ""
        );

        setShowAssignModal(true);
    };


    const handleAssignTask = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!selectedTask) {
            return;
        }

        if (!newAssignee) {
            toast.error(
                "Please select a member."
            );
            return;
        }

        const updatedTask =
            await assignTask(
                selectedProject.project_id,
                selectedTask.task_id,
                newAssignee
            );

        if (updatedTask) {

            setShowAssignModal(false);
            setSelectedTaskId(null);
        }
    };


    /* =====================================================
       STATUS
    ===================================================== */

    const openStatusModal = (
        taskId: string
    ) => {

        const task = tasks.find(
            (item) =>
                item.task_id === taskId
        );

        if (!task) {
            return;
        }

        const canChange =
            isAdminOrManager ||
            isTaskAssignedToMe(
                task.assigned_to
            );

        if (!canChange) {

            toast.error(
                "You can only update status of your assigned tasks."
            );

            return;
        }

        setSelectedTaskId(task.task_id);

        setNewStatus(
            task.status
        );

        setShowStatusModal(true);
    };


    const handleUpdateStatus = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!selectedTask) {
            return;
        }

        const canChange =
            isAdminOrManager ||
            isTaskAssignedToMe(
                selectedTask.assigned_to
            );

        if (!canChange) {

            toast.error(
                "You are not authorized to update this task."
            );

            return;
        }

        const updatedTask =
            await updateTaskStatus(
                selectedProject.project_id,
                selectedTask.task_id,
                newStatus
            );

        if (updatedTask) {

            setShowStatusModal(false);
            setSelectedTaskId(null);
        }
    };


    /* =====================================================
       COMMENTS
    ===================================================== */

    const openComments = (
        taskId: string
    ) => {

        setSelectedTaskId(taskId);

        setShowCommentsModal(true);
    };


    const closeComments = () => {

        setShowCommentsModal(false);

        setSelectedTaskId(null);
    };


    /* =====================================================
       DELETE
    ===================================================== */

    const requestDeleteTask = (
        taskId: string
    ) => {

        const task = tasks.find(
            (item) =>
                item.task_id === taskId
        );

        if (!task) {
            return;
        }

        setDeleteTaskId(taskId);

        setSelectedTaskId(null);
    };


    const handleDeleteTask = async () => {

        if (!deleteTaskId) {
            return;
        }

        const task = tasks.find(
            (item) =>
                item.task_id === deleteTaskId
        );

        if (!task) {
            setDeleteTaskId(null);
            return;
        }

        const deleted =
            await deleteTask(
                selectedProject.project_id,
                task.task_id
            );

        if (deleted) {
            setDeleteTaskId(null);
        }
    };


    /* =====================================================
       PAGINATION
    ===================================================== */

    const handlePreviousPage = async () => {

        if (taskPage <= 1) {
            return;
        }

        await fetchTasks(
            selectedProject.project_id,
            taskPage - 1
        );
    };


    const handleNextPage = async () => {

        if (taskPage >= totalTaskPages) {
            return;
        }

        await fetchTasks(
            selectedProject.project_id,
            taskPage + 1
        );
    };


    return (
        <section
            className="
                relative
                min-h-[calc(100vh-68px)]
                overflow-x-hidden
                bg-[#0c100c]
                p-4
                font-mono
                sm:p-6
            "
        >

            {/* =================================================
               HEADER
            ================================================= */}

            <div
                className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    sm:mb-8
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
                        PROJECT
                    </p>

                    <h1
                        className="
                            mt-2
                            truncate
                            text-xl
                            font-bold
                            tracking-wide
                            text-[#b9d06d]
                            sm:text-2xl
                        "
                    >
                        {selectedProject.name}
                    </h1>

                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-[#667541]
                            sm:text-xs
                        "
                    >
                        TASKS
                    </p>

                </div>


                <div
                    className="
                        flex
                        w-full
                        flex-col
                        gap-2
                        sm:flex-row
                        lg:w-auto
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard/projects"
                            )
                        }
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            border
                            border-[#39452b]
                            bg-[#101510]
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            tracking-wider
                            text-[#718044]
                            transition
                            hover:border-[#71833f]
                            hover:bg-[#182012]
                            hover:text-[#b9d06d]
                            sm:w-auto
                        "
                    >

                        <FolderKanban
                            size={15}
                        />

                        SELECT PROJECT

                    </button>


                    {canCreateTask() && (

                        <button
                            type="button"
                            onClick={() =>
                                setShowCreateModal(true)
                            }
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
                            "
                        >

                            <Plus size={15} />

                            CREATE TASK

                        </button>

                    )}

                </div>

            </div>


            {/* =================================================
               LOADING
            ================================================= */}

            {isLoadingTasks && (

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
                        LOADING TASKS...
                    </p>

                </div>

            )}


            {/* =================================================
               EMPTY
            ================================================= */}

            {!isLoadingTasks &&
                tasks.length === 0 && (

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

                        <ListTodo
                            size={32}
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
                            NO TASKS FOUND
                        </p>

                        {canCreateTask() && (

                            <p
                                className="
                                    mt-2
                                    text-[10px]
                                    leading-5
                                    text-[#596544]
                                    sm:text-xs
                                "
                            >
                                Create a task to get started.
                            </p>

                        )}

                    </div>

                )}


            {/* =================================================
               TASK LIST
            ================================================= */}

            {!isLoadingTasks &&
                tasks.length > 0 && (

                    <div
                        className="
                            overflow-visible
                            border
                            border-[#303a24]
                            bg-[#101510]
                        "
                    >

                        <div
                            className="
                                hidden
                                grid-cols-[2fr_1fr_1fr_1.2fr_1fr_40px]
                                gap-4
                                border-b
                                border-[#303a24]
                                px-5
                                py-3
                                text-[10px]
                                tracking-[0.15em]
                                text-[#596544]
                                md:grid
                            "
                        >

                            <span>TASK</span>
                            <span>STATUS</span>
                            <span>PRIORITY</span>
                            <span>ASSIGNED TO</span>
                            <span>DUE DATE</span>
                            <span></span>

                        </div>


                        {tasks.map((task) => {

                            const canChangeStatus =
                                isAdminOrManager ||
                                isTaskAssignedToMe(
                                    task.assigned_to
                                );

                            return (

                                <div
                                    key={task.task_id}
                                    className="
                                        group
                                        border-b
                                        border-[#242d1c]
                                        p-4
                                        transition
                                        last:border-b-0
                                        hover:bg-[#121812]
                                        sm:p-5
                                        md:grid
                                        md:grid-cols-[2fr_1fr_1fr_1.2fr_1fr_40px]
                                        md:items-center
                                        md:gap-4
                                    "
                                >

                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >

                                        <p
                                            className="
                                                break-words
                                                text-sm
                                                font-bold
                                                text-[#b9d06d]
                                            "
                                        >
                                            {task.title}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                text-[#596544]
                                                sm:text-[10px]
                                            "
                                        >
                                            {task.task_key}
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            mt-4
                                            grid
                                            grid-cols-2
                                            gap-3
                                            md:contents
                                        "
                                    >

                                        <div>

                                            <p
                                                className="
                                                    mb-1
                                                    text-[8px]
                                                    tracking-wider
                                                    text-[#596544]
                                                    md:hidden
                                                "
                                            >
                                                STATUS
                                            </p>

                                            <span
                                                className={`
                                                    inline-flex
                                                    border
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    tracking-wider
                                                    ${getStatusStyle(
                                                        task.status
                                                    )}
                                                `}
                                            >
                                                {task.status}
                                            </span>

                                        </div>


                                        <div>

                                            <p
                                                className="
                                                    mb-1
                                                    text-[8px]
                                                    tracking-wider
                                                    text-[#596544]
                                                    md:hidden
                                                "
                                            >
                                                PRIORITY
                                            </p>

                                            <span
                                                className={`
                                                    text-[10px]
                                                    tracking-wider
                                                    ${getPriorityStyle(
                                                        task.priority
                                                    )}
                                                `}
                                            >
                                                {task.priority}
                                            </span>

                                        </div>


                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            <p
                                                className="
                                                    mb-1
                                                    text-[8px]
                                                    tracking-wider
                                                    text-[#596544]
                                                    md:hidden
                                                "
                                            >
                                                ASSIGNED
                                            </p>

                                            <p
                                                className="
                                                    truncate
                                                    text-xs
                                                    text-[#718044]
                                                "
                                            >
                                                {getAssignedUserName(
                                                    task.assigned_to
                                                )}
                                            </p>

                                        </div>


                                        <div>

                                            <p
                                                className="
                                                    mb-1
                                                    text-[8px]
                                                    tracking-wider
                                                    text-[#596544]
                                                    md:hidden
                                                "
                                            >
                                                DUE DATE
                                            </p>

                                            <p
                                                className="
                                                    text-xs
                                                    text-[#718044]
                                                "
                                            >
                                                {task.due_date
                                                    ? new Date(
                                                        task.due_date
                                                    ).toLocaleDateString()
                                                    : "NO DATE"
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            mt-4
                                            flex
                                            justify-end
                                            border-t
                                            border-[#242d1c]
                                            pt-3
                                            md:mt-0
                                            md:border-0
                                            md:pt-0
                                        "
                                    >

                                        <div className="relative">

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setSelectedTaskId(
                                                        selectedTaskId ===
                                                            task.task_id
                                                            ? null
                                                            : task.task_id
                                                    );

                                                }}
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    border
                                                    border-[#303a24]
                                                    text-[#596544]
                                                    transition
                                                    hover:border-[#71833f]
                                                    hover:text-[#b9d06d]
                                                    md:h-8
                                                    md:w-8
                                                    md:border-transparent
                                                "
                                            >

                                                <MoreVertical
                                                    size={17}
                                                />

                                            </button>


                                            {selectedTaskId ===
                                                task.task_id && (

                                                <div
                                                    className="
                                                        absolute
                                                        right-0
                                                        top-10
                                                        z-50
                                                        w-[190px]
                                                        border
                                                        border-[#303a24]
                                                        bg-[#101510]
                                                        py-1
                                                        shadow-2xl
                                                        sm:w-44
                                                        md:top-9
                                                    "
                                                >

                                                    {canChangeStatus && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openStatusModal(
                                                                    task.task_id
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                w-full
                                                                items-center
                                                                gap-3
                                                                px-4
                                                                py-3
                                                                text-left
                                                                text-[10px]
                                                                text-[#718044]
                                                                hover:bg-[#182012]
                                                                hover:text-[#b9d06d]
                                                                sm:py-2.5
                                                                sm:text-xs
                                                            "
                                                        >

                                                            <RefreshCw
                                                                size={14}
                                                            />

                                                            CHANGE STATUS

                                                        </button>

                                                    )}


                                                    {canUpdateTask() && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    task.task_id
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                w-full
                                                                items-center
                                                                gap-3
                                                                px-4
                                                                py-3
                                                                text-left
                                                                text-[10px]
                                                                text-[#718044]
                                                                hover:bg-[#182012]
                                                                hover:text-[#b9d06d]
                                                                sm:py-2.5
                                                                sm:text-xs
                                                            "
                                                        >

                                                            <Pencil
                                                                size={14}
                                                            />

                                                            EDIT TASK

                                                        </button>

                                                    )}


                                                    {canAssignTask() && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openAssignModal(
                                                                    task.task_id
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                w-full
                                                                items-center
                                                                gap-3
                                                                px-4
                                                                py-3
                                                                text-left
                                                                text-[10px]
                                                                text-[#718044]
                                                                hover:bg-[#182012]
                                                                hover:text-[#b9d06d]
                                                                sm:py-2.5
                                                                sm:text-xs
                                                            "
                                                        >

                                                            <UserRound
                                                                size={14}
                                                            />

                                                            ASSIGN TASK

                                                        </button>

                                                    )}


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openComments(
                                                                task.task_id
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            w-full
                                                            items-center
                                                            gap-3
                                                            px-4
                                                            py-3
                                                            text-left
                                                            text-[10px]
                                                            text-[#718044]
                                                            hover:bg-[#182012]
                                                            hover:text-[#b9d06d]
                                                            sm:py-2.5
                                                            sm:text-xs
                                                        "
                                                    >

                                                        <MessageCircle
                                                            size={14}
                                                        />

                                                        COMMENTS

                                                    </button>


                                                    {canDeleteTask() && (

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isDeletingTask
                                                            }
                                                            onClick={() =>
                                                                requestDeleteTask(
                                                                    task.task_id
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                w-full
                                                                items-center
                                                                gap-3
                                                                px-4
                                                                py-3
                                                                text-left
                                                                text-[10px]
                                                                text-[#b66f61]
                                                                hover:bg-[#241713]
                                                                disabled:opacity-40
                                                                sm:py-2.5
                                                                sm:text-xs
                                                            "
                                                        >

                                                            <Trash2
                                                                size={14}
                                                            />

                                                            DELETE TASK

                                                        </button>

                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}


            {/* =================================================
               PAGINATION
            ================================================= */}

            {!isLoadingTasks &&
                tasks.length > 0 && (

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            justify-between
                            gap-3
                            border
                            border-[#303a24]
                            bg-[#101510]
                            px-4
                            py-3
                            sm:mt-5
                            sm:px-5
                        "
                    >

                        <span
                            className="
                                text-[9px]
                                text-[#596544]
                                sm:text-[10px]
                            "
                        >
                            PAGE {taskPage} OF{" "}
                            {totalTaskPages || 1}
                        </span>


                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <button
                                type="button"
                                disabled={
                                    taskPage <= 1
                                }
                                onClick={
                                    handlePreviousPage
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    border
                                    border-[#303a24]
                                    text-[#718044]
                                    hover:border-[#71833f]
                                    hover:text-[#b9d06d]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                    sm:h-8
                                    sm:w-8
                                "
                            >

                                <ChevronLeft
                                    size={15}
                                />

                            </button>


                            <button
                                type="button"
                                disabled={
                                    taskPage >=
                                    totalTaskPages
                                }
                                onClick={
                                    handleNextPage
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    border
                                    border-[#303a24]
                                    text-[#718044]
                                    hover:border-[#71833f]
                                    hover:text-[#b9d06d]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                    sm:h-8
                                    sm:w-8
                                "
                            >

                                <ChevronRight
                                    size={15}
                                />

                            </button>

                        </div>

                    </div>

                )}


            {/* =================================================
               CREATE MODAL
            ================================================= */}

            {showCreateModal && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        overflow-y-auto
                        bg-black/70
                        p-3
                        sm:p-4
                    "
                >

                    <div
                        className="
                            my-auto
                            w-full
                            max-w-lg
                            border
                            border-[#303a24]
                            bg-[#101510]
                            shadow-2xl
                        "
                    >

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

                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        tracking-[0.2em]
                                        text-[#596544]
                                    "
                                >
                                    NEW TASK
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
                                    CREATE TASK
                                </h2>

                            </div>

                            <button
                                type="button"
                                disabled={
                                    isCreatingTask
                                }
                                onClick={
                                    closeCreateModal
                                }
                                className="
                                    shrink-0
                                    text-[#596544]
                                    hover:text-[#b9d06d]
                                "
                            >

                                <X size={18} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleCreateTask
                            }
                            className="
                                space-y-5
                                p-4
                                sm:p-5
                            "
                        >

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        tracking-wider
                                        text-[#718044]
                                        sm:text-[10px]
                                    "
                                >
                                    TITLE
                                </label>

                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    required
                                    placeholder="Enter task title"
                                    className="
                                        w-full
                                        border
                                        border-[#303a24]
                                        bg-[#0c100c]
                                        px-3
                                        py-2.5
                                        text-xs
                                        text-[#b9d06d]
                                        outline-none
                                        placeholder:text-[#465034]
                                        focus:border-[#71833f]
                                    "
                                />

                            </div>


                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        tracking-wider
                                        text-[#718044]
                                        sm:text-[10px]
                                    "
                                >
                                    DESCRIPTION
                                </label>

                                <textarea
                                    value={
                                        description
                                    }
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    required
                                    rows={4}
                                    placeholder="Describe the task..."
                                    className="
                                        w-full
                                        resize-none
                                        border
                                        border-[#303a24]
                                        bg-[#0c100c]
                                        px-3
                                        py-2.5
                                        text-xs
                                        text-[#b9d06d]
                                        outline-none
                                        placeholder:text-[#465034]
                                        focus:border-[#71833f]
                                    "
                                />

                            </div>


                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    sm:grid-cols-2
                                "
                            >

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[9px]
                                            tracking-wider
                                            text-[#718044]
                                            sm:text-[10px]
                                        "
                                    >
                                        PRIORITY
                                    </label>

                                    <select
                                        value={
                                            priority
                                        }
                                        onChange={(e) =>
                                            setPriority(
                                                e.target.value as
                                                    | "LOW"
                                                    | "MEDIUM"
                                                    | "HIGH"
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            bg-[#0c100c]
                                            px-3
                                            py-2.5
                                            text-xs
                                            text-[#b9d06d]
                                            outline-none
                                            focus:border-[#71833f]
                                        "
                                    >

                                        <option value="LOW">
                                            LOW
                                        </option>

                                        <option value="MEDIUM">
                                            MEDIUM
                                        </option>

                                        <option value="HIGH">
                                            HIGH
                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[9px]
                                            tracking-wider
                                            text-[#718044]
                                            sm:text-[10px]
                                        "
                                    >
                                        DUE DATE
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            dueDate
                                        }
                                        onChange={(e) =>
                                            setDueDate(
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            bg-[#0c100c]
                                            px-3
                                            py-2.5
                                            text-xs
                                            text-[#b9d06d]
                                            outline-none
                                            focus:border-[#71833f]
                                        "
                                    />

                                </div>

                            </div>


                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        tracking-wider
                                        text-[#718044]
                                        sm:text-[10px]
                                    "
                                >
                                    ASSIGN TO
                                </label>

                                <select
                                    value={
                                        assignedTo
                                    }
                                    onChange={(e) =>
                                        setAssignedTo(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        border
                                        border-[#303a24]
                                        bg-[#0c100c]
                                        px-3
                                        py-2.5
                                        text-xs
                                        text-[#b9d06d]
                                        outline-none
                                        focus:border-[#71833f]
                                    "
                                >

                                    <option value="">
                                        UNASSIGNED
                                    </option>

                                    {members.map(
                                        (member) => (

                                            <option
                                                key={
                                                    member.user_id
                                                }
                                                value={
                                                    member.user_id
                                                }
                                            >
                                                {member.name}
                                                {" "}
                                                (
                                                {
                                                    member.role
                                                }
                                                )
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-2
                                    border-t
                                    border-[#303a24]
                                    pt-5
                                    sm:flex-row
                                    sm:justify-end
                                    sm:gap-3
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        closeCreateModal
                                    }
                                    disabled={
                                        isCreatingTask
                                    }
                                    className="
                                        w-full
                                        border
                                        border-[#303a24]
                                        px-4
                                        py-2.5
                                        text-xs
                                        text-[#718044]
                                        sm:w-auto
                                    "
                                >
                                    CANCEL
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        isCreatingTask
                                    }
                                    className="
                                        w-full
                                        border
                                        border-[#71833f]
                                        bg-[#182012]
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-bold
                                        text-[#b9d06d]
                                        disabled:opacity-40
                                        sm:w-auto
                                    "
                                >
                                    {isCreatingTask
                                        ? "CREATING..."
                                        : "CREATE TASK"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
               EDIT MODAL
            ================================================= */}

            {showEditModal &&
                selectedTask && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            overflow-y-auto
                            bg-black/70
                            p-3
                            sm:p-4
                        "
                    >

                        <div
                            className="
                                my-auto
                                w-full
                                max-w-lg
                                border
                                border-[#303a24]
                                bg-[#101510]
                                shadow-2xl
                            "
                        >

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

                                <div>

                                    <p
                                        className="
                                            text-[9px]
                                            tracking-[0.2em]
                                            text-[#596544]
                                        "
                                    >
                                        TASK
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
                                        EDIT TASK
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedTaskId(null);
                                    }}
                                    disabled={
                                        isUpdatingTask
                                    }
                                    className="
                                        shrink-0
                                        text-[#596544]
                                        hover:text-[#b9d06d]
                                    "
                                >

                                    <X size={18} />

                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleUpdateTask
                                }
                                className="
                                    space-y-5
                                    p-4
                                    sm:p-5
                                "
                            >

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[9px]
                                            tracking-wider
                                            text-[#718044]
                                            sm:text-[10px]
                                        "
                                    >
                                        TITLE
                                    </label>

                                    <input
                                        value={
                                            editTitle
                                        }
                                        onChange={(e) =>
                                            setEditTitle(
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            bg-[#0c100c]
                                            px-3
                                            py-2.5
                                            text-xs
                                            text-[#b9d06d]
                                            outline-none
                                            focus:border-[#71833f]
                                        "
                                    />

                                </div>


                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[9px]
                                            tracking-wider
                                            text-[#718044]
                                            sm:text-[10px]
                                        "
                                    >
                                        DESCRIPTION
                                    </label>

                                    <textarea
                                        value={
                                            editDescription
                                        }
                                        onChange={(e) =>
                                            setEditDescription(
                                                e.target.value
                                            )
                                        }
                                        required
                                        rows={4}
                                        className="
                                            w-full
                                            resize-none
                                            border
                                            border-[#303a24]
                                            bg-[#0c100c]
                                            px-3
                                            py-2.5
                                            text-xs
                                            text-[#b9d06d]
                                            outline-none
                                            focus:border-[#71833f]
                                        "
                                    />

                                </div>


                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[9px]
                                                tracking-wider
                                                text-[#718044]
                                                sm:text-[10px]
                                            "
                                        >
                                            PRIORITY
                                        </label>

                                        <select
                                            value={
                                                editPriority
                                            }
                                            onChange={(e) =>
                                                setEditPriority(
                                                    e.target.value as
                                                        | "LOW"
                                                        | "MEDIUM"
                                                        | "HIGH"
                                                )
                                            }
                                            className="
                                                w-full
                                                border
                                                border-[#303a24]
                                                bg-[#0c100c]
                                                px-3
                                                py-2.5
                                                text-xs
                                                text-[#b9d06d]
                                                outline-none
                                                focus:border-[#71833f]
                                            "
                                        >

                                            <option value="LOW">
                                                LOW
                                            </option>

                                            <option value="MEDIUM">
                                                MEDIUM
                                            </option>

                                            <option value="HIGH">
                                                HIGH
                                            </option>

                                        </select>

                                    </div>


                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[9px]
                                                tracking-wider
                                                text-[#718044]
                                                sm:text-[10px]
                                            "
                                        >
                                            DUE DATE
                                        </label>

                                        <input
                                            type="date"
                                            value={
                                                editDueDate
                                            }
                                            onChange={(e) =>
                                                setEditDueDate(
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="
                                                w-full
                                                border
                                                border-[#303a24]
                                                bg-[#0c100c]
                                                px-3
                                                py-2.5
                                                text-xs
                                                text-[#b9d06d]
                                                outline-none
                                                focus:border-[#71833f]
                                            "
                                        />

                                    </div>

                                </div>


                                <div
                                    className="
                                        flex
                                        flex-col-reverse
                                        gap-2
                                        border-t
                                        border-[#303a24]
                                        pt-5
                                        sm:flex-row
                                        sm:justify-end
                                        sm:gap-3
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedTaskId(null);
                                        }}
                                        disabled={
                                            isUpdatingTask
                                        }
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            px-4
                                            py-2.5
                                            text-xs
                                            text-[#718044]
                                            sm:w-auto
                                        "
                                    >
                                        CANCEL
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={
                                            isUpdatingTask
                                        }
                                        className="
                                            w-full
                                            border
                                            border-[#71833f]
                                            bg-[#182012]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-[#b9d06d]
                                            disabled:opacity-40
                                            sm:w-auto
                                        "
                                    >
                                        {isUpdatingTask
                                            ? "UPDATING..."
                                            : "SAVE CHANGES"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


            {/* =================================================
               ASSIGN MODAL
            ================================================= */}

            {showAssignModal &&
                selectedTask && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            overflow-y-auto
                            bg-black/70
                            p-3
                            sm:p-4
                        "
                    >

                        <div
                            className="
                                my-auto
                                w-full
                                max-w-md
                                border
                                border-[#303a24]
                                bg-[#101510]
                                shadow-2xl
                            "
                        >

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

                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        text-[#b9d06d]
                                        sm:text-lg
                                    "
                                >
                                    ASSIGN TASK
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedTaskId(null);
                                    }}
                                    className="
                                        shrink-0
                                        text-[#596544]
                                        hover:text-[#b9d06d]
                                    "
                                >
                                    <X size={18} />
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleAssignTask
                                }
                                className="
                                    space-y-5
                                    p-4
                                    sm:p-5
                                "
                            >

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[9px]
                                            tracking-wider
                                            text-[#718044]
                                            sm:text-[10px]
                                        "
                                    >
                                        ASSIGN TO
                                    </label>

                                    <select
                                        value={
                                            newAssignee
                                        }
                                        onChange={(e) =>
                                            setNewAssignee(
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            bg-[#0c100c]
                                            px-3
                                            py-2.5
                                            text-xs
                                            text-[#b9d06d]
                                            outline-none
                                            focus:border-[#71833f]
                                        "
                                    >

                                        <option value="">
                                            SELECT MEMBER
                                        </option>

                                        {members.map(
                                            (member) => (

                                                <option
                                                    key={
                                                        member.user_id
                                                    }
                                                    value={
                                                        member.user_id
                                                    }
                                                >
                                                    {member.name}
                                                    {" "}
                                                    (
                                                    {
                                                        member.role
                                                    }
                                                    )
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div
                                    className="
                                        flex
                                        flex-col-reverse
                                        gap-2
                                        border-t
                                        border-[#303a24]
                                        pt-5
                                        sm:flex-row
                                        sm:justify-end
                                        sm:gap-3
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAssignModal(false);
                                            setSelectedTaskId(null);
                                        }}
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            px-4
                                            py-2.5
                                            text-xs
                                            text-[#718044]
                                            sm:w-auto
                                        "
                                    >
                                        CANCEL
                                    </button>


                                    <button
                                        type="submit"
                                        className="
                                            w-full
                                            border
                                            border-[#71833f]
                                            bg-[#182012]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-[#b9d06d]
                                            sm:w-auto
                                        "
                                    >
                                        ASSIGN
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


            {/* =================================================
               STATUS MODAL
            ================================================= */}

            {showStatusModal &&
                selectedTask && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            overflow-y-auto
                            bg-black/70
                            p-3
                            sm:p-4
                        "
                    >

                        <div
                            className="
                                my-auto
                                w-full
                                max-w-md
                                border
                                border-[#303a24]
                                bg-[#101510]
                                shadow-2xl
                            "
                        >

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

                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        text-[#b9d06d]
                                        sm:text-lg
                                    "
                                >
                                    CHANGE STATUS
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedTaskId(null);
                                    }}
                                    className="
                                        shrink-0
                                        text-[#596544]
                                        hover:text-[#b9d06d]
                                    "
                                >
                                    <X size={18} />
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleUpdateStatus
                                }
                                className="
                                    space-y-5
                                    p-4
                                    sm:p-5
                                "
                            >

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[9px]
                                            tracking-wider
                                            text-[#718044]
                                            sm:text-[10px]
                                        "
                                    >
                                        STATUS
                                    </label>

                                    <select
                                        value={
                                            newStatus
                                        }
                                        onChange={(e) =>
                                            setNewStatus(
                                                e.target.value as
                                                    | "TODO"
                                                    | "IN_PROGRESS"
                                                    | "DONE"
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            bg-[#0c100c]
                                            px-3
                                            py-2.5
                                            text-xs
                                            text-[#b9d06d]
                                            outline-none
                                            focus:border-[#71833f]
                                        "
                                    >

                                        <option value="TODO">
                                            TODO
                                        </option>

                                        <option value="IN_PROGRESS">
                                            IN PROGRESS
                                        </option>

                                        <option value="DONE">
                                            DONE
                                        </option>

                                    </select>

                                </div>


                                <div
                                    className="
                                        flex
                                        flex-col-reverse
                                        gap-2
                                        border-t
                                        border-[#303a24]
                                        pt-5
                                        sm:flex-row
                                        sm:justify-end
                                        sm:gap-3
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowStatusModal(false);
                                            setSelectedTaskId(null);
                                        }}
                                        className="
                                            w-full
                                            border
                                            border-[#303a24]
                                            px-4
                                            py-2.5
                                            text-xs
                                            text-[#718044]
                                            sm:w-auto
                                        "
                                    >
                                        CANCEL
                                    </button>


                                    <button
                                        type="submit"
                                        className="
                                            w-full
                                            border
                                            border-[#71833f]
                                            bg-[#182012]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-[#b9d06d]
                                            sm:w-auto
                                        "
                                    >
                                        UPDATE STATUS
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


            {/* =================================================
               COMMENTS MODAL
            ================================================= */}

            {showCommentsModal &&
                selectedTask && (

                    <Comments
                        taskId={selectedTask.task_id}
                        taskTitle={selectedTask.title}
                        onClose={closeComments}
                    />

                )}


            {/* =================================================
               DELETE TASK CONFIRMATION
            ================================================= */}

            {deleteTaskId &&
                (() => {

                    const taskToDelete =
                        tasks.find(
                            (task) =>
                                task.task_id ===
                                deleteTaskId
                        );

                    if (!taskToDelete) {
                        return null;
                    }

                    return (

                        <div
                            className="
                                fixed
                                inset-0
                                z-[100]
                                flex
                                items-center
                                justify-center
                                overflow-y-auto
                                bg-black/75
                                p-3
                                sm:p-4
                            "
                        >

                            <div
                                className="
                                    my-auto
                                    w-full
                                    max-w-md
                                    border
                                    border-[#4a302c]
                                    bg-[#101510]
                                    shadow-2xl
                                "
                            >

                                <div
                                    className="
                                        border-b
                                        border-[#303a24]
                                        px-4
                                        py-4
                                        sm:px-5
                                    "
                                >

                                    <p
                                        className="
                                            text-[9px]
                                            tracking-[0.2em]
                                            text-[#596544]
                                            sm:text-[10px]
                                        "
                                    >
                                        CONFIRM ACTION
                                    </p>

                                    <h2
                                        className="
                                            mt-1
                                            text-base
                                            font-bold
                                            text-[#d08070]
                                            sm:text-lg
                                        "
                                    >
                                        DELETE TASK
                                    </h2>

                                </div>

                                <div
                                    className="
                                        p-4
                                        sm:p-5
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            leading-6
                                            text-[#718044]
                                        "
                                    >
                                        Are you sure you want to delete{" "}
                                        <span
                                            className="
                                                break-words
                                                font-bold
                                                text-[#b9d06d]
                                            "
                                        >
                                            "{taskToDelete.title}"
                                        </span>
                                        ?
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
                                            This action cannot be undone.
                                        </p>

                                    </div>

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
                                            onClick={() =>
                                                setDeleteTaskId(null)
                                            }
                                            disabled={
                                                isDeletingTask
                                            }
                                            className="
                                                w-full
                                                border
                                                border-[#303a24]
                                                px-4
                                                py-2.5
                                                text-[10px]
                                                font-bold
                                                text-[#596544]
                                                hover:text-[#718044]
                                                disabled:opacity-40
                                                sm:w-auto
                                            "
                                        >
                                            CANCEL
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleDeleteTask
                                            }
                                            disabled={
                                                isDeletingTask
                                            }
                                            className="
                                                w-full
                                                border
                                                border-[#4a302c]
                                                bg-[#211513]
                                                px-4
                                                py-2.5
                                                text-[10px]
                                                font-bold
                                                text-[#c17b70]
                                                hover:bg-[#2a1816]
                                                disabled:opacity-40
                                                sm:w-auto
                                            "
                                        >
                                            {isDeletingTask
                                                ? "DELETING..."
                                                : "DELETE TASK"
                                            }
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    );
                })()}

        </section>
    );
}


export default Tasks;