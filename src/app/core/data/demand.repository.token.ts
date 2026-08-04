import { InjectionToken } from '@angular/core';
import { IDemandRepository } from './demand.repository.interface';

export const DEMAND_REPOSITORY = new InjectionToken<IDemandRepository>('DemandRepository');
