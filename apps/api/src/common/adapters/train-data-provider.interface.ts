export interface TrainFilters {
  zone?: string;
  station?: string;
  status?: string;
}

export interface TrainPosition {
  lat: number;
  lon: number;
  speed: number;
  timestamp: Date;
}

export interface ITrainDataProvider {
  getTrains(filters?: TrainFilters): Promise<any[]>;
  getTrainById(id: string): Promise<any | null>;
  getTrainPosition(trainId: string): Promise<TrainPosition | null>;
  subscribeToUpdates(callback: (train: any) => void): () => void;
}
