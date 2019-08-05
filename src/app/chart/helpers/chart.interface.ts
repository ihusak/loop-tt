interface ChartInterfaceCoin {
  date: number;
  value: number;
  name: string;
}

interface ChartInterfaceData {
  concatData: ChartInterfaceCoin;
  changedData: any;
}

export {ChartInterfaceCoin, ChartInterfaceData}