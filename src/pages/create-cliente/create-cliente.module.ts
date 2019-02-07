import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateClientePage } from './create-cliente';

@NgModule({
  declarations: [
    CreateClientePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateClientePage),
  ],
})
export class CreateClientePageModule {}
