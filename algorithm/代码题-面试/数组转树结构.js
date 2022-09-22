// 数组转树结构
// 1 for 循环
const arrToTreeFor = (arr, pid) => {
  function loop(pid) {
    const result = [];
    for (let item of arr) {
      const { parentId, id } = item;
      if (parentId !== pid) {
        continue;
      }
      item.children = loop(id);
      result.push(item);
    }
    return result;
  }
  return loop(pid);
};
const arr = [
  {
    id: 2,
    name: '部门B',
    parentId: 0
  },
  {
    id: 3,
    name: '部门C',
    parentId: 1
  },
  {
    id: 1,
    name: '部门A',
    parentId: 2
  },
  {
    id: 4,
    name: '部门D',
    parentId: 1
  },
  {
    id: 5,
    name: '部门E',
    parentId: 2
  },
  {
    id: 6,
    name: '部门F',
    parentId: 3
  },
  {
    id: 7,
    name: '部门G',
    parentId: 2
  },
  {
    id: 8,
    name: '部门H',
    parentId: 4
  }
];
arrToTreeFor(arr, 0);
