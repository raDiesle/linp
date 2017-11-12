import {Injectable} from '@angular/core';

@Injectable()
export class LinpCardsModelService {

  constructor() {
  }

  getCards() {
    const cards = [
      'Plastik', 'Kamera', 'Spiel', 'Nacht', 'Dieb', 'Ruder', 'Aktie', 'Salbe', 'Warze', 'Klippe', 'Peitsche', 'Dresden',
      'Winter', 'Stock', 'Gärtner', 'Bohne', 'Löwe', 'Flur', 'Kraftwerk', 'Pfanne', 'Schlauch', 'Viertel', 'Kiste', 'Brille',
      'Stamm', 'Kino', 'Bande', 'Schlüssel', 'Gruppe', 'Hafen', 'Kamerad', 'Sprung', 'Tritt', 'Hurrikan', 'Schlag', 'Köln',
      'Wind', 'Mikrofon', 'Mann', 'Becher', 'Alkohol', 'Treppe', 'Land', 'Natur', 'Lunge', 'Gangway', 'Stahl', 'Ägypten',
      'Feder', 'Bogen', 'Kopie', 'Tasche', 'Wolf', 'Wiese', 'Zar', 'Ostern', 'Stille', 'Konzert', 'Mund', 'San Francisco',
      'Ufer', 'Sport', 'Mehl', 'Silvester', 'Schnabel', 'Rakete', 'Redner', 'Terrine', 'Beil', 'Linse', 'Klappe', 'Absatz',
      'Markt', 'Kasten', 'Kind', 'Uhr', 'Salz', 'Garten', 'Manchester', 'Nelke', 'Mähne', 'Gebet', 'Sack', 'Hof',
      'Erde', 'Note', 'Fahne', 'Nagel', 'Esel', 'Schuppen', 'New York', 'Rose', 'Porträt', 'Geschoß', 'Schlaf', 'Australien',
      'Strand', 'Spieler', 'Bauer', 'Weihnachten', 'Hahn', 'Dach', 'Präsident', 'Werkzeug', 'Kies', 'Lanze', 'Hals', 'Jerusalem',
      'Sonne', 'Prinzessin', 'Schlachter', 'Brot', 'Hund', 'Knopf', 'Camping', 'Plombe', 'Sarg', 'Kamm', 'Rücken', 'Hemd',
      'Wald', 'Radio', 'Kreide', 'Topf', 'Zucker', 'Haus', 'Ingenieur', 'Tatze', 'Tennis', 'Hügel', 'Leder', 'Kairo',
      'Gold', 'Gitarre', 'Schwester', 'Bürger', 'Gas', 'Stollen', 'Blüte', 'Faust', 'Dolch', 'Brust', 'Europa',
      'Höhle', 'Papier', 'Bauch', 'Hälfte', 'Stachel', 'Skateboard', 'Schloss', 'Pudding', 'Staubsauger', 'Matratze', 'Schrank', 'Fluss',
      'Küste', 'Ball', 'Trecker', 'Kalender', 'Haar', 'Drachen', 'Professor', 'Welle', 'Semester', 'Leiste', 'Zahn', 'Wien',
      'Eis', 'Lied', 'Stift', 'Schein', 'Schale', 'Pferd', 'Altar', 'Beere', 'Bart', 'Automat', 'Knochen', 'Berlin',
      'Wolle', 'Gott', 'Löffel', 'Chef', 'Decke', 'Minister', 'Teich', 'Ski', 'Graben', 'Fleisch', 'Bagdad',
      'Kirche', 'Platte', 'Soldat', 'Morgen', 'Kater', 'Mast', 'Mechaniker', 'Strumpf', 'Wimper', 'Modell', 'Finger', 'Hamburg',
      'Kohle', 'Trommel', 'Tante', 'Teller', 'Korn', 'Tür', 'Edinburg', 'Hering', 'Körper', 'Floß', 'Kissen', 'Frankreich',
      'Wasser', 'Satz', 'Gewehr', 'Abend', 'Zoo', 'Boot', 'Mensch', 'Strickzeug', 'Zelle', 'Kufe', 'Ei', 'Heide',
      'Wetter', 'Fußball', 'Bücherei', 'Suppe', 'Bär', 'Wagen', 'Sidney', 'Schauer', 'Rechner', 'Gondel', 'Single', 'Pyramide',
      'Scheibe', 'Engel', 'Zettel', 'Klammer', 'Kaffee', 'Kanal', 'Vorstand', 'Stier', 'Paddel', 'Flocke', 'Herz', 'Bankok',
      'See', 'Ritter', 'Plan', 'Obst', 'Kuh', 'Keller', 'Kammer', 'Halbzeit', 'Sieb', 'Drittel', 'Kopf', 'Faden',
      'Sand', 'Stimme', 'Lehrer', 'Stecker', 'Frucht', 'Straße', 'Äquator', 'Biene', 'Bruch', 'Bombe', 'Schwanz', 'München',
      'Weide', 'Stadt', 'Sekretärin', 'Arbeit', 'Huf', 'Regal', 'Schreiber', 'Wippe', 'Tusche', 'Lager', 'Blase', 'Bremen',
      'Holz', 'Orgel', 'Frau', 'Tag', 'Köchin', 'Segel', 'Klemptner', 'Sense', 'Stoß', 'Tornado', 'Jungfrau', 'Istanbul',
      'Vulkan', 'Trompete', 'Tischler', 'Mittag', 'Futter', 'Lampe', 'Mixer', 'Trieb', 'Wirbel', 'Kugel', 'Lack', 'Osten',
      'Herbst', 'Turm', 'Ofen', 'Käse', 'Fliege', 'Terrasse', 'Magazin', 'Pedal', 'Schotter', 'Kippe', 'Netz', 'Arktis',
      'Wüste', 'Flöte', 'Handschuh', 'Tafel', 'Kern', 'Kutsche', 'Bonn', 'Bordeaux', 'Stürmer', 'Beamer', 'Schritt', 'Athen',
      'Feuer', 'Geige', 'Puppe', 'Hammer', 'Elefant', 'Blume', 'Theater', 'Nilpferd', 'Nacken', 'Gemälde', 'Spitze', 'Teheran',
      'Hose', 'Schild', 'Fahrer', 'Kerze', 'Schere', 'Auge', 'Skyline', 'Stärke', 'Schlamm', 'Masche', 'Schwung', 'Socke',
      'Frühling', 'Kassette', 'Bäcker', 'Wurst', 'Lamm', 'Bein', 'Panzer', 'Parfüm', 'Platz', 'Speicher', 'Gummi', 'Stockholm',
      'Feld', 'Film', 'Läufer', 'Zange', 'Schlange', 'Schiff', 'Oslo', 'Safari', 'Stirn', 'Gesetz', 'Seide', 'Manhattan',
      'Hut', 'Klavier', 'Mutter', 'Kreis', 'Bonbon', 'Auto', 'Delhi', 'Frosch', 'Hirn', 'Einlage', 'Hand', 'Quelle',
      'Kleid', 'Krone', 'Erfinder', 'Brei', 'Fisch', 'Bad', 'Hochhaus', 'Pflaster', 'Projektor', 'Karre', 'Handschelle', 'Naht',
      'Baum', 'Kreuz', 'Onkel', 'Tasse', 'Meister', 'Balkon', 'Dublin', 'Fühler', 'Höcker', 'Fax', 'Latte', 'Griechenland',
      'Berg', 'Fernseher', 'Wohnung', 'Besen', 'Haut', 'Dusche', 'Pfleger', 'Jogging', 'Schraube', 'Kupfer', 'Bock', 'Norden',
      'Stein', 'Bett', 'Muster', 'Kette', 'Milch', 'Boden', 'Herzog', 'Strauß', 'Schorchel', 'Gewitter', 'Flamme', 'Moskau',
      'Rasen', 'Kragen', 'Krawatte', 'Zeit', 'Pfote', 'Fenster', 'Hooligan', 'Stück', 'Ruf', 'Luft', 'Ohr', 'Ozean',
      'Himmel', 'Königin', 'Arm', 'Stunde', 'Krallen', 'Zimmer', 'Playboy', 'Wohnwagen', 'Tüte', 'Kutter', 'Stoff', 'Prag',
      'Urwald', 'Pinsel', 'Tinte', 'Klasse', 'Schwein', 'Zelt', 'Säule', 'Kotelett', 'Termin', 'Moor', 'Schuß', 'Rom',
      'Mond', 'Schwert', 'Schaum', 'Kuchen', 'Maus', 'Büro', 'Denkmal', 'Studio', 'Pult', 'Kanne', 'Strich', 'Bund',
      'Eisen', 'Foto', 'Drucker', 'Brett', 'Flügel', 'Wurf', 'Scheune', 'Malz', 'Spüle', 'Matte', 'Loch', 'Brücke',
      'Glas', 'Schokolade', 'Folie', 'Schüssel', 'Banane', 'Brunnen', 'Gräfin', 'Pullover', 'Kegel', 'Donner', 'Zunge', 'Peking',
      'Silber', 'Taste', 'Bruder', 'Telefon', 'Leiter', 'Bus', 'Anlage', 'Blatt', 'Euter', 'CD', 'Glied', 'Amerika',
      'Mauer', 'Becken', 'Füller', 'Stuhl', 'Kakao', 'Zug', 'Dirigent', 'Kappe', 'Inline-Skates', 'Dampf', 'Messe', 'Belfast',
      'Tal', 'Getränk', 'Sattel', 'Woche', 'Tiger', 'Reifen', 'St. Petersburg', 'Rauch', 'Raumschiff', 'Gewand', 'Sex', 'Kreml',
      'Sturm', 'Kampf', 'Idee', 'Peife', 'Krebs', 'Schaukel', 'Statue', 'Teig', 'Schleife', 'Marsch', 'Nase', 'Filz',
      'Gebirge', 'Ring', 'Frisörin', 'Jahr', 'Vogel', 'Schlitten', 'Schmied', 'Zimt', 'Rost', 'Stab', 'Creme', 'Watt',
      'Karte', 'Instrument', 'Schüler', 'Tisch', 'Farbe', 'Weg', 'Beamter', 'Boa', 'Golf', 'Bronze', 'Liebe', 'Pol',
      'Park', 'Gabel', 'Vater', 'Nadel', 'Tee', 'Waage', 'Mark', 'Eichel', 'Flosse', 'DVD', 'Fessel', 'Afrika',
      'Meer', 'Video', 'Familie', 'Monat', 'Fell', 'Tor', 'Parade', 'Tropfen', 'Turbine', 'Kunst', 'Blut', 'Süden',
      'Stern', 'Kaiser', 'Tuch', 'Kartoffel', 'Kamel', 'Flugzeug', 'Schwimmer', 'Plüsch', 'Roller', 'Hobel', 'Samt', 'Schuh',
      'Blitz', 'Maler', 'Reiter', 'Minute', 'Katze', 'Kanu', 'Seattle', 'Samen', 'Wange', 'Premiere', 'Ständer', 'Westen',
      'Klima', 'Hausfrau', 'Block', 'Braten', 'Ente', 'Stau', 'Graffiti', 'Schnauze', 'Rohr', 'Harke', 'Droge', 'Zürich',
      'Sommer', 'Rolle', 'Zwilling', 'Butter', 'Floh', 'Fahrrad', 'Verein', 'Palette', 'Sechseck', 'Knoten', 'Pille', 'Madrid',
      'Schule', 'Bild', 'Boxer', 'Messer', 'Apfel', 'Wettrennen', 'Beatles', 'Bluse', 'Bowling', 'Brise', 'Papst', 'Burg',
      'Strom', 'Schach', 'Mühle', 'Kessel', 'Horn', 'Bahn', 'Anwalt', 'Pulver', 'Mündung', 'Maschine', 'Nummer', 'Asien',
      'Metall', 'Ton', 'Taucher', 'Niete', 'Held', 'Verkehr', 'Kanzler', 'Birne', 'Darm', 'Bürste', 'Kuss', 'London'
    ]
    return cards;
  }
}
