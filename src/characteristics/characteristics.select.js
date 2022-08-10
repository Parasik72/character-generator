const SelectCharacteristics = {
    id: true,
    value: true,
    user: false,
    userId: false,
    characteristicTypeId: true,
    characteristicType: {
        select: {
            id: false,
            name: true,
            characteristics: false,
            stats: false,
            skills: false,
            ammunition: false
        }
    }
}

module.exports = {
    SelectCharacteristics
}