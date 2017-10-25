import { PostService } from '../services/post.service';
import { Component, OnInit } from '@angular/core';
import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';
import { BadRequestError } from '../common/bad-request-error';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor(
    private service: PostService
  ) { }

  posts: any[];

  ngOnInit() {
    this.getAll();
  }


  getAll() {
    this.service.getAll()
      .subscribe(posts => this.posts = posts);
  }


  createPost(input: HTMLInputElement) {
    const post = { title: input.value };
    this.posts.splice(0, 0, post);

    input.value = '';

    this.service.create(post)
      .subscribe(
      newPost => {
        post[`id`] = newPost.id;
        console.log(newPost);
      },
      (err: AppError) => {
        this.posts.splice(0, 1);

        if (err instanceof BadRequestError) {
          // this.form.serErrors(err.originalError);
        } else {
          throw err;
        }
      });
  }


  updatePost(post) {
    this.service.update(post)
      .subscribe(updatedPost => console.log(updatedPost));
  }


  deletePost(post) {
    const idx = this.posts.indexOf(post);
    this.posts.splice(idx, 1);

    this.service.delete(post.id)
      .subscribe(
      null,
      (err: AppError) => {
        this.posts.splice(idx, 0, post);

        if (err instanceof NotFoundError) {
          alert('This post has already been deleted');
        } else {
          throw err;
        }
      });
  }

}
