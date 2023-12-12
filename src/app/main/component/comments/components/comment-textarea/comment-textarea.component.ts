import { SocketService } from '@global-service/socket/socket.service';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  Output,
  Input,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { TaggedUser } from '../../models/comments-model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatOption } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-textarea',
  templateUrl: './comment-textarea.component.html',
  styleUrls: ['./comment-textarea.component.scss']
})
export class CommentTextareaComponent implements OnInit, AfterViewInit, OnChanges {
  private userId: number;
  private searchQuery = '';
  private lastTagCharIndex: number;
  private charToTagUsers = ['@', '#'];
  private range;

  public content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(8000)]);
  public suggestedUsers: TaggedUser[] = [];
  public isPlaceHolderVisible = true;
  public isDropdownVisible: boolean;
  public cursorPosition: {
    top: number;
    left: number;
  };
  public isTextareaFocused: boolean;

  @ViewChild('commentTextarea') commentTextarea: ElementRef;
  @ViewChild('dropdown', { read: ElementRef, static: false }) dropdown: ElementRef;
  @ViewChildren(MatOption) options: QueryList<MatOption>;

  @Output() commentText = new EventEmitter<{ text: string; innerHTML: string }>();
  @Input() commentTextToEdit: string;
  @Input() commentHtml: string;
  @Input() placeholder: string;

  constructor(
    private SocketService: SocketService,
    private localStorageService: LocalStorageService,
    public elementRef: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => (this.userId = id));
    this.SocketService.onMessage(`/topic/${this.userId}/searchUsers`).subscribe((data: TaggedUser[]) => {
      if (data.length) {
        this.suggestedUsers = data.splice(0, 10);
        this.isDropdownVisible = this.commentTextarea.nativeElement.classList.contains('focused');
      } else {
        this.suggestedUsers = [];
        this.isDropdownVisible = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.commentTextToEdit) {
      this.commentTextarea.nativeElement.innerHTML = this.commentTextToEdit;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.commentHtml?.currentValue === '') {
      this.commentTextarea.nativeElement.innerHTML = '';
    }
  }

  checkInput(event: InputEvent): void {
    this.content.setValue(this.commentTextarea.nativeElement.textContent);
    this.emitCommentText();

    if (event.data) {
      this.getSelectionStart();
      this.isDropdownVisible = false;
      const textBeforeCaret = this.range.startContainer.textContent.slice(0, this.range.startOffset);
      this.lastTagCharIndex = Math.max(...[...this.charToTagUsers].map((char) => textBeforeCaret.lastIndexOf(char)));
      this.searchQuery = textBeforeCaret.slice(this.lastTagCharIndex + 1);
      if (this.lastTagCharIndex !== -1 && !this.searchQuery.includes(' ')) {
        this.sendSocketMessage(this.searchQuery);
        this.updateCursorPosition();
      }
    }
  }

  onCommentTextareaFocus(): void {
    this.isTextareaFocused = true;
  }

  onCommentTextareaBlur(event: FocusEvent): void {
    this.isTextareaFocused = false;
    this.isDropdownVisible = event.relatedTarget instanceof HTMLElement && event.relatedTarget.classList.contains('mat-option');
  }

  onDropdownBlur(event: FocusEvent): void {
    this.isDropdownVisible = event.relatedTarget instanceof HTMLElement && event.relatedTarget.classList.contains('mat-option');
    this.isTextareaFocused =
      (event.relatedTarget instanceof HTMLElement && event.relatedTarget.classList.contains('mat-option')) ||
      event.relatedTarget === this.commentTextarea.nativeElement;
    document.body.style.overflow = this.isDropdownVisible ? 'hidden' : 'auto';
  }

  onDropdownKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    document.body.style.overflow = 'hidden';

    if (this.options.length === 0 || !this.isDropdownVisible) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = this.options.toArray().findIndex((option) => option._getHostElement() === activeElement);

    switch (event.key) {
      case 'Escape':
      case 'Backspace': {
        this.isDropdownVisible = false;
        this.setFocusCommentTextarea();
        break;
      }

      case 'Enter':
        this.selectSuggestion(this.suggestedUsers[currentIndex]);
        break;
    }
  }

  onCommentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    this.insertTextAtCursor(text);
    this.content.setValue(this.commentTextarea.nativeElement.textContent);
    this.emitCommentText();
  }

  private insertTextAtCursor(text: string): void {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
  }

  insertNodeAtCursor(user: TaggedUser, tagChar: string) {
    const selection = window.getSelection();

    const userTagNode = document.createElement('a');
    userTagNode.contentEditable = 'false';
    userTagNode.textContent = tagChar + user.userName;
    userTagNode.setAttribute('data-userId', user.userId.toString());
    userTagNode.style.fontWeight = '700';
    userTagNode.classList.add('user-tag');
    this.range.insertNode(userTagNode);

    this.range.setStartAfter(userTagNode);
    this.range.setEndAfter(userTagNode);
    selection.removeAllRanges();
    selection.addRange(this.range);
  }

  getSelectionStart(): void {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.range = selection.getRangeAt(0);
      }
    }
  }

  updateCursorPosition(): void {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      this.cursorPosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };
    }
  }

  sendSocketMessage(query: string): void {
    this.SocketService.send('/app/getUsersToTagInComment', { currentUserId: this.userId, searchQuery: query });
  }

  setFocusCommentTextarea(): void {
    this.commentTextarea.nativeElement.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(this.commentTextarea.nativeElement);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  selectSuggestion(user: TaggedUser): void {
    const tagChar = this.range.startContainer.textContent[this.lastTagCharIndex];
    this.isDropdownVisible = false;
    this.removeSearchQuery();
    this.insertNodeAtCursor(user, tagChar);
    this.content.setValue(this.commentTextarea.nativeElement.textContent);
    this.emitCommentText();
  }

  private emitCommentText(): void {
    this.commentText.emit({
      text: this.commentTextarea.nativeElement.textContent,
      innerHTML: this.commentTextarea.nativeElement.innerHTML
    });
  }

  private removeSearchQuery(): void {
    const currentNode = this.range.startContainer;
    const currentStartOffset = this.range.startOffset;
    currentNode.textContent =
      currentNode.textContent.slice(0, currentStartOffset - this.searchQuery.length - 1) +
      currentNode.textContent.slice(currentStartOffset);

    this.range.setStart(this.range.startContainer, currentStartOffset - this.searchQuery.length - 1);
  }
}
