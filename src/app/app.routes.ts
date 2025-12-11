import { Routes } from '@angular/router';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';

export const routes: Routes = [
    {path: '', redirectTo: 'dynamic-table', pathMatch: 'full' },
    {path: 'dynamic-table',component:DynamicTableComponent}
];
