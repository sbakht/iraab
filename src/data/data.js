const Ism = { id: 1, name: 'Ism' }
const Fil = { id: 2, name: 'Fil' }
const Harf = { id: 3, name: 'Harf' }

const Mubtada = { id: 4, name: "Mubtada", exclude: [5] };
const Kabr = { id: 5, name: "Kabr", exclude: [4, 20], excludeGroup: [1] };
const Fial = { id: 6, name: "Fial", exclude: [], excludeGroup: [1] };
const Majroor = { id: 20, name: "Majroor", exclude: [4, 5, 6], excludeGroup: [1] };
const Sifa = { id: 21, name: "Sifa", exclude: [], excludeGroup: [] };

const Madhi = { id: 12, name: "Madhi", exclude: [], excludeGroup: [] };
const Mudhari = { id: 13, name: "Mudhari", exclude: [], excludeGroup: [] };
const Amr = { id: 14, name: "Amr", exclude: [], excludeGroup: [] };

const Jar = { id: 15, name: "Jar", exclude: [], excludeGroup: [] };
const Zaida = { id: 16, name: "Zaida", exclude: [], excludeGroup: [] };
const Mutaalliq = { id: 17, name: "Mutaalliq", exclude: [], excludeGroup: [] };
const MudafIlayhi = { id: 18, name: "Mudaf Ilayhi", exclude: [], excludeGroup: [] };
const Empty = { id: 100, name: "?", exclude: [], excludeGroup: [] };

const fils = {
  id: 2,
  items: [
    Madhi, Mudhari, Amr
  ]
}
const jars = {
  id: 3,
  items: [
    Jar, Zaida
  ]
}

const mafool = {
  id: 1,
  exclude: [6, 20],
  excludeGroup: [1],
  items: [
    { id: 7, name: "Mafool bihi", exclude: [], excludeGroup: [] },
    { id: 8, name: "Mafool fi", exclude: [], excludeGroup: [] },
    { id: 9, name: "Mafool laho", exclude: [], excludeGroup: [] },
    { id: 10, name: "Mafool mutlaq", exclude: [], excludeGroup: [] },
    { id: 11, name: "Mafool hal", exclude: [], excludeGroup: [] },
  ],
};

const getItems = (group) => {
  const groupId = group.id;
  return group.items.map((item) => ({
    ...item, groupId,
    exclude: group.exclude.concat(item.exclude || []),
    excludeGroup: group.excludeGroup.concat(item.excludeGroup || []),
  }));
};

const IsmGroup = {
  id: 2,
  items: [Mubtada, Kabr, Fial, Majroor, ...getItems(mafool)],
}

const MafoolBihi = getItems(mafool)[0]

const IsmOptions = IsmGroup.items

export const data = {
  Ism, IsmOptions, Fil, Harf, Mubtada, Kabr, Fial, Majroor, mafool, fils, MafoolBihi, Madhi, Mudhari, Amr, Jar, Zaida, jars, Mutaalliq, MudafIlayhi, Empty
}


const connections = {
  byId: {
    '5': Kabr,
    '17': Mutaalliq,
    '18': MudafIlayhi,
    '20': Majroor,
    '21': Sifa,
    '22': Fial,
    '23': mafool.items[0],
    '24': mafool.items[1],
    '25': mafool.items[2],
    '26': mafool.items[3],
    '27': mafool.items[4],
  },
  allIds: ['5', '17', '18', '20', '21', '22', '23', '24', '25', '26', '27'],
}

export const connectionTypes = {
  ...connections,
  all: connections.allIds.map(id => connections.byId[id]),
}

export const pronouns = [
  { english: 'huwa', arabic: '????' },
  { english: 'humaa', arabic: '??????' },
  { english: 'hum', arabic: '??????' },
  { english: 'heya', arabic: '??????' },
  { english: 'humaa', arabic: '??????????' },
  { english: 'honna', arabic: '??????????' },
  { english: 'anta', arabic: '????????????' },
  { english: 'antumaa', arabic: '??????????????????' },
  { english: 'antum', arabic: '????????????????' },
  { english: 'anti', arabic: '????????????' },
  { english: 'antumaa', arabic: '????????????????' },
  { english: 'antunna', arabic: '??????????????????' },
  { english: 'anaa', arabic: '??????????' },
  { english: 'nahnu', arabic: '????????????' },
]