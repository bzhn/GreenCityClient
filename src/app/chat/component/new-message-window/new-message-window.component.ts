import { Component, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CHAT_ICONS } from '../../chat-icons';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ChatsService } from '../../service/chats/chats.service';
import { Subject } from 'rxjs';
import { CommonService } from '../../service/common/common.service';
import { SocketService } from '../../service/socket/socket.service';
import { Message } from '../../model/Message.model';
import { UserService } from '@global-service/user/user.service';
import { FriendModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-new-message-window',
  templateUrl: './new-message-window.component.html',
  styleUrls: ['./new-message-window.component.scss']
})
export class NewMessageWindowComponent implements OnInit, AfterViewChecked, OnDestroy {
  chatIcons = CHAT_ICONS;
  userSearchField = '';
  private onDestroy$ = new Subject();
  userSearchControl: FormControl = new FormControl();
  messageControl: FormControl = new FormControl('', [Validators.max(250)]);
  showEmojiPicker = false;
  isHaveMessages = true;
  @ViewChild('chat') chat: ElementRef;

  constructor(
    public chatsService: ChatsService,
    private commonService: CommonService,
    private socketService: SocketService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.userSearchControl.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe((newInput) => {
      this.userSearchField = newInput;
      this.chatsService.searchFriends(newInput);
    });

    this.chatsService.currentChatMessagesStream$.subscribe((messages) => {
      this.isHaveMessages = messages.length !== 0;
    });
  }

  ngAfterViewChecked(): void {
    const element: HTMLElement = this.chat.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  close() {
    this.commonService.newMessageWindowRequireCloseStream$.next(true);
  }

  checkChat(friend: FriendModel) {
    if (friend.chatId) {
      const userChat = this.chatsService.userChats.find((chat) => chat.id === friend.chatId);
      this.chatsService.setCurrentChat(userChat);
    } else {
      this.socketService.createNewChat(friend.id, false, true);
    }
  }

  sendMessage() {
    const messageContent = this.messageControl.value.trim();
    if (messageContent) {
      const message: Message = {
        roomId: this.chatsService.currentChat.id,
        senderId: this.userService.userId,
        content: this.messageControl.value
      };
      this.socketService.sendMessage(message);
      this.messageControl.setValue('');
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    const newValue = this.messageControl.value ? this.messageControl.value + event.emoji.native : event.emoji.native;
    this.messageControl.setValue(newValue);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
