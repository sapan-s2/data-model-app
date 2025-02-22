import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import * as joint from 'jointjs';
// import 'jointjs/dist/joint.shapes.erd';
import { SchemaService } from '../schema.service';
import { isPlatformBrowser } from '@angular/common';
import * as dagre from 'dagre';

@Component({
  selector: 'app-er-diagram',
  standalone: false,
  template: '<div #diagram></div>'
})
export class ErDiagramComponent implements OnInit {
  @ViewChild('diagram', { static: true }) diagramElement: any;
  private graph: any;
  private paper: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private schemaService: SchemaService) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('jointjs').then(joint => {
        this.initializeDiagram(joint);
      });
    }
    this.schemaService.schema$.subscribe(schema => {
      if (schema) {

        this.generateERDiagram(schema);
      }
    });
  }

  private initializeDiagram(joint: any) {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: this.diagramElement.nativeElement,
      width: 1200,
      height: 800,
      model: this.graph,
      gridSize: 10
    });
  }

  private adjustPaperSize() {
    let maxX = 0;
    let maxY = 0;
    this.graph.getCells().forEach((cell: any) => {
      if (cell.position()) {
        maxX = Math.max(maxX, cell.position().x + (cell.size() ? cell.size().width : 0));
        maxY = Math.max(maxY, cell.position().y + (cell.size() ? cell.size().height : 0));
      }
    });
    this.paper.setDimensions(maxX + 200, maxY + 200); // Add padding
    this.paper.scaleContentToFit();
  }


  private layoutGraph() {
    joint.layout.DirectedGraph.layout(this.graph, {
      setLinkVertices: false,
      rankDir: 'BT', // Try top-to-bottom
      rankSep: 200,
      edgeSep: 100,
      nodeSep: 150,
      marginX: 100,
      marginY: 100,
      // acyclic: true,
      ranker: 'network-simplex', // Try different rankers
      align: 'UL'
    });
  }

  private generateERDiagram(schema: any) {
    this.graph.clear();
    const entities: any = {};

    schema.tables.forEach((table: any) => {
      const entityX = 100 + Object.keys(entities).length * 200;
      const entityY = 50;

      const entity = new joint.shapes.erd.Entity({
        position: { x: entityX, y: entityY },
        attrs: { text: { text: table.name } }
      });
      this.graph.addCell(entity);
      entities[table.name] = entity;

      let attributeY = entityY + 100;

      table.fields.forEach((field: any) => {
        const attributeX = entityX;
        const attribute = new joint.shapes.erd.Attribute({
          position: { x: attributeX, y: attributeY },
          attrs: { text: { text: field.name } }
        });
        this.graph.addCell(attribute);

        const link = new joint.shapes.erd.Line({
          source: { id: entity.id },
          target: { id: attribute.id }
        });
        this.graph.addCell(link);

        attributeY += 50;
      });
    });


    // Create relationships
    schema.relations.forEach((relation: any) => {
      const parentEntity = entities[relation.parent];
      const childEntity = entities[relation.child];

      if (parentEntity && childEntity) {
        // const relationshipX = (parentEntity.position().x + childEntity.position().x) / 2;
        // const relationshipY = Math.round(parentEntity.position().y); // Round Y
        //
        // const relationship = new joint.shapes.erd.Relationship({
        //   position: { x: relationshipX, y: relationshipY },
        //   // attrs: { text: { text: relation.name } }
        // });
        // this.graph.addCell(relationship);

        const link1 = new joint.shapes.erd.Line({
          source: { id: parentEntity.id },
          // target: { id: relationship.id },
          target: { id: childEntity.id },
          labels: [
            { position: 0.3, attrs: { text: { text: relation.parentCardinality } } },
            { position: 0.7, attrs: { text: { text: relation.childCardinality } } }
          ],
          router: { name: 'manhattan', args: { padding: 10 } },
          connector: { name: 'rounded' }
        });
        this.graph.addCell(link1);

        const link2 = new joint.shapes.erd.Line({
          source: { id: childEntity.id },
          // target: { id: relationship.id },
          target: { id: childEntity.id },
          router: { name: 'manhattan', args: { padding: 20 } },
          connector: { name: 'rounded' }
        });
        // this.graph.addCell(link2);
      } else {
        console.error("Entities not found for relation:", relation.name);
      }
    });

    this.layoutGraph();
    this.adjustPaperSize();
  }
}
