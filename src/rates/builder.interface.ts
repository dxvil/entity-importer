import { IBuilder } from 'src/common/interfaces/builder.interface';

export interface IRatesBuilder extends IBuilder {
  buildRate();
  endBuildRate();
}
