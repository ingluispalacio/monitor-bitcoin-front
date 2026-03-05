export interface FeatureToggle {
  id?: string;
  moduleName: string;
  active: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}