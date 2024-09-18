import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ObjectService } from '../../services/object.service';
import { Router, RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, RouterModule, DragDropModule],
})
export class MainPageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'value', 'actions'];
  dataSource = new MatTableDataSource<any>();

  columnWidths: { [key: string]: string } = { id: '250px', name: '250px', value: '250px', actions: '250px' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private resizingColumn: string | null = null;
  private startX: number = 0;
  private startWidth: number = 0;
  private isResizing: boolean = false;

  constructor(
    private objectService: ObjectService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadObjects();
    this.loadColumnWidthsFromLocalStorage();
  }

  loadObjects() {
    this.objectService.getObjects().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.applyColumnWidths();
    });
  }

  applyColumnWidths() {
    const thElements = document.querySelectorAll('th') as NodeListOf<HTMLElement>;
    thElements.forEach((th, index) => {
      const column = this.displayedColumns[index];
      const width = this.columnWidths[column];
      if (width) {
        th.style.width = width;
        const dataCells = document.querySelectorAll(`td:nth-child(${index + 1})`) as NodeListOf<HTMLElement>;
        dataCells.forEach((cell) => {
          cell.style.width = width;
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  startResize(event: MouseEvent, column: string) {
    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.resizingColumn = column;
    this.startX = event.clientX;

    const headerCell = (event.target as HTMLElement).parentElement as HTMLElement;
    this.startWidth = headerCell.offsetWidth;

    this.renderer.addClass(document.body, 'resizing');

    document.addEventListener('mousemove', this.onResize);
    document.addEventListener('mouseup', this.endResize);
  }

  onResize = (event: MouseEvent) => {
    if (!this.isResizing || !this.resizingColumn) return;

    const deltaX = event.clientX - this.startX;
    let newWidth = this.startWidth + deltaX;

    if (newWidth < 250) {
      newWidth = 250;
    }

    const columnIndex = this.displayedColumns.indexOf(this.resizingColumn) + 1;
    const headerCell = document.querySelector(`th:nth-child(${columnIndex})`) as HTMLElement;
    const dataCells = document.querySelectorAll(`td:nth-child(${columnIndex})`) as NodeListOf<HTMLElement>;

    if (headerCell) {
      headerCell.style.width = `${newWidth}px`;
      dataCells.forEach(cell => {
        cell.style.width = `${newWidth}px`;
      });

      this.columnWidths[this.resizingColumn] = `${newWidth}px`;
    }
  };

  endResize = () => {
    this.isResizing = false;
    this.resizingColumn = null;

    this.renderer.removeClass(document.body, 'resizing');

    document.removeEventListener('mousemove', this.onResize);
    document.removeEventListener('mouseup', this.endResize);

    this.saveColumnWidthsToLocalStorage();
  };

  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    
    const tempColumnWidths: { [key: string]: string } = {};
    this.displayedColumns.forEach((column, index) => {
      tempColumnWidths[column] = this.columnWidths[column];
    });
    this.columnWidths = tempColumnWidths;

    this.applyColumnWidths();
    this.saveColumnWidthsToLocalStorage();
  }

  saveColumnWidthsToLocalStorage() {
    localStorage.setItem('columnWidths', JSON.stringify(this.columnWidths));
  }

  loadColumnWidthsFromLocalStorage() {
    const storedWidths = localStorage.getItem('columnWidths');
    if (storedWidths) {
      this.columnWidths = JSON.parse(storedWidths);
    }
  }

  logColumnWidthsToConsole() {
    console.log('Current column widths:', this.columnWidths);
  }

  deleteObject(id: number) {
    this.objectService.deleteObject(id).subscribe(() => this.loadObjects());
  }

  editObject(id: number) {
    this.router.navigate(['/details', id]);
  }

  addObject() {
    const newObject = {
      id: this.dataSource.data.length + 1,
      name: `Object ${this.dataSource.data.length + 1}`,
      value: Math.floor(Math.random() * 1000),
    };
    this.objectService.addObject(newObject).subscribe(() => {
      this.loadObjects();
    });
  }
}