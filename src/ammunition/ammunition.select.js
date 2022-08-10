const SelectAmmunition = {
    id: true,
    name: true,
    picture: true,
    users: false,
    ammunitionTypeId: true,
    ammunitionType: {
        select: {
            id: false,
            type: true,
            ammunitions: false
        }
    },
    characteristics: false,
    stats: false,
    skills: false
};

const SelectExtendedAmmunition = {
    id: true,
    name: true,
    picture: true,
    users: false,
    ammunitionTypeId: true,
    ammunitionType: {
        select: {
            id: false,
            type: true,
            ammunitions: false
        }
    },
    characteristics: true,
    stats: true,
    skills: true
};

module.exports = {
    SelectAmmunition,
    SelectExtendedAmmunition
}