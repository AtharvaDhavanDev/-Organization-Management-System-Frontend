import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

/* =========================================================
   TYPES
========================================================= */

export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "DONE";

export type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH";


/* =========================================================
   ORGANIZATION
========================================================= */

export interface Organization {
    org_id: string;
    name: string;
    slug: string;
    description: string | null;
    role: Role;
    created_at: string;
}


/* =========================================================
   MEMBER
========================================================= */

export interface Member {
    user_id: string;
    name: string;
    email: string;
    role: Role;
}


/* =========================================================
   PROJECT
========================================================= */

export interface Project {
    project_id: string;
    organization_id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
    created_by: string;
    created_at: string;
    updated_at?: string;
}


/* =========================================================
   TASK
========================================================= */

export interface Task {
    task_id: string;
    project_id: string;

    title: string;
    description: string;

    task_key: string;

    status: TaskStatus;
    priority: TaskPriority;

    assigned_to?: string | null;

    created_by: string;

    due_date: string;

    created_at?: string;
    updated_at?: string;
}


/* =========================================================
   NOTIFICATION
========================================================= */

export interface Notification {
    notification_id: string;
    user_id: string;

    type: string;
    message: string;

    reference_id?: string | null;

    created_at: string;
}


export interface Comment {
    comment_id: string;
    task_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    user_name: string;
    user_email: string;
}


export interface Invitation {
    token: string;
    email: string;
    role: Role;
    expires_at: string;
    org_id: string;
    organization_name: string;
    organization_slug: string;
    invited_by_name: string | null;
}


export interface TaskStatistics {
    total_tasks: string;
    completed_tasks: string;
    in_progress_tasks: string;
    todo_tasks: string;
}

export interface DashboardData {
    organization: Organization;
    taskStatistics: TaskStatistics;
    totalMembers: string;
    totalProjects: string;
}


/* =========================================================
   ERROR HANDLER
========================================================= */

const getErrorMessage = (
    error: unknown,
    fallback: string
) => {

    if (axios.isAxiosError(error)) {

        return (
            error.response?.data?.msg ||
            error.response?.data?.message ||
            fallback
        );
    }

    return fallback;
};


/* =========================================================
   STORE
========================================================= */

interface DashboardState {

    /* =====================================================
       ORGANIZATIONS
    ===================================================== */

    organizations: Organization[];

    selectedOrganization: Organization | null;


    /* =====================================================
       MEMBERS
    ===================================================== */

    members: Member[];


    /* =====================================================
       PROJECTS
    ===================================================== */

    projects: Project[];

    selectedProject: Project | null;


    /* =====================================================
       TASKS
    ===================================================== */

    tasks: Task[];


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    notifications: Notification[];

    invitations: Invitation[];


    dashboard: DashboardData | null;

    isLoadingDashboard: boolean;

    fetchDashboard: (
        orgId: string
    ) => Promise<void>;


    /* =====================================================
       LOADING STATES
    ===================================================== */

    isLoadingOrganizations: boolean;

    isLoadingOrganization: boolean;

    isLoadingMembers: boolean;

    isLoadingProjects: boolean;

    isLoadingTasks: boolean;

    isLoadingNotifications: boolean;

    isCreatingOrganization: boolean;

    isCreatingProject: boolean;

    isCreatingTask: boolean;

    isUpdatingTask: boolean;

    isDeletingTask: boolean;


    /* =====================================================
       TASK PAGINATION
    ===================================================== */

    taskPage: number;

    taskLimit: number;

    totalTasks: number;

    totalTaskPages: number;


    /* =====================================================
       ORGANIZATION ACTIONS
    ===================================================== */

    fetchOrganizations: () => Promise<void>;

    selectOrganization: (
        organization: Organization | null
    ) => Promise<void>;

    fetchOrganization: (
        orgId: string
    ) => Promise<void>;

    createOrganization: (
        data: {
            name: string;
            description?: string | null;
        }
    ) => Promise<Organization | null>;


    /* =====================================================
       MEMBER ACTIONS
    ===================================================== */

    fetchMembers: (
        orgId: string
    ) => Promise<void>;


    /* =====================================================
       PROJECT ACTIONS
    ===================================================== */

    fetchProjects: (
        orgId: string,
        status?: ProjectStatus
    ) => Promise<void>;

    selectProject: (
        project: Project | null
    ) => Promise<void>;

    createProject: (
        orgId: string,
        data: {
            name: string;
            description?: string | null;
        }
    ) => Promise<Project | null>;


    /* =====================================================
       TASK ACTIONS
    ===================================================== */

    fetchTasks: (
        projectId: string,
        page?: number,
        limit?: number
    ) => Promise<void>;

    createTask: (
        projectId: string,
        data: {
            title: string;
            description: string;
            status: TaskStatus;
            priority: TaskPriority;
            assigned_to?: string;
            due_date: string;
        }
    ) => Promise<Task | null>;

    updateTask: (
        projectId: string,
        taskId: string,
        data: {
            title?: string;
            description?: string;
            priority?: TaskPriority;
            due_date?: string;
        }
    ) => Promise<Task | null>;

    updateTaskStatus: (
        projectId: string,
        taskId: string,
        status: TaskStatus
    ) => Promise<Task | null>;

    assignTask: (
        projectId: string,
        taskId: string,
        assigned_to: string
    ) => Promise<Task | null>;

    deleteTask: (
        projectId: string,
        taskId: string
    ) => Promise<boolean>;


    /* =====================================================
       COMMENT ACTIONS
    ===================================================== */

    comments: Comment[];

    isLoadingComments: boolean;
    isCreatingComment: boolean;
    isUpdatingComment: boolean;
    isDeletingComment: boolean;

    fetchComments: (
        taskId: string,
        page?: number,
        limit?: number
    ) => Promise<void>;

    createComment: (
        taskId: string,
        content: string
    ) => Promise<Comment | null>;

    updateComment: (
        commentId: string,
        content: string
    ) => Promise<Comment | null>;

    deleteComment: (
        commentId: string
    ) => Promise<boolean>;


    /* =====================================================
       NOTIFICATION ACTIONS
    ===================================================== */

    fetchNotifications: () => Promise<void>;

    fetchInvitations: () => Promise<void>;

    acceptInvitation: (
        token: string
    ) => Promise<boolean>;


    /* =====================================================
       ROLE / PERMISSION HELPERS
    ===================================================== */

    isAdmin: () => boolean;

    isManager: () => boolean;

    isMember: () => boolean;

    canCreateTask: () => boolean;

    canUpdateTask: () => boolean;

    canAssignTask: () => boolean;

    canDeleteTask: () => boolean;

    canManageProject: () => boolean;

    canManageMembers: () => boolean;


    /* =====================================================
       CLEAR
    ===================================================== */

    clearDashboard: () => void;
}


/* =========================================================
   STORE IMPLEMENTATION
========================================================= */

export const useDashboardStore =
    create<DashboardState>((set, get) => ({

        /* =====================================================
           INITIAL STATE
        ===================================================== */

        organizations: [],

        selectedOrganization: null,

        members: [],

        projects: [],

        selectedProject: null,

        tasks: [],

        notifications: [],
        invitations: [],

        comments: [],
        isLoadingComments: false,
        isCreatingComment: false,
        isUpdatingComment: false,
        isDeletingComment: false,

        dashboard: null,

        isLoadingDashboard: false,


        /* =====================================================
           LOADING STATES
        ===================================================== */

        isLoadingOrganizations: false,

        isLoadingOrganization: false,

        isLoadingMembers: false,

        isLoadingProjects: false,

        isLoadingTasks: false,

        isLoadingNotifications: false,

        isCreatingOrganization: false,

        isCreatingProject: false,

        isCreatingTask: false,

        isUpdatingTask: false,

        isDeletingTask: false,


        /* =====================================================
           PAGINATION
        ===================================================== */

        taskPage: 1,

        taskLimit: 10,

        totalTasks: 0,

        totalTaskPages: 0,


        /* =====================================================
           FETCH DASHBOARD
        ===================================================== */

        fetchDashboard: async (orgId) => {

            set({
                isLoadingDashboard: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        `/dashboard/${orgId}`
                    );

                set({
                    dashboard:
                        response.data.data
                });

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch dashboard"
                    )
                );

                console.error(
                    "fetchDashboard failed:",
                    error
                );

            } finally {

                set({
                    isLoadingDashboard: false
                });
            }
        },


        /* =====================================================
           FETCH ORGANIZATIONS
        ===================================================== */

        fetchOrganizations: async () => {

            set({
                isLoadingOrganizations: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        "/organizations"
                    );

                const organizations: Organization[] =
                    response.data.data ?? [];


                /*
                 * Get the organization that the user
                 * selected before refreshing the page.
                 */
                const savedOrgId =
                    localStorage.getItem(
                        "selectedOrganizationId"
                    );


                /*
                 * Try to restore the previously selected
                 * organization.
                 */
                const savedOrganization =
                    savedOrgId
                        ? organizations.find(
                            (organization) =>
                                organization.org_id ===
                                savedOrgId
                        )
                        : null;


                /*
                 * If the saved organization no longer
                 * exists, fall back to the first one.
                 */
                const organizationToSelect =
                    savedOrganization ??
                    organizations[0] ??
                    null;


                /*
                 * Replace organization-specific state
                 * with data belonging to the CURRENT user.
                 */
                set({

                    organizations,

                    selectedOrganization: null,

                    selectedProject: null,

                    members: [],

                    projects: [],

                    tasks: [],

                    dashboard: null,

                    taskPage: 1,

                    totalTasks: 0,

                    totalTaskPages: 0,

                });


                /*
                 * Restore the previous organization.
                 */
                if (organizationToSelect) {

                    await get().selectOrganization(
                        organizationToSelect
                    );

                } else {

                    /*
                     * User isn't part of any organization.
                     *
                     * Remove stale organization selection.
                     */
                    localStorage.removeItem(
                        "selectedOrganizationId"
                    );
                }


            } catch (error) {

                /*
                 * If fetching organizations fails,
                 * clear stale organization state.
                 */
                set({

                    organizations: [],

                    selectedOrganization: null,

                    selectedProject: null,

                    members: [],

                    projects: [],

                    tasks: [],

                    dashboard: null,

                    taskPage: 1,

                    totalTasks: 0,

                    totalTaskPages: 0,

                });


                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch organizations"
                    )
                );


                console.error(
                    "fetchOrganizations failed:",
                    error
                );


            } finally {

                set({
                    isLoadingOrganizations: false
                });

            }
        },


        /* =====================================================
           SELECT ORGANIZATION
        ===================================================== */

        selectOrganization: async (
            organization
        ) => {

            /*
             * Save the selected organization so it
             * survives page refreshes.
             */
            if (organization) {

                localStorage.setItem(
                    "selectedOrganizationId",
                    organization.org_id
                );

            } else {

                localStorage.removeItem(
                    "selectedOrganizationId"
                );
            }


            /*
             * Clear old organization data first.
             */

            set({

                selectedOrganization:
                    organization,

                selectedProject:
                    null,

                members: [],
                projects: [],
                tasks: [],
                comments: [],

                taskPage: 1,

                totalTasks: 0,

                totalTaskPages: 0,

                dashboard: null,

            });


            if (!organization) {
                return;
            }


            /*
             * Fetch everything required for
             * the selected organization.
             */

            await Promise.all([

                get().fetchOrganization(
                    organization.org_id
                ),

                get().fetchMembers(
                    organization.org_id
                ),

                get().fetchProjects(
                    organization.org_id
                ),

                get().fetchDashboard(
                    organization.org_id
                )

            ]);
        },


        /* =====================================================
           FETCH SINGLE ORGANIZATION
        ===================================================== */

        fetchOrganization: async (
            orgId
        ) => {

            set({
                isLoadingOrganization: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        `/organizations/${orgId}`
                    );

                const organization:
                    Organization =
                    response.data.data;


                set({

                    selectedOrganization:
                        organization,

                    organizations:
                        get().organizations.map(
                            (org) =>
                                org.org_id ===
                                organization.org_id
                                    ? organization
                                    : org
                        )

                });

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch organization"
                    )
                );

                console.error(
                    "fetchOrganization failed:",
                    error
                );

            } finally {

                set({
                    isLoadingOrganization: false
                });
            }
        },


        /* =====================================================
           CREATE ORGANIZATION
        ===================================================== */

        createOrganization: async (
            data
        ) => {

            set({
                isCreatingOrganization: true
            });

            try {

                const response =
                    await axiosInstance.post(
                        "/organizations",
                        data
                    );


                /*
                 * Backend returns:
                 *
                 * data: {
                 *    org,
                 *    orgMember
                 * }
                 */

                const backendData =
                    response.data.data;


                const organization:
                    Organization = {

                    ...backendData.org,

                    role:
                        backendData.orgMember?.role ??
                        "ADMIN"

                };


                set((state) => ({

                    organizations: [
                        organization,
                        ...state.organizations
                    ]

                }));


                toast.success(
                    response.data.message ||
                    "Organization created successfully ✅"
                );


                /*
                 * Automatically switch
                 * dashboard to new organization.
                 */

                await get().selectOrganization(
                    organization
                );


                return organization;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to create organization"
                    )
                );

                console.error(
                    "createOrganization failed:",
                    error
                );

                return null;

            } finally {

                set({
                    isCreatingOrganization: false
                });
            }
        },


        /* =====================================================
           FETCH MEMBERS
        ===================================================== */

        fetchMembers: async (
            orgId
        ) => {

            set({
                isLoadingMembers: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        `/organizations/${orgId}/members`
                    );


                set({
                    members:
                        response.data.data ?? []
                });

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch members"
                    )
                );

                console.error(
                    "fetchMembers failed:",
                    error
                );

            } finally {

                set({
                    isLoadingMembers: false
                });
            }
        },


        /* =====================================================
           FETCH PROJECTS
        ===================================================== */

        fetchProjects: async (
            orgId,
            status = "ACTIVE"
        ) => {

            set({
                isLoadingProjects: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        `/organizations/${orgId}/projects`,
                        {
                            params: {
                                status
                            }
                        }
                    );


                set({
                    projects:
                        response.data.data ?? []
                });

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch projects"
                    )
                );

                console.error(
                    "fetchProjects failed:",
                    error
                );

            } finally {

                set({
                    isLoadingProjects: false
                });
            }
        },


        /* =====================================================
           SELECT PROJECT
        ===================================================== */

        selectProject: async (
            project
        ) => {

            set({

                selectedProject:
                    project,

                tasks: [],
                comments: [],

                taskPage: 1,

                totalTasks: 0,

                totalTaskPages: 0

            });


            if (!project) {
                return;
            }


            await get().fetchTasks(
                project.project_id,
                1,
                get().taskLimit
            );
        },


        /* =====================================================
           CREATE PROJECT
        ===================================================== */

        createProject: async (
            orgId,
            data
        ) => {

            set({
                isCreatingProject: true
            });

            try {

                const response =
                    await axiosInstance.post(
                        `/organizations/${orgId}/projects`,
                        data
                    );


                const project:
                    Project =
                    response.data.data;


                set((state) => ({

                    projects: [
                        project,
                        ...state.projects
                    ],

                    selectedProject:
                        project

                }));


                toast.success(
                    response.data.message ||
                    "Project created successfully ✅"
                );


                /*
                 * Load tasks for the new project.
                 */

                await get().fetchTasks(
                    project.project_id,
                    1,
                    get().taskLimit
                );


                return project;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to create project"
                    )
                );

                console.error(
                    "createProject failed:",
                    error
                );

                return null;

            } finally {

                set({
                    isCreatingProject: false
                });
            }
        },


        /* =====================================================
           FETCH TASKS
        ===================================================== */

        fetchTasks: async (
            projectId,
            page = 1,
            limit = get().taskLimit
        ) => {

            set({
                isLoadingTasks: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        `/projects/${projectId}/tasks`,
                        {
                            params: {
                                page,
                                limit
                            }
                        }
                    );


                const data =
                    response.data.data;


                set({

                    tasks:
                        data?.tasks ?? [],

                    taskPage:
                        data?.currentPage ?? page,

                    taskLimit:
                        data?.limit ?? limit,

                    totalTasks:
                        data?.totalTasks ?? 0,

                    totalTaskPages:
                        data?.totalPages ?? 0

                });

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch tasks"
                    )
                );

                console.error(
                    "fetchTasks failed:",
                    error
                );

            } finally {

                set({
                    isLoadingTasks: false
                });
            }
        },


        /* =====================================================
           CREATE TASK
        ===================================================== */

        createTask: async (
            projectId,
            data
        ) => {

            /*
             * Frontend permission check.
             *
             * Backend STILL checks this too.
             */

            if (!get().canCreateTask()) {

                toast.error(
                    "You are not authorized to create tasks."
                );

                return null;
            }


            set({
                isCreatingTask: true
            });

            try {

                const response =
                    await axiosInstance.post(
                        `/projects/${projectId}/tasks`,
                        data
                    );


                const task:
                    Task =
                    response.data.data;


                /*
                 * Add task immediately
                 * to current list.
                 */

                set((state) => ({

                    tasks: [
                        task,
                        ...state.tasks
                    ],

                    totalTasks:
                        state.totalTasks + 1

                }));


                toast.success(
                    response.data.message ||
                    "Task created successfully ✅"
                );


                return task;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to create task"
                    )
                );

                console.error(
                    "createTask failed:",
                    error
                );

                return null;

            } finally {

                set({
                    isCreatingTask: false
                });
            }
        },


        /* =====================================================
           UPDATE TASK
        ===================================================== */

        updateTask: async (
            projectId,
            taskId,
            data
        ) => {

            if (!get().canUpdateTask()) {

                toast.error(
                    "You are not authorized to update tasks."
                );

                return null;
            }


            set({
                isUpdatingTask: true
            });

            try {

                const response =
                    await axiosInstance.patch(
                        `/projects/${projectId}/tasks/${taskId}`,
                        data
                    );


                const updatedTask:
                    Task =
                    response.data.data;


                set((state) => ({

                    tasks:
                        state.tasks.map(
                            (task) =>
                                task.task_id === taskId
                                    ? updatedTask
                                    : task
                        )

                }));


                toast.success(
                    response.data.message ||
                    "Task updated successfully ✅"
                );


                return updatedTask;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to update task"
                    )
                );

                console.error(
                    "updateTask failed:",
                    error
                );

                return null;

            } finally {

                set({
                    isUpdatingTask: false
                });
            }
        },


        /* =====================================================
           UPDATE TASK STATUS
        ===================================================== */

        updateTaskStatus: async (
            projectId,
            taskId,
            status
        ) => {

            try {

                const response =
                    await axiosInstance.patch(
                        `/projects/${projectId}/tasks/${taskId}/status`,
                        {
                            status
                        }
                    );


                const updatedTask:
                    Task =
                    response.data.data;


                set((state) => ({

                    tasks:
                        state.tasks.map(
                            (task) =>
                                task.task_id === taskId
                                    ? updatedTask
                                    : task
                        )

                }));


                /*
                 * Refresh dashboard statistics so
                 * status changes are immediately
                 * reflected in the dashboard.
                 */
                const organization =
                    get().selectedOrganization;

                if (organization) {

                    await get().fetchDashboard(
                        organization.org_id
                    );

                }


                toast.success(
                    response.data.message ||
                    "Task status updated ✅"
                );


                return updatedTask;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to update task status"
                    )
                );

                console.error(
                    "updateTaskStatus failed:",
                    error
                );

                return null;
            }
        },


        /* =====================================================
           ASSIGN TASK
        ===================================================== */

        assignTask: async (
            projectId,
            taskId,
            assigned_to
        ) => {

            if (!get().canAssignTask()) {

                toast.error(
                    "You are not authorized to assign tasks."
                );

                return null;
            }


            try {

                const response =
                    await axiosInstance.patch(
                        `/projects/${projectId}/tasks/${taskId}/assign`,
                        {
                            assigned_to
                        }
                    );


                const updatedTask:
                    Task =
                    response.data.data;


                set((state) => ({

                    tasks:
                        state.tasks.map(
                            (task) =>
                                task.task_id === taskId
                                    ? {
                                        ...task,
                                        ...updatedTask
                                    }
                                    : task
                        )

                }));


                toast.success(
                    response.data.message ||
                    "Task assigned successfully ✅"
                );


                return updatedTask;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to assign task"
                    )
                );

                console.error(
                    "assignTask failed:",
                    error
                );

                return null;
            }
        },


        /* =====================================================
           DELETE TASK
        ===================================================== */

        deleteTask: async (
            projectId,
            taskId
        ) => {

            if (!get().canDeleteTask()) {

                toast.error(
                    "You are not authorized to delete tasks."
                );

                return false;
            }


            set({
                isDeletingTask: true
            });

            try {

                await axiosInstance.delete(
                    `/projects/${projectId}/tasks/${taskId}`
                );


                set((state) => ({

                    tasks:
                        state.tasks.filter(
                            (task) =>
                                task.task_id !== taskId
                        ),

                    totalTasks:
                        Math.max(
                            0,
                            state.totalTasks - 1
                        )

                }));


                toast.success(
                    "Task deleted successfully ✅"
                );


                return true;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to delete task"
                    )
                );

                console.error(
                    "deleteTask failed:",
                    error
                );

                return false;

            } finally {

                set({
                    isDeletingTask: false
                });
            }
        },


        /* =====================================================
           FETCH COMMENTS
        ===================================================== */

        fetchComments: async (
            taskId,
            page = 1,
            limit = 10
        ) => {

            set({
                isLoadingComments: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        `/tasks/${taskId}/comments`,
                        {
                            params: {
                                page,
                                limit
                            }
                        }
                    );

                const data =
                    response.data.data;

                set({
                    comments:
                        data?.result ??
                        data?.comments ??
                        []
                });

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch comments"
                    )
                );

                console.error(
                    "fetchComments failed:",
                    error
                );

            } finally {

                set({
                    isLoadingComments: false
                });
            }
        },


        /* =====================================================
           CREATE COMMENT
        ===================================================== */

        createComment: async (
            taskId,
            content
        ) => {

            if (!content.trim()) {

                toast.error(
                    "Comment cannot be empty."
                );

                return null;
            }

            set({
                isCreatingComment: true
            });

            try {

                const response =
                    await axiosInstance.post(
                        `/tasks/${taskId}/comments`,
                        {
                            comment: content.trim()
                        }
                    );

                const comment:
                    Comment =
                    response.data.data;

                set((state) => ({
                    comments: [
                        comment,
                        ...state.comments
                    ]
                }));

                return comment;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to add comment"
                    )
                );

                console.error(
                    "createComment failed:",
                    error
                );

                return null;

            } finally {

                set({
                    isCreatingComment: false
                });
            }
        },


        /* =====================================================
           UPDATE COMMENT
        ===================================================== */

        updateComment: async (
            commentId,
            content
        ) => {

            if (!content.trim()) {

                toast.error(
                    "Comment cannot be empty."
                );

                return null;
            }

            set({
                isUpdatingComment: true
            });

            try {

                const response =
                    await axiosInstance.patch(
                        `/comments/${commentId}`,
                        {
                            comment: content.trim()
                        }
                    );

                const updatedComment:
                    Comment =
                    response.data.data;

                set((state) => ({
                    comments:
                        state.comments.map(
                            (comment) =>
                                comment.comment_id ===
                                commentId
                                    ? updatedComment
                                    : comment
                        )
                }));

                return updatedComment;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to update comment"
                    )
                );

                console.error(
                    "updateComment failed:",
                    error
                );

                return null;

            } finally {

                set({
                    isUpdatingComment: false
                });
            }
        },


        /* =====================================================
           DELETE COMMENT
        ===================================================== */

        deleteComment: async (
            commentId
        ) => {

            set({
                isDeletingComment: true
            });

            try {

                await axiosInstance.delete(
                    `/comments/${commentId}`
                );

                set((state) => ({
                    comments:
                        state.comments.filter(
                            (comment) =>
                                comment.comment_id !==
                                commentId
                        )
                }));

                return true;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to delete comment"
                    )
                );

                console.error(
                    "deleteComment failed:",
                    error
                );

                return false;

            } finally {

                set({
                    isDeletingComment: false
                });
            }
        },


        /* =====================================================
           FETCH NOTIFICATIONS
        ===================================================== */

        fetchNotifications: async () => {

            set({
                isLoadingNotifications: true
            });

            try {

                const response =
                    await axiosInstance.get(
                        "/notifications"
                    );


                set({

                    notifications:
                        response.data.data ?? []

                });

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch notifications"
                    )
                );

                console.error(
                    "fetchNotifications failed:",
                    error
                );

            } finally {

                set({
                    isLoadingNotifications: false
                });
            }
        },


        /* =====================================================
           FETCH PENDING INVITATIONS
        ===================================================== */

        fetchInvitations: async () => {

            try {

                const response =
                    await axiosInstance.get(
                        "/invitations"
                    );

                set({
                    invitations:
                        response.data.data ?? []
                });

            } catch (error) {

                console.error(
                    "fetchInvitations failed:",
                    error
                );

            }
        },


        /* =====================================================
           ACCEPT INVITATION
        ===================================================== */

        acceptInvitation: async (
            token
        ) => {

            try {

                const response =
                    await axiosInstance.post(
                        `/invitations/${token}/accept`
                    );


                set((state) => ({
                    invitations:
                        state.invitations.filter(
                            (invitation) =>
                                invitation.token !== token
                        )
                }));


                /*
                 * Refresh organizations so the
                 * accepted organization becomes
                 * available immediately.
                 */

                await get().fetchOrganizations();


                return true;

            } catch (error) {

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to accept invitation"
                    )
                );

                console.error(
                    "acceptInvitation failed:",
                    error
                );

                return false;
            }
        },


        /* =====================================================
           ROLE HELPERS
        ===================================================== */

        isAdmin: () => {

            return (
                get()
                    .selectedOrganization
                    ?.role === "ADMIN"
            );
        },


        isManager: () => {

            return (
                get()
                    .selectedOrganization
                    ?.role === "MANAGER"
            );
        },


        isMember: () => {

            return (
                get()
                    .selectedOrganization
                    ?.role === "MEMBER"
            );
        },


        /* =====================================================
           CAN CREATE TASK

           ADMIN + MANAGER
        ===================================================== */

        canCreateTask: () => {

            const role =
                get()
                    .selectedOrganization
                    ?.role;

            return (
                role === "ADMIN" ||
                role === "MANAGER"
            );
        },


        /* =====================================================
           CAN UPDATE TASK

           ADMIN + MANAGER

           NOTE:
           MEMBER can still update STATUS of their
           assigned task through updateTaskStatus().
        ===================================================== */

        canUpdateTask: () => {

            const role =
                get()
                    .selectedOrganization
                    ?.role;

            return (
                role === "ADMIN" ||
                role === "MANAGER"
            );
        },


        /* =====================================================
           CAN ASSIGN TASK

           ADMIN + MANAGER
        ===================================================== */

        canAssignTask: () => {

            const role =
                get()
                    .selectedOrganization
                    ?.role;

            return (
                role === "ADMIN" ||
                role === "MANAGER"
            );
        },


        /* =====================================================
           CAN DELETE TASK

           ADMIN + MANAGER
        ===================================================== */

        canDeleteTask: () => {

            const role =
                get()
                    .selectedOrganization
                    ?.role;

            return (
                role === "ADMIN" ||
                role === "MANAGER"
            );
        },


        /* =====================================================
           CAN MANAGE PROJECT

           Your backend currently allows ADMIN
           for project creation/update.
        ===================================================== */

        canManageProject: () => {

            const role =
                get()
                    .selectedOrganization
                    ?.role;

            return role === "ADMIN";
        },


        /* =====================================================
           CAN MANAGE MEMBERS

           ADMIN ONLY
        ===================================================== */

        canManageMembers: () => {

            const role =
                get()
                    .selectedOrganization
                    ?.role;

            return role === "ADMIN";
        },


        /* =====================================================
           CLEAR DASHBOARD
        ===================================================== */

        clearDashboard: () => {

            set({

                organizations: [],

                selectedOrganization: null,

                members: [],

                projects: [],

                selectedProject: null,

                tasks: [],
                comments: [],

                notifications: [],
                invitations: [],

                taskPage: 1,

                totalTasks: 0,

                totalTaskPages: 0,

                dashboard: null,

            });
        }

    }));