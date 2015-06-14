var dnode = require('dnode');

var d = dnode.connect(7070);

var json = '[[{&quot;col&quot;:12,&quot;content&quot;:&quot;FE `inline code`&quot;},{&quot;col&quot;:12,&quot;content&quot;:&quot;GAFE\\n\\n$$\\frac12*a`*b`+12$$&quot;}],[{&quot;col&quot;:8,&quot;content&quot;:&quot;ADAW&quot;},{&quot;col&quot;:16,&quot;content&quot;:&quot;OK&quot;}]]';
//var json = '[[{&quot;col&quot;:12,&quot;content&quot;:&quot;|a|b|\\n|-|-|\\n|c|d|&quot;},{&quot;col&quot;:12,&quot;content&quot;:&quot;GAFE\\n\\n$$\\\\frac12*a`*b`+34567$$ text \\n noch mehr text \\n$$a-125$$&quot;}],[{&quot;col&quot;:8,&quot;content&quot;:&quot;ADAW&quot;},{&quot;col&quot;:16,&quot;content&quot;:&quot;OK&quot;}]]';
//var json = '[[{&qout;col&qout;:24,&qout;content&qout;:&qout;Ein **Linearfaktor** ist ein Ausdruck der Form %%x-N%% ,Â wobei %%x%% die Variable und %%N%% eine konkrete Zahl ist.\\n\\nManche  [Polynome](/1623)  kann man als Produkt von Linearfaktoren schreiben, also in der Form\\n$$f(x) = a \\\\cdot (x-N_1) \\\\cdots (x-N_n).$$\\n\\nDiese Form nennt man die **Linearfaktordarstellung** von %%f%%.\\n\\n\\nFÃ¼r Polynome, bei denen eine solche Darstellung nicht mÃ¶glich ist, gibt es eine Darstellung, die der Linearfaktordarstellung Ã¤hnlich ist:\\n$$f(x) = a \\\\cdot (x-N_1) \\\\cdots (x-N_k) \\\\cdot (\\\\text{Restglied}),$$\\n\\nwobei das Restglied wieder ein Polynom ist, welches keine reellen Nullstellen besitzt.\\n\\nBringt man ein Polynom in seine Linearfaktordarstellung, so nennt man diesen Vorgang  [Linearfaktorzerlegung](/2189).\\n\\n\\n## Linearfaktordarstellung in AbhÃ¤ngigkeit der Nullstellen\\n\\nIm Allgemeinen hat ein Polynom die Form\\n\\n$$a_n \\\\cdot x^n + a_{n-1} \\\\cdot x^{n-1} + a_{n-2} \\\\cdot x^{n-2} + \\\\dots + a_1 \\\\cdot x + a_0$$\\n\\nund besitzt maximal %%n%% Nullstellen.Â \\n\\nEs lassen sich nun 2 FÃ¤lle unterscheiden:\\n\\n- Entweder das Polynom hat %%n%% Nullstellen, wenn man mehrfache Nullstellen dabei auch mehrfach zÃ¤hlt, (es mÃ¼ssen also nicht %%n%% verschiedene Nullstellen sein)\\n\\n- oder das Polynom hat trotz ZÃ¤hlung aller Nullstellen mit ihren Vielfachheiten immer noch weniger als %%n%% Nullstellen.\\n\\n### %%n%% Nullstellen\\n\\nSei %%f(x)= a_n \\\\cdot x^n + a_{n-1} \\\\cdot x^{n-1} + a_{n-2} \\\\cdot x^{n-2} + \\\\dots + a_1 \\\\cdot x + a_0%% ein Polynom, das, wenn man mehrfache Nullstellen mehrfach zÃ¤hlt, **die Maximalzahl von %%n%% Nullstellen** hat.\\n\\nSeien nun %%N_1,\\\\dots,N_n%% die Nullstellen des Polynoms (wobei auch mehrere Nullstellen gleich sein kÃ¶nnen).\\n\\nDann ist\\n$$f(x) = a_n \\\\cdot (x-N_1) \\\\cdots (x-N_n)$$ \\ndie Linearfaktorzerlegung von %%f%%.\\nÂ  Â  Â \\n#### Beispiele\\n\\n&qout;}],[{&qout;col&qout;:6,&qout;content&qout;:&qout;%%f(x)%%&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;%%f(x)=3x^3 - 3x%%&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;%%f(x) = x^3 - 2x^3%%&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;%%f(x) = 2x^3%%&qout;}],[{&qout;col&qout;:6,&qout;content&qout;:&qout;Linearfaktordarstellung&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;%%f(x) = 3 \\\\cdot (x+1) \\\\cdot (x+0) \\\\cdot (x-1)%%&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;%%f(x) = 1 \\\\cdot (x-0) \\\\cdot (x-0) \\\\cdot (x-2)%%&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;%%f(x) = 2 \\\\cdot (x-0) \\\\cdot (x-0) \\\\cdot (x-0)%%&qout;}],[{&qout;col&qout;:6,&qout;content&qout;:&qout;Graph&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;![7931_DFsdfb7YhT.xml](/uploads/legacy/7932_XCFV0jfoKf.png)&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;![Geogebra File: /uploads/legacy/9475_j1ZNFVmvPJ.xml](/uploads/legacy/9476_lq4CBXdlNT.png)&qout;},{&qout;col&qout;:6,&qout;content&qout;:&qout;![7935_G5rxsZEzD9.xml](/uploads/legacy/7936_a8nUYWLij3.png)&qout;}],[{&qout;col&qout;:24,&qout;content&qout;:&qout;### Weniger als %%n%% Nullstellen\\n\\nIm Allgemeinen kann man Ã¼ber den reellen Zahlen aber nicht davon ausgehen, dass ein Polynom seinem Grad entsprechend viele Nullstellen besitzt (z. B. besitzt %%x^2+1%% Â Ã¼berhaupt keine Nullstellen, hat aber Grad 2).\\n\\nFÃ¼r solche Polynome gibt es eine Darstellung, die der Linearfaktordarstellung Ã¤hnlich ist:\\n\\n$$f(x) = a \\\\cdot (x-N_1) \\\\cdots (x-N_k) \\\\cdot (\\\\text{Restglied}),$$\\n\\n\\nwobei das %%\\\\text{Restglied}%% wieder ein Polynom ist, welches allerdings keine reellen Nullstellen besitzt.\\n\\nDas RestgliedÂ lÃ¤sst sich zum Beispiel mit Hilfe der  [Polynomdivision](/1533)  berechnen, indem man das Ausgangspolynom durch die zu seinen Nullstellen gehÃ¶renden Linearfaktoren teilt.&qout;}],[{&qout;col&qout;:24,&qout;content&qout;:&qout;\\n#### Beispiel\\n$$f(x) = x^4 - 1 = 1 \\\\cdot (x-1) \\\\cdot (x+1) \\\\cdot (x^2 + 1)$$&qout;}],[{&qout;col&qout;:24,&qout;content&qout;:&qout;\\n\\n![7951_VdPd6JCBnX.xml](/uploads/legacy/7952_JRWIZajK0u.png)&qout;}],[{&qout;col&qout;:24,&qout;content&qout;:&qout;\\n\\nAuÃŸerdem lÃ¤sst sich das RestgliedÂ selbst als Produkt von Polynomen vom Grad 2 schreiben.\\n\\n/// Warum ist das so?\\n\\nJedes reelle Polynom hat Ã¼ber den [komplexen ZahlenÂ ](/1927) seinem Grad entsprechend viele Nullstellen (dies geht aus dem Hauptsatz der Algebra hervor).\\n\\nDas heiÃŸt, man kann das Restglied in Linearfaktoren zerlegen, wobei die Faktoren alle komplex sind.\\n\\nAuÃŸerdem gilt fÃ¼r komplexe Nullstellen von reellen Polynomen, dass auch das komplex konjugierte der Nullstelle eine Nullstelle ist.Â \\n\\nMultipliziert man nun die zueinander konjugierten Linearfaktoren, so erhÃ¤lt man jeweils ein reelles Polynom vom Grad 2.\\n\\nDamit lÃ¤sst sich das Restglied als Produkt von Polynomen vom Grad 2 schreiben.\\n\\n///\\n\\n## Vorteile der Linearfaktordarstellung\\n\\n\\n### Ablesen der Nullstellen des Polynoms\\n\\nLiegt ein Polynom in Linearfaktordarstellung vor, so kann man an ihm ohne weitere Rechung die Nullstellen und ihre Vielfachheiten ablesen, da in jedem Linearfaktor eine Nullstelle steht.\\n\\n#### Beispiel\\n\\n$$f(x) = x^3 - x^2 - 2x = (x-(-1)) \\\\cdot (x-0) \\\\cdot (x-2)$$\\n\\n![8169_v3ksUcOriu.xml](/uploads/legacy/8170_au5SOeWqgj.png)Â  Â  Â \\n\\nÂ  Â  Â \\n\\n### Vereinfachen von BruchtermenÂ  Â \\n\\nDie  [Linearfaktorzerlegung](/2189) ist eine wichtige Technik im Umgang mit Bruchtermen.\\n\\n&qout;}],[{&qout;col&qout;:12,&qout;content&qout;:&qout;Die Linearfaktorzerlegung verwandelt eine Summe oder Differenz in ein Produkt. Nur aus Produkten heraus kann manÂ **kÃ¼rzen**, nicht aus Differenzen oder Summen. Das KÃ¼rzen vereinfacht den Term oft erheblich.&qout;},{&qout;col&qout;:12,&qout;content&qout;:&qout;**Beispiel**\\n\\n$$\\\\frac{x^Â³ - x^2 - 2x}{x^2 - x - 2} = \\\\frac{(x+1)\\\\cdot x \\\\cdot (x-2)}{(x+1)\\\\cdot (x-2)} = x$$&qout;}],[{&qout;col&qout;:12,&qout;content&qout;:&qout;Will man denÂ **Hauptnenner**Â zweier oder mehrerer Bruchterme bestimmen, muss man zunÃ¤chst die Nenner der BrÃ¼che faktorisieren. Dazu benÃ¶tigt man ihre Linearfaktordarstellung.&qout;},{&qout;col&qout;:12,&qout;content&qout;:&qout;**Beispiel**\\n\\n$$\\\\frac{x^2 + 10}{x^2 - x - 2} + \\\\frac{x-7}{x^2 + x}$$\\nsoll zusammengefasst werden. Mithilife der Linearfaktordarstellung erkennt man den Hauptnennen und kann die Terme gleichnamig machen:\\n$$\\\\frac{x^2 + 10}{x^2 - x - 2} + \\\\frac{x-7}{x^2 + x} =\\n\\\\frac{x^2 + 10}{(x+1) \\\\cdot (x-2)} + \\\\frac{x-7}{x \\\\cdot (x+1)} = \\\\frac{(x^2+10)\\\\cdot x + (x-7) \\\\cdot (x-2)}{x \\\\cdot (x+1) \\\\cdot (x-2)}$$&qout;}],[{&qout;col&qout;:12,&qout;content&qout;:&qout;Durch KÃ¼rzen des Funktionsterms kann man bei [gebrochenrationalen Funktionen](/1741) gegebenenfalls die [stetige Fortsetzung](/1529) ermitteln.&qout;},{&qout;col&qout;:12,&qout;content&qout;:&qout;**Beispiel**\\n\\n$$f(x) = \\\\frac{x^3 - x^2 - 2x}{x^2 - x - 2} = \\\\frac{(x+1) \\\\cdot x \\\\cdot (x-2)}{(x+1)\\\\cdot(x+2)} = x$$ ergibt, dass\\n$$\\\\tilde f(x) = x$$ die stetige Fortsetzung von %%f%% ist.&qout;}]]';

d.on('remote', function (remote) {
    remote.render(json, function (output, exception, message) {
        console.log(output, exception, message);
    });
});