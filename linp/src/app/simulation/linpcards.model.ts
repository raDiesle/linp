import {Injectable} from '@angular/core';

@Injectable()
export class LinpCardsModelService {

  constructor() {
  }

  getCards(){
    const cards = [
      "Plastik", "Kamera", "Spiel", "Nacht", "Dieb", "Ruder", "Aktie", "Salbe", "Warze", "Klippe", "Peitsche", "Dresden",
      "Winter", "Stock", "Gärtner", "Bohne", "Löwe", "Flur", "Kraftwerk","Pfanne", "Schlauch", "Viertel", "Kiste", "Brille",
      "Stamm", "Kino", "Bande", "Schlüssel", "Gruppe", "Hafen","Kamerad", "Sprung", "Tritt", "Hurrikan", "Schlag", "Köln",
      "Wind", "Mikrofon", "Mann", "Becher", "Alkohol", "Treppe", "Land", "Natur", "Lunge", "Gangway", "Stahl", "Ägypten",
      "Feder", "Bogen", "Kopie", "Tasche", "Wolf", "Wiese", "Zar", "Ostern", "Stille", "Konzert", "Mund", "San Francisco",
      "Ufer", "Sport", "Mehl", "Silvester", "Schnabel","Rakete", "Redner", "Terrine", "Beil", "Linse", "Klappe", "Absatz",
      "Markt", "Kasten", "Kind", "Uhr", "Salz", "Garten", "Manchester", "Nelke", "Mähne", "Gebet", "Sack", "Hof",
      "Erde","Note", "Fahne", "Nagel", "Esel", "Schuppen","New York", "Rose", "Porträt", "Geschoß", "Schlaf", "Australien",
      "Strand", "Spieler", "Bauer", "Weihnachten", "Hahn","Dach","Präsident", "Werkzeug","Kies", "Lanze", "Hals", "Jerusalem",
      "Sonne", "Prinzessin","Schlachter", "Brot", "Hund", "Knopf", "Camping", "Plombe", "Sarg", "Kamm", "Rücken", "Hemd",
      "Wald", "Radio", "Kreide", "Topf", "Zucker", "Haus", "Ingenieur", "Tatze", "Tennis", "Hügel", "Leder", "Kairo",
      "Gold", "Gitarre", "Schwester", "Bürger", "Gas", "Stollen", "Blüte", "Faust", "Dolch", "Brust", "Europa",
      "Höhle", "Papier", "Bauch", "Hälfte", "Stachel", "Skateboard", "Schloss", "Pudding", "Staubsauger", "Matratze", "Schrank", "Fluss",
      "Küste", "Ball", "Trecker", "Kalender", "Haar", "Drachen", "Professor", "Welle", "Semester", "Leiste", "Zahn", "Wien",



    ]
  }


}
