const SelectStandardUser = {
    id: true,
    email: true,
    avatar: true,
    description: true,
    roleId: true,
    role: {
        select: {
            id: false,
            name: true
        }
    },
    characteristics: false,
    ammunition: false,
    skills: false,
    password: false,
    activationLink: false,
    token: false,
    createdAt: false,
};

const SelectAuthUser = {
    id: false,
    email: true,
    avatar: false,
    description: false,
    roleId: false,
    role: false,
    characteristics: false,
    ammunition: false,
    skills: false,
    password: false,
    activationLink: false,
    token: {
        select: {
            user: false,
            userId: false,
            accessToken: false,
            isActive: false,
            lastAuthorization: true
        }
    },
    createdAt: true,
};

module.exports = {
    SelectStandardUser,
    SelectAuthUser
}