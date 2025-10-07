
export const can = (systemPermissions: string[], perm:
    "View_Dashboard" |
    "View_Quotations" |
    "Create_Quotations" |
    "Edit_Quotations" |
    "Delete_Quotations" |
    "View_Contracts" |
    "Create_Contracts" |
    "Edit_Contracts" |
    "Delete_Contracts" |
    "View_Payments" |
    "Create_Payments" |
    "Edit_Payments" |
    "Delete_Payments" |
    "View_Users" |
    "Create_Users" |
    "Edit_Users" |
    "Delete_Users" |
    "View_Roles_and_Permissions" |
    "Create_Roles_and_Permissions" |
    "Edit_Roles_and_Permissions" |
    "Delete_Roles_and_Permissions" |
    "QR_Search") =>
    systemPermissions?.some((p) => p === perm) ?? false;
