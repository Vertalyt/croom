
export const baseDummyParams = [
    { location: 'dummyPartLeft', name: 'helmet', link: 'src/assets/img/helmet.png' },
    { location: 'dummyPartLeft', name: 'armor', link: 'src/assets/img/armor.png' },
    { location: 'dummyPartLeft', name: 'belt', link: 'src/assets/img/belt.png' },
    { location: 'dummyPartLeft', name: 'boots', link: 'src/assets/img/boots.png' },
    { location: 'dummyPartLeft', name: 'earring', link: 'src/assets/img/earring.png' },
    { location: 'dummyPartLeft', name: 'ring', link: 'src/assets/img/ring.png' },
    { location: 'dummyPartLeft', name: 'ring', link: 'src/assets/img/ring.png' },
    { location: 'dummyPartRight', name: 'necklace', link: 'src/assets/img/necklace.png' },
    { location: 'dummyPartRight', name: 'bracers', link: 'src/assets/img/bracers.png' },
    { location: 'dummyPartRight', name: 'gloves', link: 'src/assets/img/gloves.png' },
    { location: 'dummyPartRight', name: 'leggings', link: 'src/assets/img/leggings.png' },
    { location: 'dummyPartRight', name: 'earring', link: 'src/assets/img/earring.png' },
    { location: 'dummyPartRight', name: 'ring', link: 'src/assets/img/ring.png' },
    { location: 'dummyPartRight', name: 'ring', link: 'src/assets/img/ring.png' },
    { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
    { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
    { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
    { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
    { location: 'dummyPartCenterBottom', name: 'weapons', link: 'src/assets/img/weapons.png' },
    { location: 'dummyPartCenterBottom', name: 'weapons', link: 'src/assets/img/weapons.png' },
  ]


export const baseParam = [
  { type: 'stat', key: 'strong', name: 'Сила', summStatBase: 3, summStatBaseOll: 3, link: 'src/assets/img/icon/svg/strong.svg' },
  { type: 'stat', key: 'agility', name: 'Ловкість', summStatBase: 3, summStatBaseOll: 3, link: 'src/assets/img/icon/svg/agility.svg' },
  { type: 'stat', key: 'intelledgy', name: 'Інтелект', summStatBase: 3, summStatBaseOll: 3, link: 'src/assets/img/icon/svg/intelledgy.svg' },
  { type: 'stat', key: 'luck', name: 'Удача', summStatBase: 3, summStatBaseOll: 3, link: 'src/assets/img/icon/svg/luck.svg' },
  { type: 'stat', key: 'reaction', name: 'Реакція', summStatBase: 3, summStatBaseOll: 3, link: 'src/assets/img/icon/svg/reaction.svg' },
  { type: 'stat', key: 'wisdom', name: 'Мудрість', summStatBase: 3, summStatBaseOll: 3, link: 'src/assets/img/icon/svg/wisdom.svg' },
  { type: 'stat', key: 'constitution', name: 'Статура', summStatBase: 3, summStatBaseOll: 3, link: 'src/assets/img/icon/svg/constitution.svg' },
  { type: 'protectionMagick', key: 'dawn', name: 'Світанок', summStatBaseOll: 6, link: 'src/assets/img/icon/svg/dawn.svg' },
  { type: 'protectionMagick', key: 'fullMoon', name: 'Полнолуння', summStatBaseOll: 6, link: 'src/assets/img/icon/svg/full-Moon.svg' },
  { type: 'protectionMagick', key: 'astral', name: 'Астрал', summStatBaseOll: 4, link: 'src/assets/img/icon/svg/astral.svg' },
  { type: 'armor', key: 'armorHead', name: 'Голова', summStatBaseOll: 0, link: 'src/assets/img/icon/svg/armor_head.svg' },
  { type: 'armor', key: 'armor', name: 'Тулуб', summStatBaseOll: 0, link: 'src/assets/img/icon/svg/armor.svg' },
  { type: 'armor', key: 'leftHend', name: 'Ліва рука', summStatBaseOll: 0, link: 'src/assets/img/icon/svg/leftHend.svg' },
  { type: 'armor', key: 'rightHend', name: 'Права рука', summStatBaseOll: 0, link: 'src/assets/img/icon/svg/rightHend.svg' },
  { type: 'armor', key: 'legArmor', name: 'Ноги', summStatBaseOll: 0, link: 'src/assets/img/icon/svg/leg-armor.svg' },
]

export const basickParamsRase = [
  {
    rase: 'human', date: [
      {key: 'strong', count: 3 },
      {key: 'agility', count: 3 },
      {key: 'intelledgy', count: 3 },
      {key: 'luck', count: 3 },
      {key: 'reaction', count: 3 },
      {key: 'wisdom', count: 3 },
      {key: 'constitution', count: 3 },
      {key: 'dawn', count: 6 },
      {key: 'fullMoon', count: 6 },
      {key: 'astral', count: 4 },
    ]
  },
  {
    rase: 'gnom', date: [
      {key: 'strong', count: 4 },
      {key: 'agility', count: 2 },
      {key: 'intelledgy', count: 2 },
      {key: 'luck', count: 3 },
      {key: 'reaction', count: 2 },
      {key: 'wisdom', count: 4 },
      {key: 'constitution', count: 4 },
      {key: 'dawn', count: 4 },
      {key: 'fullMoon', count: 8 },
      {key: 'astral', count: 4 },
    ]
  },
  {
    rase: 'elf', date: [
      {key: 'strong', count: 3 },
      {key: 'agility', count: 5 },
      {key: 'intelledgy', count: 3 },
      {key: 'luck', count: 2 },
      {key: 'reaction', count: 2 },
      {key: 'wisdom', count: 3 },
      {key: 'constitution', count: 3 },
      {key: 'dawn', count: 8 },
      {key: 'fullMoon', count: 4 },
      {key: 'astral', count: 4 },
    ]
  },
  {
    rase: 'vampire', date: [
      {key: 'strong', count: 3 },
      {key: 'agility', count: 3 },
      {key: 'intelledgy', count: 3 },
      {key: 'luck', count: 4 },
      {key: 'reaction', count: 2 },
      {key: 'wisdom', count: 3 },
      {key: 'constitution', count: 3 },
      {key: 'dawn', count: 6 },
      {key: 'fullMoon', count: 6 },
      {key: 'astral', count: 4 },
    ]
  },
  {
    rase: 'ork', date: [
      {key: 'strong', count: 4 },
      {key: 'agility', count: 3 },
      {key: 'intelledgy', count: 2 },
      {key: 'luck', count: 4 },
      {key: 'reaction', count: 3 },
      {key: 'wisdom', count: 1 },
      {key: 'constitution', count: 4 },
      {key: 'dawn', count: 9 },
      {key: 'fullMoon', count: 9 },
      {key: 'astral', count: 0 },
    ]
  },
  {
    rase: 'trol', date: [
      {key: 'strong', count: 5 },
      {key: 'agility', count: 2 },
      {key: 'intelledgy', count: 1 },
      {key: 'luck', count: 3 },
      {key: 'reaction', count: 3 },
      {key: 'wisdom', count: 2 },
      {key: 'constitution', count: 5 },
      {key: 'dawn', count: 7 },
      {key: 'fullMoon', count: 5 },
      {key: 'astral', count: 4 },
      {key: 'fortress', count: 1 },
    ]
  },
]

export const classParams = [
  { class: 'ranger',
  subclass: 'shooter', 
  lvl: 8, 
  addStat: [
    {key: 'strong', count: 4 },
    {key: 'reaction', count: 2 },
    {key: 'constitution', count: 4 },
  ],
  requiredStat: [
    {key: 'strong', count: 11 },
    {key: 'agility', count: 27 },
    {key: 'luck', count: 22 },
  ],
  forbiddenSkills: [
   {skills: 'fortress' }
  ]
},
{ class: 'ranger', 
subclass: 'archer', 
lvl: 11, 
addStat: [
  {key: 'strong', count: 9 },
  {key: 'reaction', count: 4 },
  {key: 'constitution', count: 6 },
  {key: 'armorHead', count: 3 },
],
requiredStat: [
  {key: 'strong', count: 18 },
  {key: 'agility', count: 41 },
  {key: 'luck', count: 32 },
],
forbiddenSkills: [
 {skills: 'fortress' }
]
}
]

export const classParams2 = [
  { class: 'ranger', date: [{ 
    
  subclass: 'shooter',
  lvl: 8, 
  addStat: [
    {key: 'strong', count: 4 },
    {key: 'reaction', count: 2 },
    {key: 'constitution', count: 4 },
  ],
  requiredStat: [
    {key: 'strong', count: 11 },
    {key: 'agility', count: 27 },
    {key: 'luck', count: 22 },
  ],
  forbiddenSkills: [
   {skills: 'fortress' }
  ],}],

  subclass: 'archer',
  lvl: 11, 
  addStat: [
    {key: 'strong', count: 9 },
    {key: 'reaction', count: 4 },
    {key: 'constitution', count: 6 },
    {key: 'armorHead', count: 3 },
  ],
  requiredStat: [
    {key: 'strong', count: 18 },
    {key: 'agility', count: 41 },
    {key: 'luck', count: 32 },
  ],
  forbiddenSkills: [
   {skills: 'fortress' }
  ]
}]