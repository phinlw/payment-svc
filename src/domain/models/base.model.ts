export interface ApiAccess {
  platform?: string;
  backendKey?: string;
  ownerId?: string;
}

export class DefaultModel {
  _id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  uniqueId?: number;
}