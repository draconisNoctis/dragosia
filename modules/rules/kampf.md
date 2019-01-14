# Kampf

## Initiative

Um zu entscheiden, wer in einem Kampf zuerst agieren darf, wird zu Beginn des Kampfes die Initiative ausgewürfelt.
Dies geschieht durch eine Probe auf `IN`, `K` und `G`. Da die Probe sowohl auf `K` als auch auf `G` abgelegt wird,
werden Modifikationen sowohl für körperliche als auch für geistige Proben einberechnet; 
insbesondere Erschwernisse durch Wunden und "Mana-Wunden".

## Aktionen

Normalerweise hat jeder Charakter zwei Aktionen pro Kampfrunde. Typischerweise Angriff und Abwehr bzw. umgekehrt.

## Nahkampf Angriff

Nachkampf Angriffe sind eine [`Vergleichende Probe`](./proben.md). Hierbei Würfelt zuerst der Angreifer auf
`ST/AG`, `N`, `Waffentalent` und `Waffen-AT` und stellt die Güte des Angriffs fest.

Nachdem, falls möglich, die Abwehr gewürfelt wurde und der Angriff besser als die Abwehr war, werden mit einer Probe auf
die Differenz von Angriff und Abwahr plus eventueller Schadens-Modifikationen der Waffe die Trefferpunkte erwürfelt.

> ***Beispiel:***  
> *Der Krieger Adros greift Valore mit einem Langschwert (+4 Schaden) an und würfelt hierbei 5 Erfolge, da Valore nur mit 3 Erfolge
> bei seiner Parade erwürfelt können nun mit `5 - 3 + 4 = 6` Würfeln die Trefferpunkte ausgewürfelt werden.*


## Nahkampf Abwehr

Nach dem Angriff wird eine entsprechende Abwehr gewürfelt. Sollte die Güte der Abwehr größer als der Angriff sein,
ist die Attacke fehlgeschlagen und es wird kein Schaden ausgewürfelt.

### Parade

Die Parade wird, ähnlich wie der Angriff, auf `ST/AG`, `N`, `Waffentalent` und `Waffen-PA` gewürfelt.

### Schildblock

Falls der abwehrende Charakter des Schildkampfes mächtig ist und ein Schild parat hat, kann die Abwehr auch auf
`ST`, `N`, `Schilde` und `Schild-PA` gewürfelt werden.

### Ausweichen

Als letzte Option steht noch das Ausweichen bereit, dieses wird auf `AG`, `N` und `Körperbeherrschung` gewürfelt.
Falls diese jedoch misslingt, erhält der Charakter nicht nur einen schmerzhaften Treffer sondern verliert auch seine nächste Aktion.

## Fernkampf Angriff

Ein Fernkampf wird auf `ST/AG/IN`, `F`, `Waffentalent` und `Waffen-AT` gewürfelt. 
Schnelle Geschosse wie Pfeile und Bolze können nicht pariert werden, sie werden am besten mit einem Schild geblockt oder,
falls die Zeit es zulässt, ausgewichen. Langsamere Fernkampfwaffen wie Wurfmesser oder -Beile können auch pariert werden.

Pfeile und Bolzen verursachen immer, wenn sie Schadenspunkte verursachen, eine (zusätzliche) Wunde.

## Trefferpunkte & Schadenspunkte

Der Unterschied zwischen Treffer- und Schadenspunkten liegt darin, 
dass von Trefferpunkten noch gegen die Abhärtung/Rüstung gewürfelt muss.
Hierzu wird auf `KO` und `Rüstwert` gewürfelt und die Anzahl Erfolge von den Trefferpunkten abgezogen.
