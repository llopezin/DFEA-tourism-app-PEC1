import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import Activity from 'src/app/shared/models/activity.model';
import User from 'src/app/shared/models/user.model';
import { StorageService } from 'src/app/shared/services/local-storage-service';
import { StoreactivitiesService } from 'src/app/shared/services/store-activities.service';
import { StoreUserService } from 'src/app/shared/services/store-user.service';
import { UserService } from 'src/app/shared/services/user.service';
import {
  editActivity,
  getAllActivities,
  increaseEnrolledCounter,
} from 'src/app/shared/store/activities-store/actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  public activities: Activity[];
  public activitySelected: Activity;
  public user: User;
  public showErrorMsg: boolean;
  public showSuccessMsg: boolean;
  public favouriteError: boolean;
  public favouriteSuccess: boolean;

  constructor(
    private storeUserService: StoreUserService,
    private userService: UserService,
    private storage: StorageService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.user = this.storeUserService.user;

    this.store.select('activitiesApp').subscribe((activitiesResponse) => {
      this.activities = activitiesResponse.activities;
      if (this.activitySelected === undefined) {
        this.selectActivity();
      } else {
        this.activitySelected = this.getActivityById(this.activitySelected.id);
      }
    });

    this.store.dispatch(getAllActivities());
  }

  signUpToActivity(id) {
    if (this.activityIsSignedUp(id)) {
      this.handleAlreadySignedUpError(id);
      return;
    }

    this.user.activitiesEnrolled.push(id);
    this.userService.updateUser(this.user).subscribe(() => {
      this.storeUserService.user = this.user;
      this.showSuccessMsg = true;
      this.updateActivityEnrolledCounter();
    });
  }

  addToFavourites(id) {
    this.resetErrorMessages();
    this.storage.add(id, 'favourites')
      ? (this.favouriteSuccess = true)
      : (this.favouriteError = true);
  }

  activityIsSignedUp(id) {
    return this.user.activitiesEnrolled.indexOf(id) > -1;
  }

  calculateState(activity: Activity) {
    if (!activity) return;
    return activity.maxEnrolled - activity.usersEnrolled;
  }

  selectActivity(id?: number) {
    this.resetErrorMessages();
    id
      ? (this.activitySelected = this.getActivityById(id))
      : (this.activitySelected = this.activities[0]);
  }

  resetErrorMessages() {
    this.showErrorMsg = false;
    this.showSuccessMsg = false;
    this.favouriteError = false;
    this.favouriteSuccess = false;
  }

  getActivityById(id: number) {
    return this.activities.find((activity) => activity.id === id);
  }

  updateActivityEnrolledCounter() {
    this.store.dispatch(
      increaseEnrolledCounter({
        id: this.activitySelected.id,
      })
    );
  }

  handleAlreadySignedUpError(id) {
    const isSignedUp = this.activityIsSignedUp(id);
    this.showErrorMsg = isSignedUp;
    //if (isSignedUp) return;
  }
}
