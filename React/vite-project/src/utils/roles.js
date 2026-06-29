const getRoleName = (role) => {
    if (typeof role === "string") return role;
    return role?.roleName || role?.authority || role?.name || "";
};

export const hasRole = (user, expectedRole) => {
    if (!Array.isArray(user?.roles)) return false;

    const expected = expectedRole.replace(/^ROLE_/, "").toUpperCase();
    return user.roles.some((role) => {
        const current = String(getRoleName(role))
            .replace(/^ROLE_/, "")
            .toUpperCase();
        return current === expected;
    });
};
