import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectService } from '../../services/object.service';
import { ObjectModel } from '../../models/object.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css'],
  imports: [CommonModule, FormsModule],
})
export class DetailPageComponent implements OnInit {
  object: ObjectModel = { id: 0, name: '', value: 0 };
  isNew: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private objectService: ObjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNew = true;
    } else {
      this.objectService.getObject(+id!).subscribe((object) => (this.object = object));
    }
  }

  save(): void {
    if (this.isNew) {
      this.objectService.addObject(this.object).subscribe(() => this.router.navigate(['/']));
    } else {
      this.objectService.updateObject(this.object).subscribe(() => this.router.navigate(['/']));
    }
  }
}
