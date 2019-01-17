# Rüstung

Die Rüstung wird entweder als Gesamtwert angegeben oder wird durch die Werte der einzelnen Rüstungszonen bestimmt.

## Rüstungsarten

| Art | Typischer Rüstschutz |
|-----|----------------------|
| Dicker Stoff | 1 |
| Leder | 2 |
| Kette | 4 |
| Platte | 6 |

## Zonenrüstung

Um den Gesamtrüstungsschutz aus den einzelnen Zonen zu berechnen, werden die Rüstwerte der einzelnen Zonen 
(Kopf, Brust, Rücken, Linker Arm, Rechter Arm, Linkes Bein und Rechtes Bein) mit ihrem jeweiligen Faktor multipliziert, 
anschließend summiert und durch 28 geteilt. Anschließend ergibt der echt gerundete Wert den Gesamtrüstungsschutz.

| Zone | Faktor |
|------|:------:|
| Kopf | 2 |
| Brust/Rücken | 5 |
| Arme/Beine | 4 |

> ***Beispiel:***
> Der Gladiator Temyr trägt einen Lederharnisch, lederne Bein- und Armschienen, lederne Beintaschen und eine Gladiatorenschulter am rechten Arm.
> Also insgesamt einen Rüstschutz von **2**.
> ```
> Brust         3   * 5     = 15
> Rücken        2   * 5     = 10
> Linker Arm    1   * 4     = 4
> Rechter Arm   2   * 4     = 8
> Linkes Bein   1   * 4     = 4
> Rechtes Bein  1   * 4     = 4
>                           = 45 / 28 = 1.6
> ```
>

## Behinderung

Sofern nicht anders angegeben entspricht die Behinderung (`BE`) der Rüstung ihrem Rüstschutz. 
Die effektive Behinderung (`eBE`) hat hierbei Auswirkungen auf alle körperlichen Proben. 
Die effektive Behinderung errechnet sich aus `BE - ST` und wird auf die Probenschwelle angerechnet.

