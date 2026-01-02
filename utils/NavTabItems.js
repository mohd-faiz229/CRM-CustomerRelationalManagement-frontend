export const NavTabItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        allowedRoles: ["Admin", "Counsellor", "Hr"],
    },
    {
        label: "Students",
        path: "/dashboard/students",
        allowedRoles: ["Admin", "Counsellor"],
    },
    {
        label: "Courses",
        path: "/dashboard/courses",
        allowedRoles: ["Admin", "Counsellor"],
    },
    {
        label: "Add Student",
        path: "/dashboard/add-student",
        allowedRoles: ["Admin", "Counsellor"],
    },
    {
        label: "Resumes",
        path: "/dashboard/resumes",
        allowedRoles: ["Admin", "Hr"],
    },
    {
        label: "Add New User",
        path: "/dashboard/create-user",
        allowedRoles: ["Admin"]
    },
    {
        label: "Add New Course",
        path: "/dashboard/add-course",
        allowedRoles: ["Admin", "Counsellor"],
    },
    {
        label: "Placements",
        path: "/dashboard/placements",
        allowedRoles: ["Admin", "Hr"],
    },
    {
        label: "Profile",
        path: "/dashboard/profile",
        allowedRoles: ["Admin", "Counsellor", "Hr"],
    },
    {
        label: "Alumni",
        path: "/dashboard/alumni",
        allowedRoles: ["Admin", "Counsellor"],
    },
    {
        label: "Students",
        path: "/dashboard/students",
        allowedRoles: ["Admin", "Counsellor","Hr"],
    }
];