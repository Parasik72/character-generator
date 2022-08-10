const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const MongoDB = require("../db/mongoDB.prisma.service");
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const { RoleTypes } = require('../roles/roles.type');
const bcryptjs = require('bcryptjs');
const path = require('path');

const adminRoleId = v4();

const rolesData = [
    {
        id: v4(),
        name: RoleTypes.USER
    },
    {
        id: adminRoleId,
        name: RoleTypes.ADMIN
    }
];

const adminId = v4();

const strengthId = v4();
const agilityId = v4();
const staminaId = v4();
const intelligenceId = v4();

const characteristicTypesData = [
    {
        id: strengthId,
        name: "Strength"
    },
    {
        id: agilityId,
        name: "Agility"
    },
    {
        id: staminaId,
        name: "Stamina"
    },
    {
        id: intelligenceId,
        name: "Intelligence"
    },
];

const characteristicsData = [
    {
        id: v4(),
        value: 10,
        userId: adminId,
        characteristicTypeId: strengthId
    },
    {
        id: v4(),
        value: 10,
        userId: adminId,
        characteristicTypeId: agilityId
    },
    {
        id: v4(),
        value: 10,
        userId: adminId,
        characteristicTypeId: staminaId
    },
    {
        id: v4(),
        value: 10,
        userId: adminId,
        characteristicTypeId: intelligenceId
    }
];

const meleeDamageId = v4();
const rangedDamageId = v4();
const protectionId = v4();
const magicDamageId = v4();
const hpId = v4();
const mpId = v4();
const critChanceId = v4();

const statsData = [
    {
        id: meleeDamageId,
        name: "Melee damage",
    },
    {
        id: rangedDamageId,
        name: "Ranged damage",
    },
    {
        id: protectionId,
        name: "Protection",
    },
    {
        id: magicDamageId,
        name: "Magic damage",
    },
    {
        id: hpId,
        name: "HP",
    },
    {
        id: mpId,
        name: "MP",
    },
    {
        id: critChanceId,
        name: "Crit chance",
    },
];

const characteristicTypeOnStatData = [
    {
        characteristicTypeId: strengthId,
        statId: meleeDamageId,
        eachDivider: 2,
        eachUp: 1
    },
    {
        characteristicTypeId: agilityId,
        statId: rangedDamageId,
        eachDivider: 2,
        eachUp: 1
    },
    {
        characteristicTypeId: staminaId,
        statId: hpId,
        eachDivider: 2,
        eachUp: 1
    },
    {
        characteristicTypeId: staminaId,
        statId: protectionId,
        eachDivider: 5,
        eachUp: 5
    },
    {
        characteristicTypeId: intelligenceId,
        statId: mpId,
        eachDivider: 2,
        eachUp: 1
    },
    {
        characteristicTypeId: intelligenceId,
        statId: magicDamageId,
        eachDivider: 10,
        eachUp: 5
    },
];

const stoneSkinId = v4();
const accurateEyeId = v4();
const strongmanId = v4();

const skillsData = [
    {
        id: stoneSkinId,
        name: "Stone skin"
    },
    {
        id: accurateEyeId,
        name: "Accurate eye"
    },
    {
        id: strongmanId,
        name: "Strongman"
    },
];

const skillOnStatsData = [
    {
        skillId: stoneSkinId,
        statId: protectionId,
        upValue: 10
    },
    {
        skillId: accurateEyeId,
        statId: rangedDamageId,
        upValue: 5
    },
    {
        skillId: accurateEyeId,
        statId: critChanceId,
        upValue: 5
    },
    {
        skillId: strongmanId,
        statId: meleeDamageId,
        upValue: 15
    },
];

const skillOnCharacteristicsData = [
    {
        skillId: stoneSkinId,
        characteristicTypeId: agilityId,
        upValue: -10
    },
    {
        skillId: strongmanId,
        characteristicTypeId: agilityId,
        upValue: -5
    },
];

const helmetId = v4();
const armorId = v4();
const swordId = v4();

const ammunitionTypeData = [
    {
        id: helmetId,
        type: "Helmet"
    },
    {
        id: armorId,
        type: "Armor"
    },
    {
        id: swordId,
        type: "Sword"
    },
];

const dragonHelmetId = v4(); // +25 strength
const dragonArmorId = v4(); // +10 protection, +30 HP // +Stone skin
const dragonSwordId = v4(); // +15 melee damage, +15 crit chance // +Strongman

const ammunitionData = [
    {
        id: dragonHelmetId,
        name: "Dragon helmet",
        picture: path.resolve(__dirname, "DragonplateHelmet.png"),
        ammunitionTypeId: helmetId
    },
    {
        id: dragonArmorId,
        name: "Dragon armor",
        picture: path.resolve(__dirname, "DragonplateArmor.png"),
        ammunitionTypeId: armorId
    },
    {
        id: dragonSwordId,
        name: "Dragon sword",
        picture: path.resolve(__dirname, "Dragonsword.png"),
        ammunitionTypeId: swordId
    },
];

const ammunitionOnUser = [
    {
        userId: adminId,
        ammunitionId: dragonHelmetId
    },
    {
        userId: adminId,
        ammunitionId: dragonArmorId
    },
    {
        userId: adminId,
        ammunitionId: dragonSwordId
    },
];

const ammunitionOnCharacteristics = [
    {
        ammunitionId: dragonHelmetId,
        characteristicTypeId: strengthId,
        upValue: 25
    }
];

const ammunitionOnStats = [
    {
        ammunitionId: dragonArmorId,
        statId: protectionId,
        upValue: 10
    },
    {
        ammunitionId: dragonArmorId,
        statId: hpId,
        upValue: 30
    },
    {
        ammunitionId: dragonSwordId,
        statId: meleeDamageId,
        upValue: 15
    },
    {
        ammunitionId: dragonSwordId,
        statId: critChanceId,
        upValue: 15
    },
];

const ammunitionOnSkills = [
    {
        ammunitionId: dragonArmorId,
        skillId: stoneSkinId
    },
    {
        ammunitionId: dragonSwordId,
        skillId: strongmanId
    },
];

const userData = [
    {
        id: adminId,
        email: 'admin@gmail.com',
        password: bcryptjs.hashSync('admin', 5),
        roleId: adminRoleId,
        phoneNumber: '+380111111111'
    }
];

const adminActivationLink = {
    userId: adminId,
    link: jwt.sign({
        id: adminId,
        email:'admin@gmail.com',
        role: RoleTypes.ADMIN
    }, process.env.JWT_SECRET,
    {
        expiresIn: '1d'
    }),
    isActivated: true
};

const skillOnUsersData = [
    {
        skillId: stoneSkinId,
        userId: adminId
    },
    {
        skillId: accurateEyeId,
        userId: adminId
    },
];

const cleanAllDB = async () => {
    await PostgreSQLPrisma.activationlink.deleteMany();
    await PostgreSQLPrisma.ammunitionOnCharacteristics.deleteMany();
    await PostgreSQLPrisma.ammunitionOnSkills.deleteMany();
    await PostgreSQLPrisma.ammunitionOnStats.deleteMany();
    await PostgreSQLPrisma.ammunitionOnUser.deleteMany();
    await PostgreSQLPrisma.ammunitionType.deleteMany();
    await PostgreSQLPrisma.ammunition.deleteMany();
    await PostgreSQLPrisma.role.deleteMany();
    await PostgreSQLPrisma.token.deleteMany();
    await PostgreSQLPrisma.skillOnUsers.deleteMany();
    await PostgreSQLPrisma.user.deleteMany();
    await PostgreSQLPrisma.characteristic.deleteMany();
    await PostgreSQLPrisma.characteristicTypeOnStat.deleteMany();
    await PostgreSQLPrisma.skillOnCharacteristics.deleteMany();
    await PostgreSQLPrisma.characteristicType.deleteMany();
    await PostgreSQLPrisma.skillOnStats.deleteMany();
    await PostgreSQLPrisma.skill.deleteMany();
    await PostgreSQLPrisma.stat.deleteMany();
    await MongoDB.log.deleteMany();
}

const start = async () => {
    console.log(`Seeding start...`);
    await cleanAllDB();
    for(const data of rolesData)
        await PostgreSQLPrisma.role.create({data});
    for(const data of userData)
        await PostgreSQLPrisma.user.create({data});
    for(const data of characteristicTypesData)
        await PostgreSQLPrisma.characteristicType.create({data});
    for(const data of characteristicsData)
        await PostgreSQLPrisma.characteristic.create({data});
    for(const data of statsData)
        await PostgreSQLPrisma.stat.create({data});
    for(const data of characteristicTypeOnStatData)
        await PostgreSQLPrisma.characteristicTypeOnStat.create({data});
    for(const data of skillsData)
        await PostgreSQLPrisma.skill.create({data});
    for(const data of skillOnStatsData)
        await PostgreSQLPrisma.skillOnStats.create({data});
    for(const data of skillOnCharacteristicsData)
        await PostgreSQLPrisma.skillOnCharacteristics.create({data});
    for(const data of ammunitionTypeData)
        await PostgreSQLPrisma.ammunitionType.create({data});
    for(const data of ammunitionData)
        await PostgreSQLPrisma.ammunition.create({data});
    for(const data of ammunitionOnUser)
        await PostgreSQLPrisma.ammunitionOnUser.create({data});
    for(const data of ammunitionOnCharacteristics)
        await PostgreSQLPrisma.ammunitionOnCharacteristics.create({data});
    for(const data of ammunitionOnStats)
        await PostgreSQLPrisma.ammunitionOnStats.create({data});
    for(const data of ammunitionOnSkills)
        await PostgreSQLPrisma.ammunitionOnSkills.create({data});
    for(const data of skillOnUsersData)
        await PostgreSQLPrisma.skillOnUsers.create({data});
    await PostgreSQLPrisma.activationlink.create({data: adminActivationLink});
};

start();