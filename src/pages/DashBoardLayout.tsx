import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardHeader from "../components/DashBoardHeader";
import DashboardSidebar from "../components/DashBoardSidebar";
import CreateOrganizationModal from "./dashboard/CreateOrganizationModal";

import { useDashboardStore } from "../stores/useDashStore";


function DashboardLayout() {

    const [isCreateOrgOpen, setIsCreateOrgOpen] =
        useState(false);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    const fetchOrganizations =
        useDashboardStore(
            (state) => state.fetchOrganizations
        );


    useEffect(() => {

        fetchOrganizations();

    }, [fetchOrganizations]);


    return (
        <div
            className="
                min-h-screen
                bg-[#0c100c]
                text-[#b9d06d]
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <DashboardHeader
                onCreateOrganization={() =>
                    setIsCreateOrgOpen(true)
                }
                onMobileMenuToggle={() =>
                    setSidebarOpen(
                        (previous) =>
                            !previous
                    )
                }
            />


            {/* =================================================
                SIDEBAR + MAIN CONTENT
            ================================================= */}

            <div className="flex">

                <DashboardSidebar
                    isOpen={sidebarOpen}
                    onToggle={() =>
                        setSidebarOpen(
                            (previous) =>
                                !previous
                        )
                    }
                />


                <main
                    className="
                        min-w-0
                        flex-1
                        overflow-x-hidden
                    "
                >

                    <Outlet />

                </main>

            </div>


            {/* =================================================
                CREATE ORGANIZATION MODAL
            ================================================= */}

            <CreateOrganizationModal
                isOpen={isCreateOrgOpen}
                onClose={() =>
                    setIsCreateOrgOpen(false)
                }
            />

        </div>
    );
}

export default DashboardLayout;