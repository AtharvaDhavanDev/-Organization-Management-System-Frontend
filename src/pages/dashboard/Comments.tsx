import {
    MessageCircle,
    X,
    Pencil,
    Trash2,
    Send,
    Check,
    AlertTriangle,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from "react";

import toast from "react-hot-toast";

import {
    useDashboardStore,
    type Comment,
} from "../../stores/useDashStore";

import { useAuthStore } from "../../stores/useAuthStore";


interface CommentsProps {
    taskId: string;
    taskTitle: string;
    onClose: () => void;
}


function Comments({
    taskId,
    taskTitle,
    onClose,
}: CommentsProps) {

    const comments =
        useDashboardStore(
            (state) => state.comments
        );

    const isLoadingComments =
        useDashboardStore(
            (state) => state.isLoadingComments
        );

    const isCreatingComment =
        useDashboardStore(
            (state) => state.isCreatingComment
        );

    const isUpdatingComment =
        useDashboardStore(
            (state) => state.isUpdatingComment
        );

    const isDeletingComment =
        useDashboardStore(
            (state) => state.isDeletingComment
        );

    const fetchComments =
        useDashboardStore(
            (state) => state.fetchComments
        );

    const createComment =
        useDashboardStore(
            (state) => state.createComment
        );

    const updateComment =
        useDashboardStore(
            (state) => state.updateComment
        );

    const deleteComment =
        useDashboardStore(
            (state) => state.deleteComment
        );

    const selectedOrganization =
        useDashboardStore(
            (state) => state.selectedOrganization
        );

    const authUser =
        useAuthStore(
            (state) => state.authUser
        );


    const [content, setContent] =
        useState("");

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [editingContent, setEditingContent] =
        useState("");

    const [deleteId, setDeleteId] =
        useState<string | null>(null);


    const commentsContainerRef =
        useRef<HTMLDivElement | null>(null);


    const orderedComments = [
        ...comments,
    ].sort(
        (
            first,
            second
        ) =>
            new Date(
                first.created_at
            ).getTime() -
            new Date(
                second.created_at
            ).getTime()
    );


    useEffect(() => {

        fetchComments(
            taskId,
            1,
            20
        );

    }, [
        taskId,
        fetchComments,
    ]);


    useEffect(() => {

        if (
            isLoadingComments ||
            !commentsContainerRef.current
        ) {
            return;
        }


        const container =
            commentsContainerRef.current;


        requestAnimationFrame(() => {

            container.scrollTo({
                top:
                    container.scrollHeight,
                behavior: "smooth",
            });

        });

    }, [
        orderedComments.length,
        isLoadingComments,
    ]);


    const isAdminOrManager =
        selectedOrganization?.role === "ADMIN" ||
        selectedOrganization?.role === "MANAGER";


    const canEdit = (
        comment: Comment
    ) => {

        return (
            !!authUser?.userId &&
            authUser.userId ===
                comment.user_id
        );
    };


    const canDelete = (
        comment: Comment
    ) => {

        return (
            canEdit(comment) ||
            isAdminOrManager
        );
    };


    const formatTime = (
        value: string
    ) => {

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };


    const handleCreate = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        if (!content.trim()) {

            toast.error(
                "Comment cannot be empty."
            );

            return;
        }


        const result =
            await createComment(
                taskId,
                content
            );


        if (result) {

            setContent("");


            requestAnimationFrame(() => {

                const container =
                    commentsContainerRef.current;

                if (!container) {
                    return;
                }

                container.scrollTo({
                    top:
                        container.scrollHeight,
                    behavior: "smooth",
                });

            });

        }
    };


    const startEditing = (
        comment: Comment
    ) => {

        setEditingId(
            comment.comment_id
        );

        setEditingContent(
            comment.content
        );
    };


    const cancelEditing = () => {

        setEditingId(null);

        setEditingContent("");
    };


    const handleUpdate = async (
        commentId: string
    ) => {

        if (
            !editingContent.trim()
        ) {

            toast.error(
                "Comment cannot be empty."
            );

            return;
        }


        const result =
            await updateComment(
                commentId,
                editingContent
            );


        if (result) {

            cancelEditing();

        }
    };


    const handleDelete = async () => {

        if (!deleteId) {
            return;
        }


        const success =
            await deleteComment(
                deleteId
            );


        if (success) {

            setDeleteId(null);

        }
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-[80]
                flex
                items-center
                justify-center
                bg-black/75
                p-2
                sm:p-4
            "
        >

            {/* MODAL */}

            <div
                className="
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-2xl
                    flex-col
                    border
                    border-[#303a24]
                    bg-[#101510]
                    shadow-2xl
                    sm:max-h-[85vh]
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-3
                        border-b
                        border-[#303a24]
                        px-3
                        py-3
                        sm:items-center
                        sm:px-5
                        sm:py-4
                    "
                >

                    <div className="min-w-0">

                        <p
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                                text-[9px]
                                tracking-[0.2em]
                                text-[#596544]
                                sm:text-[10px]
                            "
                        >

                            <MessageCircle
                                size={12}
                            />

                            COMMENTS

                        </p>


                        <h2
                            className="
                                mt-1
                                break-words
                                text-sm
                                font-bold
                                leading-5
                                text-[#b9d06d]
                                sm:truncate
                                sm:text-lg
                            "
                        >
                            {taskTitle}
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            shrink-0
                            p-1
                            text-[#596544]
                            transition
                            hover:text-[#b9d06d]
                        "
                    >

                        <X size={19} />

                    </button>

                </div>


                {/* COMMENTS LIST */}

                <div
                    ref={
                        commentsContainerRef
                    }
                    className="
                        comments-scroll
                        min-h-0
                        flex-1
                        overflow-y-auto
                        p-3
                        sm:p-5
                    "
                >

                    {isLoadingComments ? (

                        <div
                            className="
                                flex
                                min-h-[220px]
                                items-center
                                justify-center
                                sm:min-h-[260px]
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
                                LOADING COMMENTS...
                            </p>

                        </div>

                    ) : orderedComments.length === 0 ? (

                        <div
                            className="
                                flex
                                min-h-[220px]
                                flex-col
                                items-center
                                justify-center
                                border
                                border-[#242d1c]
                                bg-[#0c100c]
                                px-4
                                text-center
                                sm:min-h-[260px]
                            "
                        >

                            <MessageCircle
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
                                "
                            >
                                NO COMMENTS YET
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-[9px]
                                    text-[#596544]
                                    sm:text-[10px]
                                "
                            >
                                Be the first to comment.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-3">

                            {orderedComments.map(
                                (comment) => (

                                    <CommentItem
                                        key={
                                            comment.comment_id
                                        }

                                        comment={
                                            comment
                                        }

                                        canEdit={
                                            canEdit(
                                                comment
                                            )
                                        }

                                        canDelete={
                                            canDelete(
                                                comment
                                            )
                                        }

                                        isEditing={
                                            editingId ===
                                            comment.comment_id
                                        }

                                        editingContent={
                                            editingContent
                                        }

                                        setEditingContent={
                                            setEditingContent
                                        }

                                        onStartEdit={() =>
                                            startEditing(
                                                comment
                                            )
                                        }

                                        onCancelEdit={
                                            cancelEditing
                                        }

                                        onSaveEdit={() =>
                                            handleUpdate(
                                                comment.comment_id
                                            )
                                        }

                                        onDelete={() =>
                                            setDeleteId(
                                                comment.comment_id
                                            )
                                        }

                                        isUpdating={
                                            isUpdatingComment
                                        }

                                        isDeleting={
                                            isDeletingComment
                                        }

                                        formatTime={
                                            formatTime
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* COMMENT COMPOSER */}

                <form
                    onSubmit={
                        handleCreate
                    }
                    className="
                        shrink-0
                        border-t
                        border-[#303a24]
                        bg-[#0f140f]
                        p-3
                        sm:p-5
                    "
                >

                    <label
                        className="
                            mb-2
                            block
                            text-[9px]
                            tracking-[0.15em]
                            text-[#596544]
                        "
                    >
                        ADD COMMENT
                    </label>


                    <textarea
                        value={content}
                        onChange={(event) =>
                            setContent(
                                event.target.value
                            )
                        }
                        rows={3}
                        maxLength={5000}
                        placeholder="Write a comment..."
                        className="
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
                            placeholder:text-[#465034]
                            focus:border-[#71833f]
                        "
                    />


                    <div
                        className="
                            mt-3
                            flex
                            flex-col-reverse
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <span
                            className="
                                text-[9px]
                                text-[#596544]
                            "
                        >
                            {content.length}/5000
                        </span>


                        <button
                            type="submit"
                            disabled={
                                isCreatingComment ||
                                !content.trim()
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
                                px-4
                                py-2.5
                                text-[10px]
                                font-bold
                                text-[#b9d06d]
                                transition
                                hover:bg-[#202b18]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                sm:w-auto
                                sm:py-2
                            "
                        >

                            <Send size={12} />

                            {isCreatingComment
                                ? "POSTING..."
                                : "POST COMMENT"
                            }

                        </button>

                    </div>

                </form>

            </div>


            {/* DELETE CONFIRMATION */}

            {deleteId && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/80
                        p-3
                        sm:p-4
                    "
                >

                    <div
                        className="
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
                                flex
                                items-center
                                gap-3
                                border-b
                                border-[#303a24]
                                px-4
                                py-4
                                sm:px-5
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

                                <h3
                                    className="
                                        mt-1
                                        text-sm
                                        font-bold
                                        text-[#d08070]
                                    "
                                >
                                    DELETE COMMENT
                                </h3>

                            </div>

                        </div>


                        <div className="p-4 sm:p-5">

                            <p
                                className="
                                    text-xs
                                    leading-6
                                    text-[#718044]
                                "
                            >
                                Are you sure you want to
                                delete this comment?
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
                                    This action cannot be
                                    undone.
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
                                        setDeleteId(
                                            null
                                        )
                                    }
                                    disabled={
                                        isDeletingComment
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
                                        sm:py-2
                                    "
                                >
                                    CANCEL
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        isDeletingComment
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
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
                                        sm:py-2
                                    "
                                >

                                    <Trash2
                                        size={12}
                                    />

                                    {isDeletingComment
                                        ? "DELETING..."
                                        : "DELETE COMMENT"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* CUSTOM SCROLLBAR */}

            <style>
                {`
                    .comments-scroll {
                        scrollbar-width: thin;
                        scrollbar-color: #39452b transparent;
                    }

                    .comments-scroll::-webkit-scrollbar {
                        width: 5px;
                    }

                    .comments-scroll::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    .comments-scroll::-webkit-scrollbar-thumb {
                        background: #39452b;
                        border-radius: 10px;
                    }

                    .comments-scroll::-webkit-scrollbar-thumb:hover {
                        background: #71833f;
                    }
                `}
            </style>

        </div>
    );
}


/* =========================================================
   COMMENT ITEM
========================================================= */

interface CommentItemProps {
    comment: Comment;

    canEdit: boolean;

    canDelete: boolean;

    isEditing: boolean;

    editingContent: string;

    setEditingContent: (
        value: string
    ) => void;

    onStartEdit: () => void;

    onCancelEdit: () => void;

    onSaveEdit: () => void;

    onDelete: () => void;

    isUpdating: boolean;

    isDeleting: boolean;

    formatTime: (
        value: string
    ) => string;
}


function CommentItem({
    comment,
    canEdit,
    canDelete,
    isEditing,
    editingContent,
    setEditingContent,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
    isUpdating,
    isDeleting,
    formatTime,
}: CommentItemProps) {

    return (
        <article
            className="
                border
                border-[#242d1c]
                bg-[#0c100c]
                p-3
                sm:p-4
            "
        >

            {/* HEADER */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                    sm:gap-4
                "
            >

                <div className="min-w-0">

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-2
                            gap-y-1
                        "
                    >

                        <span
                            className="
                                break-words
                                text-xs
                                font-bold
                                text-[#b9d06d]
                            "
                        >
                            {comment.user_name}
                        </span>


                        <span
                            className="
                                break-all
                                text-[8px]
                                text-[#465034]
                                sm:text-[9px]
                            "
                        >
                            {comment.user_email}
                        </span>

                    </div>


                    <p
                        className="
                            mt-1
                            break-words
                            text-[8px]
                            text-[#596544]
                            sm:text-[9px]
                        "
                    >

                        {formatTime(
                            comment.created_at
                        )}

                        {comment.updated_at !==
                            comment.created_at && (

                            <span>
                                {" "}
                                • EDITED
                            </span>

                        )}

                    </p>

                </div>


                {/* ACTIONS */}

                <div
                    className="
                        flex
                        shrink-0
                        gap-1
                    "
                >

                    {canEdit &&
                        !isEditing && (

                            <button
                                type="button"
                                onClick={
                                    onStartEdit
                                }
                                disabled={
                                    isUpdating ||
                                    isDeleting
                                }
                                title="Edit comment"
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    border
                                    border-transparent
                                    text-[#596544]
                                    hover:border-[#303a24]
                                    hover:text-[#b9d06d]
                                    disabled:opacity-40
                                    sm:h-7
                                    sm:w-7
                                "
                            >

                                <Pencil
                                    size={12}
                                />

                            </button>

                        )}


                    {canDelete &&
                        !isEditing && (

                            <button
                                type="button"
                                onClick={
                                    onDelete
                                }
                                disabled={
                                    isUpdating ||
                                    isDeleting
                                }
                                title="Delete comment"
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    border
                                    border-transparent
                                    text-[#795149]
                                    hover:border-[#4a302c]
                                    hover:text-[#c17b70]
                                    disabled:opacity-40
                                    sm:h-7
                                    sm:w-7
                                "
                            >

                                <Trash2
                                    size={12}
                                />

                            </button>

                        )}

                </div>

            </div>


            {/* CONTENT */}

            {isEditing ? (

                <div className="mt-4">

                    <textarea
                        value={
                            editingContent
                        }
                        onChange={(event) =>
                            setEditingContent(
                                event.target.value
                            )
                        }
                        rows={4}
                        maxLength={5000}
                        className="
                            w-full
                            resize-none
                            border
                            border-[#303a24]
                            bg-[#101510]
                            px-3
                            py-2.5
                            text-xs
                            leading-5
                            text-[#b9d06d]
                            outline-none
                            focus:border-[#71833f]
                        "
                    />


                    <div
                        className="
                            mt-3
                            flex
                            flex-col-reverse
                            gap-2
                            sm:flex-row
                            sm:justify-end
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                onCancelEdit
                            }
                            disabled={
                                isUpdating
                            }
                            className="
                                w-full
                                border
                                border-[#303a24]
                                px-3
                                py-2
                                text-[9px]
                                text-[#596544]
                                hover:text-[#718044]
                                disabled:opacity-40
                                sm:w-auto
                                sm:py-1.5
                            "
                        >
                            CANCEL
                        </button>


                        <button
                            type="button"
                            onClick={
                                onSaveEdit
                            }
                            disabled={
                                isUpdating ||
                                !editingContent.trim()
                            }
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-1.5
                                border
                                border-[#71833f]
                                bg-[#182012]
                                px-3
                                py-2
                                text-[9px]
                                font-bold
                                text-[#b9d06d]
                                disabled:opacity-40
                                sm:w-auto
                                sm:py-1.5
                            "
                        >

                            <Check
                                size={11}
                            />

                            {isUpdating
                                ? "SAVING..."
                                : "SAVE"
                            }

                        </button>

                    </div>

                </div>

            ) : (

                <p
                    className="
                        mt-4
                        whitespace-pre-wrap
                        break-words
                        text-xs
                        leading-6
                        text-[#718044]
                    "
                >
                    {comment.content}
                </p>

            )}

        </article>
    );
}


export default Comments;