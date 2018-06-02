import { Component, OnInit, Input } from '@angular/core';
import { GamePlayer } from 'app/models/game';
import { FirebaseGameService } from 'app/services/firebasegame.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public newChatMessage;
  public chats: any; // TODO

  @Input()
  private currentGamePlayer: GamePlayer;

  public gameName: string;
  public openPopup: Function;

  constructor(private route: ActivatedRoute,
    private firebaseGameService: FirebaseGameService) { }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    this.firebaseGameService.observeGameChats(this.gameName).subscribe(chats => {
      this.chats = chats;
    });
  }

  public setPopupAction(fn) {
    this.openPopup = fn;
  }

  public sendChat() {
    this.firebaseGameService.addChat(this.gameName, this.newChatMessage, this.currentGamePlayer.name);
    this.newChatMessage = '';
  }

}
