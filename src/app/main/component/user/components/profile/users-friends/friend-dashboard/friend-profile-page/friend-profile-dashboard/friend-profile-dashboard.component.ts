import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendModel, UserDashboardTab, UsersCategOnlineStatus } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { UserOnlineStatusService } from '@global-user/services/user-online-status.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-friend-profile-dashboard',
  templateUrl: './friend-profile-dashboard.component.html',
  styleUrls: ['./friend-profile-dashboard.component.scss']
})
export class FriendProfileDashboardComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  private scroll = false;
  private currentFriendPage = 0;
  private currentMutualPage = 0;
  userId: number;
  isActiveInfinityScroll = false;
  isFetching = true;
  numberAllFriends: number;
  numberAllMutualFriends: number;
  currentUserId: number;
  friendsList: FriendModel[] = [];
  mutualFriendsList: FriendModel[] = [];
  selectedIndex = 0;
  userDashboardTab = UserDashboardTab;
  readonly absentContent = 'assets/img/noNews.svg';

  constructor(
    private userFriendsService: UserFriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private userOnlineStatusService: UserOnlineStatusService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params.userId;
    this.currentUserId = +this.route.snapshot.params.id;
    this.selectedIndex = +Object.values(UserDashboardTab).indexOf(this.route.snapshot.queryParams.tab);
    this.isActiveInfinityScroll = this.selectedIndex === 3 || this.selectedIndex === 4;
    this.getAllFriends(this.userId);
    if (this.userId !== this.currentUserId) {
      this.getMutualFriends();
    }
  }

  private getAllFriends(id: number, page?: number): void {
    this.isFetching = true;
    this.userFriendsService
      .getUserFriends(id, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.numberAllFriends = data.totalElements;
        this.friendsList = this.friendsList.concat(data.page);
        this.userOnlineStatusService.addUsersId(
          UsersCategOnlineStatus.usersFriends,
          data.page.map((el) => el.id)
        );
        this.scroll = false;
        this.isFetching = false;
      });
  }

  private getMutualFriends(page?: number): void {
    this.isFetching = true;
    this.userFriendsService
      .getMutualFriends(this.userId, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.numberAllMutualFriends = data.totalElements;
        this.mutualFriendsList = this.mutualFriendsList.concat(data.page);
        this.userOnlineStatusService.addUsersId(
          UsersCategOnlineStatus.mutualFriends,
          data.page.map((el) => el.id)
        );
        this.scroll = false;
        this.isFetching = false;
      });
  }

  onScroll(): void {
    if (this.selectedIndex === 3 && !this.scroll && this.friendsList.length < this.numberAllFriends) {
      this.scroll = true;
      this.currentFriendPage += 1;
      this.getAllFriends(this.userId, this.currentFriendPage);
    }
    if (this.selectedIndex === 4 && !this.scroll && this.mutualFriendsList.length < this.numberAllMutualFriends) {
      this.scroll = true;
      this.currentMutualPage += 1;
      this.getMutualFriends(this.currentMutualPage);
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    const tabName = Object.values(UserDashboardTab)[tabChangeEvent.index];
    const url = this.router.createUrlTree([], { relativeTo: this.route, queryParams: { tab: tabName } }).toString();
    this.location.replaceState(url);
    this.isActiveInfinityScroll = tabChangeEvent.index === 3 || tabChangeEvent.index === 4;
  }

  ngOnDestroy(): void {
    this.userOnlineStatusService.removeUsersId(UsersCategOnlineStatus.mutualFriends);
    this.userOnlineStatusService.removeUsersId(UsersCategOnlineStatus.usersFriends);
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
