
export const initialSetupEntries = [
    { location: 'leftDummyPart', name: 'helmet', link: 'https://sabzero.biz/croomTemplate/assets/img/helmet.png', typeid: [1] },
    { location: 'leftDummyPart', name: 'armor', link: 'https://sabzero.biz/croomTemplate/assets/img/armor.png', typeid: [3] },
    { location: 'leftDummyPart', name: 'belt', link: 'https://sabzero.biz/croomTemplate/assets/img/belt.png', typeid: [6] }, //поЯс
    { location: 'leftDummyPart', name: 'boots', link: 'https://sabzero.biz/croomTemplate/assets/img/boots.png', typeid: [11]  },
    { location: 'leftDummyPart', name: 'earring1', link: 'https://sabzero.biz/croomTemplate/assets/img/earring.png', typeid: [55]  },
    { location: 'leftDummyPart', name: 'ring1', link: 'https://sabzero.biz/croomTemplate/assets/img/ring.png', typeid: [7]  },
    { location: 'leftDummyPart', name: 'ring2', link: 'https://sabzero.biz/croomTemplate/assets/img/ring.png', typeid: [7]  },
    { location: 'rightDummyPart', name: 'necklace', link: 'https://sabzero.biz/croomTemplate/assets/img/necklace.png', typeid: [2] },
    { location: 'rightDummyPart', name: 'bracers', link: 'https://sabzero.biz/croomTemplate/assets/img/bracers.png', typeid: [5] }, //наручи
    { location: 'rightDummyPart', name: 'gloves', link: 'https://sabzero.biz/croomTemplate/assets/img/gloves.png', typeid: [4] }, //перчатки
    { location: 'rightDummyPart', name: 'leggings', link: 'https://sabzero.biz/croomTemplate/assets/img/leggings.png', typeid: [10] }, // поножи
    { location: 'rightDummyPart', name: 'earring2', link: 'https://sabzero.biz/croomTemplate/assets/img/earring.png', typeid: [55] }, //серьга
    { location: 'rightDummyPart', name: 'ring3', link: 'https://sabzero.biz/croomTemplate/assets/img/ring.png', typeid: [7]  },
    { location: 'rightDummyPart', name: 'ring4', link: 'https://sabzero.biz/croomTemplate/assets/img/ring.png', typeid: [7]  },
    { location: 'centerTopDummyPart', name: 'relic1', link: 'https://sabzero.biz/croomTemplate/assets/img/relic.png', typeid: [40] },
    { location: 'centerTopDummyPart', name: 'relic2', link: 'https://sabzero.biz/croomTemplate/assets/img/relic.png', typeid: [40] },
    { location: 'centerTopDummyPart', name: 'relic3', link: 'https://sabzero.biz/croomTemplate/assets/img/relic.png', typeid: [40] },
    { location: 'centerTopDummyPart', name: 'relic4', link: 'https://sabzero.biz/croomTemplate/assets/img/relic.png', typeid: [40] },
    { location: 'centerBottomDummyPart', name: 'weapons1', link: 'https://sabzero.biz/croomTemplate/assets/img/weapons.png', typeid: [8, 9, 12, 14, 15, 30, 31, 32, 33, 35, 37, 38, 39] },
    { location: 'centerBottomDummyPart', name: 'weapons2', link: 'https://sabzero.biz/croomTemplate/assets/img/weapons.png', typeid: [8, 9, 12, 14, 15, 30, 31, 32, 33, 35, 37, 38, 39] },
    // typeid: 8-пика, 9-топор, 12 меч, 15щит,30 посох, 31 молот,32 молот,33 топор, 35 клеймор, 37 жезл, 38 кастет, 39 кинжал,
  ]

export const listTwoHandedTypes = [8, 9, 14, 30, 32, 35, 36 ]


// стартовый набор стат для первичного заполнения таблиц. Соотвествует расе человек. 
export const baseStatModule = [
  { type: 'stat', key: 'dstrength', name: 'Сила', summStatBase: 3, summStatBonusAndBase: 3, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/strength.svg', minKey: 'minstrength' },
  { type: 'stat', key: 'ddexterity', name: 'Ловкість', summStatBase: 3, summStatBonusAndBase: 3, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/dexterity.svg', minKey: 'mindexterity'  },
  { type: 'stat', key: 'dintel', name: 'Інтелект', summStatBase: 3, summStatBonusAndBase: 3, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/intelligence.svg', minKey: 'minintel'  },
  { type: 'stat', key: 'dluck', name: 'Удача', summStatBase: 3, summStatBonusAndBase: 3, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/luck.svg', minKey: 'minluck'  },
  { type: 'stat', key: 'dreaction', name: 'Реакція', summStatBase: 3, summStatBonusAndBase: 3, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/reaction.svg', minKey: 'minreaction'  },
  { type: 'stat', key: 'dwisdom', name: 'Мудрість', summStatBase: 3, summStatBonusAndBase: 3, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/wisdom.svg', minKey: 'minwisdom'  },
  { type: 'stat', key: 'dconst', name: 'Статура', summStatBase: 3, summStatBonusAndBase: 3, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/constitution.svg', minKey: 'minconst'  },
  { type: 'protectionMagick', key: 'whitemagicprotection', name: 'Світанок', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/dawn.svg'},
  { type: 'protectionMagick', key: 'blackmagicprotection', name: 'Полнолуння', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/full-Moon.svg' },
  { type: 'protectionMagick', key: 'astralmagicprotection', name: 'Астрал', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/astral.svg' },
  { type: 'armor', key: 'headarmor', name: 'Голова', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/armor_head.svg' },
  { type: 'armor', key: 'bodyarmor', name: 'Тулуб', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/armor.svg' },
  { type: 'armor', key: 'lefthandarmor', name: 'Ліва рука', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/leftHend.svg' },
  { type: 'armor', key: 'righthandarmor', name: 'Права рука', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/rightHend.svg' },
  { type: 'armor', key: 'lagsarmor', name: 'Ноги', summStatBase: 0, summStatBonusAndBase: 0, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/leg-armor.svg' },
  { type: 'dstamina', key: 'dstamina', name: 'Енергія', summStatBase: 0, summStatBonusAndBase: 100, link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/power.svg' },
]

export const basickParamsRase = [
  {
    availableRaces: 'human', date: [
      {key: 'dstrength', count: 3 },
      {key: 'ddexterity', count: 3 },
      {key: 'dintel', count: 3 },
      {key: 'dluck', count: 3 },
      {key: 'dreaction', count: 3 },
      {key: 'dwisdom', count: 3 },
      {key: 'dconst', count: 3 },
    //   {key: 'headarmor', count: 6 },
    //   {key: 'bodyarmor', count: 6 },
    //   {key: 'lagsarmor', count: 4 },
    ]
  },
  {
    availableRaces: 'gnom', date: [
      {key: 'dstrength', count: 4 },
      {key: 'ddexterity', count: 2 },
      {key: 'dintel', count: 2 },
      {key: 'dluck', count: 3 },
      {key: 'dreaction', count: 2 },
      {key: 'dwisdom', count: 4 },
      {key: 'dconst', count: 4 },
    //   {key: 'headarmor', count: 4 },
    //   {key: 'bodyarmor', count: 8 },
    //   {key: 'lagsarmor', count: 4 },
    ]
  },
  {
    availableRaces: 'elf', date: [
      {key: 'dstrength', count: 3 },
      {key: 'ddexterity', count: 5 },
      {key: 'dintel', count: 3 },
      {key: 'dluck', count: 2 },
      {key: 'dreaction', count: 2 },
      {key: 'dwisdom', count: 3 },
      {key: 'dconst', count: 3 },
    //   {key: 'headarmor', count: 8 },
    //   {key: 'bodyarmor', count: 4 },
    //   {key: 'lagsarmor', count: 4 },
    ]
  },
  {
    availableRaces: 'vampire', date: [
      {key: 'dstrength', count: 3 },
      {key: 'ddexterity', count: 3 },
      {key: 'dintel', count: 3 },
      {key: 'dluck', count: 4 },
      {key: 'dreaction', count: 2 },
      {key: 'dwisdom', count: 3 },
      {key: 'dconst', count: 3 },
    //   {key: 'headarmor', count: 6 },
    //   {key: 'bodyarmor', count: 6 },
    //   {key: 'lagsarmor', count: 4 },
    ]
  },
  {
    availableRaces: 'ork', date: [
      {key: 'dstrength', count: 4 },
      {key: 'ddexterity', count: 3 },
      {key: 'dintel', count: 2 },
      {key: 'dluck', count: 4 },
      {key: 'dreaction', count: 3 },
      {key: 'dwisdom', count: 1 },
      {key: 'dconst', count: 4 },
    //   {key: 'headarmor', count: 9 },
    //   {key: 'bodyarmor', count: 9 },
    //   {key: 'lagsarmor', count: 0 },
    ]
  },
  {
    availableRaces: 'trol', date: [
      {key: 'dstrength', count: 5 },
      {key: 'ddexterity', count: 2 },
      {key: 'dintel', count: 1 },
      {key: 'dluck', count: 3 },
      {key: 'dreaction', count: 3 },
      {key: 'dwisdom', count: 2 },
      {key: 'dconst', count: 5 },
      {key: 'fortress', count: 1 },
    //   {key: 'headarmor', count: 7 },
    //   {key: 'bodyarmor', count: 5 },
    //   {key: 'lagsarmor', count: 4 },
    ]
  },
]

export const fortressParam = [
{ name: 'Нет', id: 'absent', minconst: 0, disabled: false, bonusHealthMutiplier: 1},
{ name: 'Новичок', id: 'newbie', minconst: 6, disabled: false, bonusHealthMutiplier: 1.1},
{ name: 'Продвинутий', id: 'promotions', minconst: 14, disabled: false, bonusHealthMutiplier: 1.17},
{ name: 'Експерт', id: 'expert', minconst: 18, disabled: false, bonusHealthMutiplier: 1.24},
{ name: 'Мастер', id: 'master', minconst: 27, disabled: false, bonusHealthMutiplier: 1.31},
{ name: 'Грандмастер', id: 'grandmaster', minconst: 41, disabled: false, bonusHealthMutiplier: 1.38},
]

export const armorMasteryParam = [
  { name: 'Нет', id: 'absent', disabled: false, bonusArmorMutiplier: 1},
  { name: 'Новичок', id: 'newbie', disabled: false, bonusArmorMutiplier: 1.05},
  { name: 'Продвинутий', id: 'promotions', disabled: false, bonusArmorMutiplier: 1.1},
  { name: 'Експерт', id: 'expert', disabled: false, bonusArmorMutiplier: 1.15},
  { name: 'Мастер', id: 'master', disabled: false, bonusArmorMutiplier: 1.20},
  { name: 'Грандмастер', id: 'grandmaster', disabled: false, bonusArmorMutiplier: 1.25},
  ]
  



export const raseParams = [
    { name: 'Человек', id: 'human'},
    { name: 'Гном', id: 'gnom'},
    { name: 'Эльф', id: 'elf'},
    { name: 'Вампир', id: 'vampire'},
    { name: 'Орк', id: 'ork'},
    { name: 'Троль', id: 'trol'},
    ]


export const arrayVariableStats = [
    { key: 'dstrength', count: 0 },
    { key: 'ddexterity', count: 0 },
    { key: 'dintel', count: 0 },
    { key: 'dluck', count: 0 },
    { key: 'dreaction', count: 0 },
    { key: 'dwisdom', count: 0 },
    { key: 'dconst', count: 0 },
    { key: 'whitemagicprotection', count: 0 },
    { key: 'blackmagicprotection', count: 0 },
    { key: 'astralmagicprotection', count: 0 },
    { key: 'headarmor', count: 0 },
    { key: 'bodyarmor', count: 0 },
    { key: 'lefthandarmor', count: 0 },
    { key: 'righthandarmor', count: 0 },
    { key: 'lagsarmor', count: 0 },
  ]
