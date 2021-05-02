const Ism = { id: 1, name: 'Ism' }
const Fil = { id: 2, name: 'Fil' }
const Harf = { id: 3, name: 'Harf' }

const Mubtada = { id: 4, name: "Mubtada", exclude: [5] };
const Kabr = { id: 5, name: "Kabr", exclude: [4] };
const Fial = { id: 6, name: "Fial", exclude: [], excludeGroup: [1] };

const Madhi = { id: 12, name: "Madhi", exclude: [], excludeGroup: [] };
const Mudhari = { id: 13, name: "Mudhari", exclude: [], excludeGroup: [] };
const Amr = { id: 14, name: "Amr", exclude: [], excludeGroup: [] };

const Jar = { id: 15, name: "Jar", exclude: [], excludeGroup: [] };
const Zaida = { id: 16, name: "Zaida", exclude: [], excludeGroup: [] };

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
  items: [
    { id: 7, name: "Mafool bihi", exclude: [6], excludeGroup: [1] },
    { id: 8, name: "Mafool fi", exclude: [6], excludeGroup: [1] },
    { id: 9, name: "Mafool laho", exclude: [6], excludeGroup: [1] },
    { id: 10, name: "Mafool mutlaq", exclude: [6], excludeGroup: [1] },
    { id: 11, name: "Mafool hal", exclude: [6], excludeGroup: [1] },
  ],
};

export const data = {
  Ism, Fil, Harf, Mubtada, Kabr, Fial, mafool, fils, MafoolBihi: mafool.items[0], Madhi, Mudhari, Amr, Jar, Zaida, jars
}