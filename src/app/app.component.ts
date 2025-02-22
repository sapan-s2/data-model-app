import { Component } from '@angular/core';
import {SchemaService} from './schema.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'data-model-app';
  schemaInput: string = '';

  constructor(private schemaService: SchemaService) {}

  generateDiagram() {
    try {
      const schema = JSON.parse(this.schemaInput);
      this.schemaService.updateSchema(schema);
    } catch (error) {
      console.error('Invalid JSON input');
    }
  }
}
