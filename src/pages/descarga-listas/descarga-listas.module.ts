import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DescargaListasPage } from './descarga-listas';

@NgModule({
  declarations: [
    DescargaListasPage,
  ],
  imports: [
    IonicPageModule.forChild(DescargaListasPage),
  ],
})
export class DescargaListasPageModule {}
