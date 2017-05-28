import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TagService, ArtistService, DbService } from '../services';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Output() onTagsChange = new EventEmitter();
  obs = [];
  tags;

  constructor(private tagS: TagService, private dbS: DbService) { }

  ngOnInit() {
    // Fetch all tags
    this.obs.push(
      this.dbS.dbConnection.subscribe((db) => {
        this.tagS.getAllTags()
          .then((tags: any) => {
            this.tags = tags.map((t) => ({
              id: t.id,
              name: t.name,
              selected: false
            }));
          });
      })
    );

  }

  toggleTags(tag) {
    tag.selected = !tag.selected;
    const selectedTags = this.tags.filter(f => f.selected);
    this.onTagsChange.emit({ tags: selectedTags });
  }

  ngOnDestroy() {
    this.obs.forEach(ob => {
      ob.unsubscribe();
    });
  }
}
