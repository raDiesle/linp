import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GamePlayer } from 'app/models/game';
import { FirebaseGameService } from 'app/services/firebasegame.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public newChatMessage;
  public chats: any; // TODO
  private allChatsCache: any;
  private pageCount = 1;
  public disableLoadMore: boolean = null;
  readonly offset = 4;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input()
  private loggedinGamePlayerName: string;

  public gameName: string;
  public openPopup: Function;

  constructor(private route: ActivatedRoute,
    private firebaseGameService: FirebaseGameService) { }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    this.firebaseGameService.observeGameChats(this.gameName).subscribe(chats => {
      this.allChatsCache = chats;
      this.chats = this.paginate();
    });

    this.firebaseGameService.observeLoggedInPlayerProfile()
      .subscribe(gamePlayer => this.loggedinGamePlayerName = gamePlayer.name);
  }

  private paginate(): any {
    const minus = (this.offset * this.pageCount);
    const isLimitReached = minus >= this.allChatsCache.length;
    this.disableLoadMore = isLimitReached;
    const normalizeMinus = isLimitReached ? this.allChatsCache.length : minus;
    const startingAt = this.allChatsCache.length - normalizeMinus;
    return this.allChatsCache.slice(startingAt);
  }

  public loadMore(): void {
    this.pageCount = this.pageCount + 1;
    this.chats = this.paginate();
  }

  public setPopupAction(fn) {
    this.openPopup = fn;
  }

  public sendChat() {
    this.firebaseGameService.addChat(this.gameName, this.newChatMessage, this.loggedinGamePlayerName);
    this.newChatMessage = '';
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
