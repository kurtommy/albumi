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
  tagS;

  constructor(tagS: TagService, private dbS: DbService) {
    this.tagS = tagS;
   }

  ngOnInit() {
    // Fetch all tags
    // this.obs.push(
    //   this.dbS.dbConnection.subscribe((db) => {
    //     this.tagS.getAllTags()
    //       .then((tags: any) => {

    //       });
    //   })
    // );
  }

  toggleTag(tag) {
    const selectedTagIndex = this.tagS.activeTags.findIndex(t => t.id === tag.id);
    if (~selectedTagIndex) {
      this.tagS.activeTags.splice(selectedTagIndex, 1);
    } else {
      this.tagS.activeTags.push(tag);
    }
    this.onTagsChange.emit({});
  }

  isSelected(tag) {
    // console.info(tag);
    return this.tagS.activeTags.find(t => t.id === tag.id);
  }

  ngOnDestroy() {
    this.obs.forEach(ob => {
      ob.unsubscribe();
    });
  }
}
