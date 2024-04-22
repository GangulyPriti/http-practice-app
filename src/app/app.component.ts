import { Component, OnDestroy, OnInit } from '@angular/core';
import { IResponseData } from './post.model';
import { PostService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: IResponseData[] = [];
  isFetching = false;
  error = null;
  private subscription: Subscription;
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.onFetchPosts();
    this.subscription = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
  }

  onCreatePost(postData: IResponseData) {
    this.postService.createAndStorePost(postData.title, postData.content);
    setTimeout(() => {
      this.onFetchPosts();
    }, 1000);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPost().subscribe(
      (postData: IResponseData[]) => {
        this.isFetching = false;
        this.loadedPosts = postData;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePostData().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  onHandler() {
    this.error = null;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
