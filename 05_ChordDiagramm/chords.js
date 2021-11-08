/*
Ich habe mich bei der Erstellung dieser Visualisierung an einer Vorlage auf der Webseite von d3 orientiert.
Die Daten, welche unter diesem Abschnitt angegeben sind, stammen aus dem von mir erstellten und gesäuberten Dataset.
Die Berechnung und Formatierung habe ich in einem Python-Skript vorgenommen, da ich dies nur mit Python hinbekommen habe. Dieses Skript befindet sich in dem gleichen Ordner wie die HTML-Datei.
*/

/*
Variablen:
- g = Gruppen des Diagramms (Die einzelnen Chords nach Flughafen)
*/

/*//////////////////////////////////////////////////////////
////////////////// Set up the Data /////////////////////////
//////////////////////////////////////////////////////////*/

//Array mit den Flughäfen, bei denen 2015 am meisten Flugzeuge gestartet sind --> Die Liste kommt von dem oben erwähnten Python-Skript
var NameProvider = ['ATL', 'ORD', 'DFW', 'DEN', 'LAX', 'SFO', 'PHX', 'IAH', 'LAS', 'MSP', 'MCO', 'SEA', 'DTW', 'BOS', 'EWR', 'CLT', 'LGA', 'SLC', 'JFK', 'BWI', 'MDW', 'DCA', 'FLL', 'SAN', 'MIA'];

/*Zweidimensionales Array mit den Werten für das Diagramm. Jedes Array in der ersten Dimension repräsentiert einen einzelnen Flughafen. Die Werte geben die Anzahl der Flüge zu den anderen Flughäfen in Prozent an. --> Die Listen kommen aus dem oben erwähnten Python-Skript
  Die Summe aller Werte ist dabei 100% oder 3334623 Flüge*/
var matrix = [
    [0.0, 0.1947146648961517, 0.21159813268246516, 0.14955213827770036, 0.1700042253652062, 0.09374373055064995, 0.10948763923238099, 0.11413584084317778, 0.12292244130745815, 0.1413353173657112, 0.24596483620487233, 0.08015898648812775, 0.14577360019408492, 0.14049564223601888, 0.15267093161655756, 0.18910683456570654, 0.2469244649245207, 0.07632047160953427, 0.05727783920401197, 0.17507226454084915, 0.13626727819006826, 0.19390497816394836, 0.22248392097097633, 0.061386249660006546, 0.15441025867092023],
    [0.1916558483522725, 0.0, 0.2302209275231413, 0.16832487510582156, 0.23813786446024032, 0.22125439667392685, 0.13251872850394184, 0.12553143188900215, 0.12799048048310108, 0.19075619642760216, 0.1324287633114748, 0.11791437892679323, 0.12898009760023846, 0.19666391073293743, 0.11617505187243056, 0.1425948300602497, 0.28713890595728514, 0.0779698334714299, 0.04729170284017114, 0.07401136500288039, 0.0, 0.17765126672490414, 0.07590063404468811, 0.08015898648812775, 0.12493166393922192],
    [0.2117180862724212, 0.2360086882385205, 0.0, 0.18166971198843168, 0.1989430289421023, 0.1365971505624474, 0.12427191919446366, 0.12013352034098007, 0.12862023683037033, 0.0771901351367156, 0.11473560879295801, 0.1063688458935238, 0.07940927655090245, 0.0920643802912653, 0.07500098212001777, 0.12127307944556251, 0.135577545047821, 0.0894254013122323, 0.01673352579886842, 0.053199417145506404, 0.0, 0.09527313882258955, 0.080848719630375, 0.09887174652127093, 0.11011739557965024],
    [0.15240103603915645, 0.16694540882132702, 0.18397881859508555, 0.0, 0.1705740049174974, 0.1608877525285467, 0.21624633429326193, 0.14538375102672776, 0.1879972638586131, 0.1650561397795193, 0.08699634111562236, 0.15411037469603012, 0.08042888206552885, 0.07218207275605068, 0.078239729048831, 0.057037932024099874, 0.09893172331624894, 0.1757020208881184, 0.024470532351033386, 0.05694796683163284, 0.08141849918266622, 0.03955469628800617, 0.036615833334083046, 0.11743456456696905, 0.040244429430253435],
    [0.17012417895516224, 0.24758420966927897, 0.19939285490443748, 0.17243328556181614, 0.0, 0.40355386500962775, 0.2198149535944543, 0.1272107821483868, 0.28770868550957635, 0.09269413663853455, 0.0724819567309408, 0.23187028938503693, 0.060066760170490036, 0.12163294021543065, 0.13848641960425512, 0.05874727068097353, 0.0, 0.1660757452941457, 0.3603105958304732, 0.03352702839271486, 0.055898372919517436, 0.0299883974890115, 0.052389730413303096, 0.13827650082183204, 0.09065492560928178],
    [0.09377371894813896, 0.22131437346890487, 0.1365971505624474, 0.15192122167933228, 0.4121605350889741, 0.0, 0.14562365820663986, 0.1027402497973534, 0.23975723792464695, 0.07344158545058917, 0.023900752798742167, 0.20787957139382773, 0.039224823915627045, 0.11716466898956794, 0.1506916973822828, 0.05451890663502291, 0.0, 0.09743230344179837, 0.25310207480725705, 0.008816588861769382, 0.023031089271560834, 0.019912295932703637, 0.03733555487381932, 0.20742974543149256, 0.030648142233769753],
    [0.10927772044995791, 0.1324287633114748, 0.12433189598944168, 0.21603641551083885, 0.22131437346890487, 0.14583357698906294, 0.0, 0.09815202498153465, 0.16490619779207424, 0.12169291701040867, 0.03850510237589077, 0.17303305351159637, 0.08147847597764425, 0.04291339680677546, 0.06315556511185823, 0.0842074201491443, 0.0, 0.1644863602272281, 0.06978300095692977, 0.04807140117488544, 0.06765382473520995, 0.029268675949275225, 0.020182191510104742, 0.1530907691814037, 0.01853282964820911],
    [0.11809430931172729, 0.12877017881781538, 0.11845417008159544, 0.1353376378679089, 0.13290857767129896, 0.10313009896471055, 0.09821200177651267, 0.0, 0.08303787264707285, 0.05014060060162723, 0.07826971744632003, 0.06645428883564948, 0.05751774638392406, 0.05023056579409427, 0.09647267472215, 0.10402975088938089, 0.07017285012428691, 0.06123630767256149, 0.0, 0.02977847870658842, 0.0, 0.061086365685116426, 0.05541855855969326, 0.060966412095160384, 0.08645654996082015],
    [0.12334227887230431, 0.12742070093080987, 0.12862023683037033, 0.18787731026865706, 0.29133728160574673, 0.2360086882385205, 0.16490619779207424, 0.08360765219936407, 0.0, 0.07626049481455625, 0.028249070434648835, 0.15078166257474984, 0.0878959930402927, 0.03079808422121481, 0.051819950861011876, 0.04660196969792387, 0.0, 0.11215660660890302, 0.11110701269678762, 0.0513701248986767, 0.08162841796508931, 0.009926159568862806, 0.03097801460614888, 0.12310237169239222, 0.041833814497171044],
    [0.14136530576320022, 0.18880695059081642, 0.07722012353420461, 0.16517609336947536, 0.09275411343351257, 0.07335162025812213, 0.1215129866254746, 0.052389730413303096, 0.07632047160953427, 0.0, 0.04762157521255026, 0.07644042519949032, 0.07931931135843542, 0.0544889182375339, 0.041024127764967735, 0.0638752866515945, 0.06435510101141868, 0.05547853535467128, 0.02459048594098943, 0.03115794499108295, 0.09077487919923781, 0.04963079784431403, 0.018322910865786027, 0.03211757371073132, 0.02537018427570373],
    [0.24596483620487233, 0.1327586356838539, 0.114705620395469, 0.08642656156333114, 0.07239199153847377, 0.02396072959372019, 0.0385950675683578, 0.07835968263878705, 0.028219082037159823, 0.047561598417572244, 0.0, 0.01319489489516506, 0.0789894389860563, 0.08540695604870475, 0.1436444239723651, 0.08867569137500701, 0.11743456456696905, 0.03715562448888525, 0.1603179729762555, 0.09356380016571589, 0.07725011193169362, 0.10043114319069951, 0.02003224952265968, 0.015144140731950808, 0.0909847979816609],
    [0.08012899809063873, 0.11845417008159544, 0.10630886909854577, 0.15291083879646963, 0.2328599065021743, 0.20527058081228372, 0.17297307671661835, 0.06609442806578135, 0.1502118830224586, 0.07638044840451229, 0.013164906497676048, 0.0, 0.05673804804920976, 0.044862642643561206, 0.0453724454008744, 0.025070300300813614, 0.0, 0.10384982050444683, 0.0628556811369681, 0.020871924652352006, 0.030678130631258765, 0.019702377150280555, 0.01001612476132984, 0.09563299959245768, 0.010316008736219956],
    [0.14565364660412886, 0.12817041086803516, 0.07934929975592443, 0.08078874283539698, 0.060066760170490036, 0.039254812313116054, 0.08141849918266622, 0.06027667895291312, 0.08795596983527074, 0.07931931135843542, 0.07901942738354531, 0.056798024844187785, 0.0, 0.10268027300237538, 0.06522476453860002, 0.0925441946510895, 0.13281861247883195, 0.04156391891976994, 0.009116472836659496, 0.07233201474349574, 0.08390753617425419, 0.05113021771876461, 0.07868955501116617, 0.02120179702473113, 0.03592610019183578],
    [0.14040567704355186, 0.19645399195051436, 0.09215434548373234, 0.07191217717864958, 0.12160295181794163, 0.11662487783476573, 0.042823431614308426, 0.0503205309865613, 0.0307680958237258, 0.05460887182748994, 0.0855269096386608, 0.04480266584858318, 0.10265028460488637, 0.0, 0.13383821799345832, 0.1076583469855513, 0.21279766858202562, 0.017303305351159638, 0.151261476934574, 0.13287858927380997, 0.041713860907214996, 0.2305208114980314, 0.06561461370595717, 0.028908815179407087, 0.06948311698203966],
    [0.15285086200149162, 0.11113700109427663, 0.07808978706138595, 0.07925933456345739, 0.13803659364191995, 0.15081165097223884, 0.06306559991939119, 0.10016124761329842, 0.05119019451374263, 0.03940475430056111, 0.1431646096125409, 0.04471270065611615, 0.065164787743622, 0.1332084616461891, 0.0, 0.12430190759195267, 0.0, 0.008756612066791358, 2.99883974890115e-05, 0.0075270877697418866, 0.054638860224978957, 0.045432422195852425, 0.10316008736219956, 0.029478594731698306, 0.08141849918266622],
    [0.18913682296319553, 0.13917615274650239, 0.12133305624054054, 0.057037932024099874, 0.05871728228348452, 0.054548895032511924, 0.08522702566377069, 0.10804819615290844, 0.04657198130043486, 0.06384529825410548, 0.08867569137500701, 0.025100288698302626, 0.09266414824104553, 0.1076583469855513, 0.12355219765472739, 0.0, 0.10825811493533152, 0.01853282964820911, 0.0771901351367156, 0.10130080671788085, 0.019072620803011316, 0.07365150423301224, 0.073021747885743, 0.021501680999621246, 0.0894553897097213],
    [0.2463546853722295, 0.28905816339658186, 0.135547556650332, 0.09851188575140278, 0.0, 0.0, 0.0, 0.06891333742974844, 0.0, 0.06429512421644065, 0.117344599374502, 0.0, 0.1327286472863649, 0.21291762217198165, 0.0, 0.10969755801480408, 0.0, 0.0, 0.0, 0.0, 0.06654425402811652, 0.1290400743952165, 0.159058460281717, 0.0, 0.18916681136068456],
    [0.07644042519949032, 0.07949924174336949, 0.0896653084921444, 0.18544825007204713, 0.1664056176665248, 0.0881059118227158, 0.16430642984229402, 0.059976794978023, 0.11188671103150191, 0.05559848894462732, 0.03715562448888525, 0.1037598553119798, 0.04162389571474796, 0.017333293748648646, 0.008756612066791358, 0.018502841250720096, 0.0, 0.0, 0.05514866298229215, 0.029748490309099408, 0.023300984848961936, 0.01892267881556626, 0.0, 0.06792372031261106, 0.004858120393219863],
    [0.057367804396479004, 0.047201737647704106, 0.01676351419635743, 0.024470532351033386, 0.3603405842279622, 0.25301210961479004, 0.06975301255944075, 0.0, 0.11104703590180959, 0.025280219083236695, 0.1604079381687225, 0.06279570434199008, 0.008486716489390254, 0.15114152334461797, 0.0, 0.07725011193169362, 0.0, 0.05514866298229215, 0.0, 0.00998613636384083, 0.0, 0.030048374283989526, 0.13311849645372206, 0.051280159706209666, 0.10777830057550733],
    [0.17504227614336013, 0.07395138820790237, 0.05316942874801739, 0.0570979088190779, 0.03343706320024782, 0.008756612066791358, 0.04807140117488544, 0.03013833947645656, 0.05146009009114374, 0.03115794499108295, 0.0933538813832928, 0.020841936254862994, 0.07251194512842982, 0.13230880972151873, 0.0073471573848078175, 0.10121084152541382, 0.0, 0.029748490309099408, 0.00998613636384083, 0.0, 0.05925707343828673, 0.0, 0.11911391482635368, 0.021321750614687177, 0.032927260442934626],
    [0.13593740581768915, 0.0, 0.0, 0.08156844117011128, 0.05571844253458337, 0.02297111247658281, 0.06774378992767698, 0.0, 0.0824081162998036, 0.08933543611976526, 0.07740005391913868, 0.030828072618703822, 0.08441733893156737, 0.04153393052228093, 0.054099069070176746, 0.019102609200500328, 0.06549466011600112, 0.02315104286151688, 0.0, 0.059287061835775735, 0.0, 0.0868164107306883, 0.03475655268976433, 0.03550626262698962, 0.0],
    [0.1937550361765033, 0.17759128992992612, 0.09530312722007855, 0.03961467308298419, 0.0299883974890115, 0.019912295932703637, 0.029268675949275225, 0.06114634248009445, 0.009866182773884784, 0.049600809446825024, 0.10046113158818853, 0.019702377150280555, 0.0513701248986767, 0.2304908231005424, 0.04546241059334143, 0.07503097051750678, 0.1290400743952165, 0.018892690418077247, 0.029868443899055457, 0.0, 0.08714628310306742, 0.0, 0.07401136500288039, 0.0, 0.08915550573483119],
    [0.22224401379106423, 0.07599059923715515, 0.08123856879773216, 0.03646589134663798, 0.05253967240074815, 0.03730556647633031, 0.020242168305082762, 0.055448546957182265, 0.03097801460614888, 0.01835289926327504, 0.020002261125170673, 0.01001612476132984, 0.07868955501116617, 0.06549466011600112, 0.10319007575968858, 0.073021747885743, 0.15914842547418404, 0.0, 0.13290857767129896, 0.11878404245397456, 0.034606610702319275, 0.07401136500288039, 0.0, 0.0, 0.0],
    [0.06132627286502852, 0.08036890527055082, 0.09893172331624894, 0.1256213970814692, 0.1385164080017441, 0.20817945536871785, 0.15363056033620592, 0.05101026412880856, 0.1228024877175021, 0.032027608518264285, 0.015144140731950808, 0.09572296478492472, 0.021261773819709156, 0.028908815179407087, 0.029478594731698306, 0.021471692602132234, 0.0, 0.06795370871010006, 0.05134013650118769, 0.021021866639797063, 0.03511641345963247, 0.0, 0.0, 0.0, 0.011665486623225474],
    [0.15444024706840923, 0.1246317799643318, 0.11011739557965024, 0.040454348212676516, 0.09068491400677078, 0.030648142233769753, 0.01856281804569812, 0.08648653835830918, 0.04186380289466005, 0.02534019587821472, 0.09095480958417189, 0.010316008736219956, 0.03595608858932479, 0.06954309377701767, 0.08138851078517721, 0.0894254013122323, 0.18946669533557467, 0.004858120393219863, 0.10783827737048536, 0.03289727204544562, 0.0, 0.0891854941323202, 0.0, 0.011665486623225474, 0.0]
];

//Array mit den Farben für die jeweiligen Flughäfen
var colors = ["#ff0000","#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf", "#00ffff", "#00bfff", "#0080ff", "#0040ff", "#0000ff", "#4000ff", "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040", "#ff0000"];

//Aus dem Array eine Colorscale machen
var fill = d3.scale.ordinal()
    .domain(d3.range(NameProvider.length))
    .range(colors);
	

/*//////////////////////////////////////////////////////////
/////////////// Initiate Chord Diagram /////////////////////
//////////////////////////////////////////////////////////*/

//Variablen des Diagramms festlegen
var margin = {top: 30, right: 25, bottom: 20, left: 25}, //Margin festlegen
    width = 1000 - margin.left - margin.right, //Breite festlegen -> Margin berücksichtigen
    height = 700 - margin.top - margin.bottom, //Hohe gestlegen -> Margin berücksichtigen
    innerRadius = Math.min(width, height) * .39, //Inneren Radius festlegen
    outerRadius = innerRadius * 1.04; //Äußeren Radius festlegen

//SVG initiieren
var svg = d3.select("#chart").append("svg:svg") //d3 SVG erstellen
    .attr("width", width + margin.left + margin.right) //Breite festlegen
    .attr("height", height + margin.top + margin.bottom) //Höhe festlegen
	.append("svg:g") //g appenden -> g ist das Diagramm
    .attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

//Chord-Diagramm erstellen
var chord = d3.layout.chord()
    .padding(.04) //Padding einfügen
    .sortSubgroups(d3.descending) //Chords von einem Airport absteigend sortieren
    .sortChords(d3.descending) //Wenn sich zwei Chords überschneiden wird wird der Größere über den Kleineren gelegt
	.matrix(matrix); //Daten dem Diagramm zuweisen
	

/*//////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
//////////////////////////////////////////////////////////*/

//Kreis auf SVG zeichnen
var arc = d3.svg.arc()
    .innerRadius(innerRadius) //Oben festgelegte Werte für inneren Radius zuweisen
    .outerRadius(outerRadius); //Oben festgelegte Werte für äußeren Radius zuweisen

//Variable für alle Chord-Gruppen zuweisen
var g = svg.selectAll("g.group")
	.data(chord.groups) //Daten aus den Chord-Diagramm Gruppen
	.enter().append("svg:g")
	.attr("class", function(d) {return "group " + NameProvider[d.index];});
	

g.append("svg:path")
	  .attr("class", "arc")
	  .style("stroke", function(d) { return fill(d.index); })
	  .style("fill", function(d) { return fill(d.index); })
	  .attr("d", arc)
	  .style("opacity", 0)
	  .transition().duration(1000)
	  .style("opacity", 0.4);


/*//////////////////////////////////////////////////////////
////////////////// Initiate Ticks //////////////////////////
//////////////////////////////////////////////////////////*/

//Prozentbeschriftung initiieren
var ticks = svg.selectAll("g.group").append("svg:g")
	.attr("class", function(d) {return "ticks " + NameProvider[d.index];}) //Function of Data um ticks zu erstellen
	.selectAll("g.ticks") //Alle Ticks auswählen
	.attr("class", "ticks") //Attribute setzen
    .data(groupTicks) //Daten zuweisen
	.enter().append("svg:g") //DOM Element hinzufügen
    .attr("transform", function(d) { //Transform Attribute berechnen
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" //Winkel berechnen
          + "translate(" + outerRadius+40 + ",0)";
    });

//Ticks zu Kreisen hinzufügen
ticks.append("svg:line") //SVG Element Linie
	.attr("x1", 1) //x1 Werte
	.attr("y1", 0) //y1 Werte
	.attr("x2", 5) //x2 Werte
	.attr("y2", 0) //y2 Werte
	.attr("class", "ticks") //Attribute durch die oben erstellte Variable hinzufügen
	.style("stroke", "#FFF"); //Style festlegen
	
//Text für die String-Manipulation festlegen
ticks.append("svg:text") //SVG Element Text
	.attr("x", 8) //x-Werte
	.attr("dy", ".35em") //dy-Werte
	.attr("class", "tickLabels")
	.attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; }) //Text an Kreis passend transformieren
	.style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; }) //Text-Anker passend festlegen
	.text(function(d) { return d.label; }) //Function of Data um label zurückzugeben
	.attr('opacity', 0); //Ticks zu Beginn unsichtbar


/*//////////////////////////////////////////////////////////
////////////////// Initiate Names //////////////////////////
//////////////////////////////////////////////////////////*/

//Beschriftung hinzufügen
g.append("svg:text") //SVG Element Text
  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; }) //Function of Data um Winkel zurückzugeben
  .attr("dy", ".35em") //dy- und em-Werte zuweisen (em wird beim Webdesign oft verwendet und bezieht sich auf den nächst höheren HTML-Container)
  .attr("class", "titles") //Attribute hinzugefügen
  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; }) //Text Anker über Function of Data hinzufügen
  .attr("transform", function(d) { //Transformation über Function of Data hinzufügen
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" //Berechnung über oben festgelegte und erstellte Werte
		+ "translate(" + (innerRadius + 55) + ")"
		+ (d.angle > Math.PI ? "rotate(180)" : "");
  })
  .attr('opacity', 0) //Beschriftung zu Beginn unsichtbar
  .text(function(d,i) { return NameProvider[i]; });  //Function of Data um NameProvider zurückzugeben


/*//////////////////////////////////////////////////////////
//////////////// Initiate inner chords /////////////////////
//////////////////////////////////////////////////////////*/

//Chorde initiieren
var chords = svg.selectAll("path.chord") //Alle Chords in dem SVG-Element
	.data(chord.chords) //Daten zuweisen
	.enter().append("svg:path") //SVG Pfad zuweisen
	.attr("class", "chord") //Attribute hinzufügen
	.style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); }) //Style anpassen
	.style("fill", function(d) { return fill(d.source.index); }) //Style anpassen
	.attr("d", d3.svg.chord().radius(innerRadius)) //Radien der Chorde festlegen
	.attr('opacity', 0); //Chorde zu Beginn unsichtbar


/*//////////////////////////////////////////////////////////	
///////////// Initiate Progress Bar ////////////////////////
//////////////////////////////////////////////////////////*/

//Variablen für Ladebalken
var progressColor = ["#D1D1D1","#949494"], //Farben in Array festlegen
	progressClass = ["prgsBehind","prgsFront"], //Klassen in Array festlegen
	prgsWidth = 0.4*650, //Breite des Ladebalkens festlegen
	prgsHeight = 3; //Höhe des Ladebalkens festlegen

//Eigenes SVG-Element für Ladebalken erstellen
var progressBar = d3.select("#progress").append("svg") //Neues d3 SVG Element
	.attr("width", prgsWidth) //Breite zuweisen
	.attr("height", 3*prgsHeight); //Höhe zuweisen

//Ladebalken mit 0 Fortschritt erstellen
progressBar.selectAll("rect")
	.data([prgsWidth, 0]) //Fortschritt 0
	.enter()
	.append("rect")
	.attr("class", function(d,i) {return progressClass[i];}) //Function of Data mit Rückgabe der Fortschritts-Klasse
	.attr("x", 0) //x-Werte
	.attr("y", 0) //y-Werte
	.attr("width", function (d) {return d;}) //Function of Data mit Rückgabe von data
	.attr("height", prgsHeight) //Höhe zweisen
	.attr("fill", function(d,i) {return progressColor[i];}); //Function of Data mit der Rückgabe der Füllfarbe


/*//////////////////////////////////////////////////////////	
/////////// Initiate the Center Texts //////////////////////
//////////////////////////////////////////////////////////*/

//Wrapper für Texte in der Mitte des Kreises
var textCenter = svg.append("g") //Neues SVG-Element
					.attr("class", "explanationWrapper"); //Klasse zuweisen

//Initialer Text, der oben in der Mitte steht
var middleTextTop = textCenter.append("text") //Element erstellen
	.attr("class", "explanation") //Klassenattribut zweisen
	.attr("text-anchor", "middle") //Textanker festlegen
	.attr("x", 0 + "px") //x-Werte festlegen
	.attr("y", -24*10/2 + "px") //y-Werte festlegen
	.attr("dy", "1em") //dy- und em-Werte festlegen
	.attr("opacity", 1) //Sichtbar
	.text("Top 25 Aiports und ihre Zielflughäfen") //Text
	.call(wrap, 350); //Wrapper

//Initialer Text, der unten in der Mitte steht
var middleTextBottom = textCenter.append("text") //Element erstellen
	.attr("class", "explanation") //Klassenattribut zuweisen
	.attr("text-anchor", "middle") //Textanker festlegen
	.attr("x", 0 + "px") //x-Werte
	.attr("y", 24*3/2 + "px") //y-Werte
	.attr("dy", "1em") //dy- und em-Werte
	.attr('opacity', 1) //Sichtbar
	.text("2015 wurde von dem U.S. Department of Transportation's ein Dataset mit über 5 Mio. Flügen veröffentlicht.") //Text
	.call(wrap, 350); //Wrapper


/*//////////////////////////////////////////////////////////
//////////////// Storyboarding Steps ///////////////////////
//////////////////////////////////////////////////////////*/

//Counter für die einzelnen Schritte der Userstory
var counter = 1, //Initial bei 1
	buttonTexts = ["Ok","Weiter","Weiter","Okay","Okay","Okay","Okay","Weiter","Okay","Weiter","Fertig"], //Array mit Beschriftungen für den Button
	opacityValueBase = 0.8, //Sichtbarkeiten
	opacityValue = 0.4;


//Reset-Button
d3.select("#reset") //Selection über Element ID
	.on("click", function(e) {location.reload();}); //OnClick verhalten: reload

//Skip Intro Button
d3.select("#skip") //Selection über Element ID
	.on("click", finalChord); //OnClick finales Diagramm laden
	
//Reihenfolge bei Klicken auf Button
d3.select("#clicker") //Selection über Element ID
	.on("click", function(e){ //Aufruf Funktion bei OnClick
	
		if(counter == 1) Draw1();
		else if(counter == 2) Draw2();
		else if(counter == 3) Draw3();
		else if(counter == 4) Draw4();
		else if(counter == 5) Draw5();
		else if(counter == 6) Draw6();
		else if(counter == 7) Draw7();
        else if(counter == 8) Draw8();
		else if(counter == 9) Draw9();
		else if(counter == 10) Draw10();
		else if(counter == 11) Draw11();
		else if(counter == 12) finalChord();
		
		counter = counter + 1; //Counter erhöhen
	});


/*//////////////////////////////////////////////////////////	
//Introduction
///////////////////////////////////////////////////////////*/

//Funktion für den ersten Schritt der User Story
function Draw1(){

	//Button deaktivieren
	stopClicker();
		
	//Ladebalken starten
	runProgressBar(time=700*11);
	
    //Oberen Text ändern -> genaue Erklärung der Funktion bei Definition der Funktion
	changeTopText(newText = "Das Dataset umfasst über 5 Mio. Inlandsflüge in den USA. " + 
							"In der folgenden Grafik sind die Top 25 Flughäfen und ihre Verbindungen dargestellt.",
	loc = 6/2, delayDisappear = 0, delayAppear = 1);

    //Oberen Text ändern
	changeTopText(newText = "In den nächsten Schritten werden die einzelnen Flughäfen und ihre Verbindungen erläutert. ",
	loc = 8/2, delayDisappear = 9, delayAppear = 10, finalText = true);
	
    //Unteren Text ändern
	changeBottomText(newText = "Dafür wurden insgesamt 3.334.623 Flüge ausgewertet.",
	loc = 1/2, delayDisappear = 0, delayAppear = 10);
	
	//Bögen entfernen
	d3.selectAll(".arc") //Bögen auswählen
		.transition().delay(9*700).duration(2100) //Übergang
		.style("opacity", 0) //Nicht Sichtbar
		.each("end", function() {d3.selectAll(".arc").remove();}); //Jeden Bogen entfernen
		
};


/*//////////////////////////////////////////////////////////	
//Show First Arc
//////////////////////////////////////////////////////////*/

//Funktion für den zweiten Schritt der User Story
function Draw2(){ 

	//Button deaktivieren
	stopClicker();
	
	//Ladebalken starten
	runProgressBar(time=700*2);
				
	//Alle Bögen erstellen, aber nur den ersten Zeigen
	g.append("svg:path") //An SVG appenden
	  .style("stroke", function(d) { return fill(d.index); }) //Funktion of Data mit Rückgabe stroke
	  .style("fill", function(d) { return fill(d.index); }) //Funktion of Data mit Rückgabe fill
	  .transition().duration(700) //Übergangszeit
	  .attr("d", arc) //Attribut d arc zuweisen
	  .attrTween("d", function(d) { //Function of Data um nur ersten Bogen sichtbar zu machen
		if(d.index == 0) { //Auswahl Bogen über Index
		   var i = d3.interpolate(d.startAngle, d.endAngle); //Start- und Endwinkel
		   return function(t) { //Function of Data mit Rückgabe Endwinkel
			   d.endAngle = i(t); //Endwinkel
			 return arc(d); //Return
		   }
		}
	  });
	  
	//Ticks für ersten Bogen anzeigen
	d3.selectAll("g.group").selectAll("line") //Ticks auswählen
		.transition().delay(700).duration(1000) //Übergangszeit
		.style("stroke", function(d, i, j) {return j ? 0 : "#000"; }); //Function of Data für stroke

	//Beschriftung der Ticks für ersten Bogen anzeigen
	d3.selectAll("g.group").selectAll(".tickLabels") //Label auswählen
		.transition().delay(700).duration(2000) //Übergangszeit
		.attr("opacity", function(d, i, j) {return j ? 0 : 1; }); //Function of Data mit Rückgabe der Sichtbarkeit

	//Titel für ersten Bogen anzeigen
	d3.selectAll(".titles") //Titel auswählen
	  .transition().duration(2000) //Übergangszeit
	  .attr("opacity", function(d, i) {return d.index ? 0 : 1; }); //Function of Data mit Rückgabe der Sichtbarkeit
	  
	//Oberen Text ändern
	changeTopText(newText = "Der Flughafen, von dem 2015 am meisten Flüge gestartet sind, ist der Hartsfield-Jackson Atlanta International Airport (ATL).",
	loc = 1/2, delayDisappear = 0, delayAppear = 1, finalText = true);
	
    //Unteren Text "löschen" :)
	changeBottomText(newText = "",
	loc = 0/2, delayDisappear = 0, delayAppear = 1)	;
	
};


/*///////////////////////////////////////////////////////////  
//Draw The Other Arcs As Well
//////////////////////////////////////////////////////////*/

//Funktion für den dritten Schritt der User Story
function Draw3(){

	//Button deaktivieren
	stopClicker();

    //Array mit Zeiten für das Amzeigen/Entfernen einzelner Objekte
	var arcDelay = [0,1,2,12,13,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,30];

	//Ladebalken starten
	runProgressBar(time=700*(arcDelay[(arcDelay.length-1)]+1));	
		
   //Alle anderen Bögen anzeigen
   svg.selectAll("g.group").select("path")
	.transition().delay(function(d, i) { return 700*arcDelay[i];}).duration(1000) //Function of Data mit Rückgabe der Übergangszeit
	.attrTween("d", function(d) { //Funktion of data um alle anderen Bögen anzuzeigen
		if(d.index != 0) { //Auswahl bei Index
		   var i = d3.interpolate(d.startAngle, d.endAngle); //Start- und Endwinkel
		   return function(t) { //Funktion of Data für Endwinkel
			   d.endAngle = i(t); //Endwinkel
			 return arc(d);
		   }
		}
    });
 
  //Alle Ticks anzeigen
  svg.selectAll("g.group") //Alle Elemente auswählen
	.transition().delay(function(d,i) { return 700*arcDelay[i]; }).duration(700) //Übergangsdauer
	.selectAll("g").selectAll("line").style("stroke", "#000"); //Werte für alle Ticks festlegen

  //Alle Beschriftungen der Ticks anzeigen
  svg.selectAll("g.group") //Alle Elemente auswählen
	.transition().delay(function(d,i) { return 700*arcDelay[i]; }).duration(700) //Übergangsdauer
	.selectAll("g").selectAll("text").style("opacity", 1); //Werte für Beschriftungen festlegen

  //Alle Titel anzeigen	
  svg.selectAll("g.group") //Alle Elemente auswählen
	.transition().delay(function(d,i) { return 700*arcDelay[i]; }).duration(700) //Übergangsdauer
	.selectAll("text").style("opacity", 1); //Werte für Titel festlegen

	//Oberen Text ändern
	changeTopText(newText = "An zweiter Stelle kommt der Chicago O’Hare International Airport,",
		loc = 6/2, delayDisappear = 0, delayAppear = arcDelay[2]);
	//Oberen Text ändern
	changeTopText(newText = "An 4. Stelle ist der Denver Airport, ",
		loc = 5/2, delayDisappear = arcDelay[3], delayAppear = arcDelay[4]);		
	//Oberen Text ändern
	changeTopText(newText = "Zusammen ergeben alle Flughäfen 100%",
		loc = 6/2, delayDisappear = (arcDelay[4]+8), delayAppear = (arcDelay[5]));		
	//Oberen Text ändern
	changeTopText(newText = "Der Kreis zeigt nun die 25 Flughäfen, von denen 2015 am meisten Flüge gestartet sind.",
		loc = 6/2, delayDisappear = (arcDelay[5]+5), delayAppear = (arcDelay[25]), finalText = true);					
	
	//Unteren Text ändern
	changeBottomText(newText = "gefolgt von dem Dallas/Fort Worth International Airport.",
		loc = 1/2, delayDisappear = 0, delayAppear = arcDelay[2]);
	//Unteren Text ändern
	changeBottomText(newText = "auf Platz 5 der Los Angeles International Airport.",
		loc = -1/2, delayDisappear = arcDelay[3], delayAppear = arcDelay[4]);	
	//Unteren Text ändern
	changeBottomText(newText = "Alle Flüge zu anderen Flughäfen wurden hier nicht weiter verwendet!",
		loc = -1/2, delayDisappear = (arcDelay[4]+8), delayAppear = (arcDelay[5]));	
	//Unteren Text ändern
	changeBottomText(newText = "Jetzt werden wir uns anschauen, wie die Verteilung der einzelnen Flüge auf die Zeilflughäfen ist.",
		loc = 1/2, delayDisappear = (arcDelay[5]+5), delayAppear = (arcDelay[25]));	

};


/*///////////////////////////////////////////////////////////
//Show The Example Chord Between LAX And JFK
//////////////////////////////////////////////////////////*/

//Funktion für vierten Schritt der User Story
function Draw4(){

	//Button deaktivieren
	stopClicker();

	//Ladebalken starten
	runProgressBar(time=700*2);	
	
	//Oberen Text ändern
	changeTopText(newText = "Dafür betrachten wir beispielhaft die Flüge zwischen Los Angeles und New York an.",
		loc = 5, delayDisappear = 0, delayAppear = 1, finalText = true);
		
	//Unteren Text "löschen"
	changeBottomText(newText = "",
		loc = 0, delayDisappear = 0, delayAppear = 1);	
	
    //Alle Bögen außer LAX und JFK unsichtbar machen
    svg.selectAll("g.group").select("path") //Alle Elemente auswählen
		.transition().duration(1000) //Übergangsdauer
		.style("opacity", function(d) { //Sichtbarkeit über Function of Data
			if(d.index != 4 && d.index != 18) {return opacityValue;} //Nur Index 4 und 18 sichtbar
		});		
	
	//Andere Bögen transparent machen
	d3.selectAll("g.group").selectAll("line") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.style("stroke",function(d,i,j) {if (j == 18 || j == 4) {return "#000";} else {return "#DBDBDB";}}); //Alle Bögen bis auf Index 4 und 18
    
	//Beschriftung der Ticks transparent machen
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.selectAll(".tickLabels").style("opacity",function(d,i,j) {if (j == 18 || j == 4) {return 1;} else {return opacityValue;}}); //Alle Beschriftungen bis aud Index 4 und 18
    
	//Titel der Bögen transparent machen	
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.selectAll(".titles").style("opacity", function(d) { if(d.index == 4 || d.index == 18) {return 1;} else {return opacityValue;}}); //Alle Titel bis auf Index 4 und 18

	//Nur den Chord zwischen LAX und JFK zeigen
	chords.transition().duration(2000) //Übergangsdauer
		.attr("opacity", function(d, i) { //Function of Data für Chord und Transparenz
			if(d.source.index == 18 && d.target.index == 4) //Wenn Quelle Index 4 und Ziel Index 18
				{return opacityValueBase;} //Sichtbar
			else {return 0;} //Sonst unsichtbar
		});
	
};


/*//////////////////////////////////////////////////////////////////////////
//Explanation Of Chords #1
//////////////////////////////////////////////////////////////////////////*/

//Funktion für fünften Schritt der User Story
function Draw5(){

	//Button deaktivieren
	stopClicker();

	//Ladebalken starten
	runProgressBar(time=700*2);	
	
	//Oberen Text ändern
	changeTopText(newText = "Auf der rechten Seite berührt der Cord den LAX Airport mit 0,36% und ist auf der linken Seite mit dem JFK Airport verbunden.",
		loc = -1, delayDisappear = 0, delayAppear = 1, finalText = true);
	
    //LAX und JFK Bögen an Rest anpassen
    svg.selectAll("g.group").select("path") //Alle Elemente auswählen
		.transition().duration(1000) //Übergangsdauer
		.style("opacity", opacityValue); //Transparenz festlegen

	//Nur den JFK-Teil bei LAX als Bogen
	var arcJFK = d3.svg.arc() //Neuer Bogen
				.innerRadius(innerRadius) //Innerer Radius
				.outerRadius(outerRadius) //Äußerer Radius
				.startAngle(1.442) //Startwinkel
				.endAngle(1.485); //Endwinkel
	
    //Nur den JFK-Teil bei LAX zeigen            
	svg.append("path") //Zu SVG hinzufügen
		.attr("class","JFKtoLAXArc") //Klassen-Attribut
		.attr("d", arcJFK) //Arc hinzufügen
		.attr("fill", colors[5]) //Füllfarbe
		.style('stroke', colors[5]); //Randfarbe
		
	repeat(); //Repeat Funktion (siehe unten)
	
	//Funktion, um den Bogen in zwei Farben "Blinken" zu lassen
	function repeat() {
		d3.selectAll(".JFKtoLAXArc") //Elemente der Klasse auswählen
			.transition().duration(700) //Übergangsdauer
			.attr("fill", "#9FA6D0") //Erste Füllfarbe
			.style('stroke', "#9FA6D0") //Erste Randfarbe
			.transition().duration(700) //Übergangsdauer
			.attr("fill", colors[5]) //Zweite Füllfarbe
			.style('stroke', colors[5]) //Zweite Randfarbe
			.each("end", repeat)
			;
	};
	
};


/*//////////////////////////////////////////////////////////////////////////
//Explanation Of Chords #2
//////////////////////////////////////////////////////////////////////////*/

//Funktion für sechsten Schritt der User Story
function Draw6(){

	//Button deaktivieren
	stopClicker();

	//Ladebalken starten
	runProgressBar(time=700*2);	
	
	//Oberen Text ändern
	changeTopText(newText = "Diese 0,36% entsprechen den Flügen, die von diesem Airport nach New York geflogen sind.",
		loc = -1, delayDisappear = 0, delayAppear = 1, finalText = true);

	//Nur den LAX-Teil bei JFK als Bogen
	var arcLAX = d3.svg.arc() //Neuer Bogen
				.innerRadius(innerRadius) //Innerer Radius
				.outerRadius(outerRadius) //Äußerer Radius
				.startAngle(4.96) //Startwinkel
				.endAngle(5.00); //Endwinkel

    //Nur den LAX-Teil bei JFK zeigen
	svg.append("path") //Zu SVG hinzufügen
		.attr("class","LAXtoJFKArc") //Klassen-Attribut
		.attr("d", arcLAX) //Arc hinzufügen
		.attr("opacity", 0) //Unsichtbar
		.attr("fill", colors[4]) //Füllfarbe
		.transition().duration(700) //Animationsdauer
		.attr("opacity", 1) //Sichtbar
		.attr("stroke", colors[4]); //Randfarbe
		
};


/*//////////////////////////////////////////////////////////////////////////
//Explanation Of Chords #2
//////////////////////////////////////////////////////////////////////////*/

//Funktion siebter Schritt der User Story
function Draw7(){

	//Button deaktivieren
	stopClicker();

	//Ladebalken starten
	runProgressBar(time=700*11);	
	
	//Oberen Text ändern
	changeTopText(newText = "Auf der JFK-Seite belegt der Chord ebenfalls 0,36%.",
		loc = -1, delayDisappear = 0, delayAppear = 1);
    
    //Oberen Text ändern
	changeTopText(newText = "Diese 0,36% entsprechen Flüge, die von diesem Airport nach Los Angeles geflogen sind.",
		loc = -1, delayDisappear = 9, delayAppear = 10, finalText = true);
		
	//Farbwechsel auf der LAX-Seite stoppen
	d3.selectAll(".JFKtoLAXArc") //Klasse auswählen
		.transition().duration(700) //Übergangsdauer
		.attr("fill", colors[5]) //Füllfarbe
		.style("stroke", colors[5]); //Randfarbe

	//Repeat Funktion für "blinken"	
	repeat();
	function repeat() {
		d3.selectAll(".LAXtoJFKArc") //Klasse auswählen
			.transition().duration(700) //Übergangsdauer
			.attr("fill", "#99D2E9") //Erste Füllfarbe
			.style('stroke', "#99D2E9") //Erst Randfarbe
			.transition().duration(700) //Übergangsdauer
			.attr("fill", colors[4]) //Zweite Füllfarbe
			.style("stroke", colors[4]) //Zweite Randfarbe
			.each("end", repeat)
			;
	};
				
};


/*//////////////////////////////////////////////////////////////////////////
//Explanation Of Chords #3
//////////////////////////////////////////////////////////////////////////*/

//Funktion für achten Schritt der User Story
function Draw8(){

	//Button deaktivieren
	stopClicker();

	//Ladebalken starten
	runProgressBar(time=700*11);	
	
	//Oberen Text ändern
	changeTopText(newText = "Wertet man die Daten genau aus sieht man, dass marginal mehr Flügen von New York nach LA geflogen sind als umgekehrt.",
		loc = -1, delayDisappear = 0, delayAppear = 1);

    //Oberen Text ändern
	changeTopText(newText = "Daher entspricht die Farbe des Chords der des JFK-Airports.",
		loc = -1, delayDisappear = 9, delayAppear = 10, finalText = true);
		
	//"Blinken" bei JFK stoppen
	d3.selectAll(".LAXtoJFKArc") //Klasse auswählen
		.transition().duration(700) //Übergangsdauer
		.attr("fill", colors[4]) //Füllfarbe
		.style("stroke", colors[4]); //Randfarbe
				
};


/*//////////////////////////////////////////////////////////
//Show All Chords That Are Connected To Atlanta
//////////////////////////////////////////////////////////*/

//Funktion für neunten Schritt der User Story
function Draw9(){

	//Button deaktivieren
	stopClicker();

	//Ladebalken starten
	runProgressBar(time=700*2);

    //Spezielle Balken für JFK und LAX entfernen
	d3.selectAll(".LAXtoJFKArc") //Klasse auswählen
        .transition().duration(2000) //Übergangsdauer
        .attr("opacity", 0) //Unsichtbar
        .each("end", function() {d3.selectAll(".LAXtoJFKArc").remove();}); //Bogen löschen

    d3.selectAll(".JFKtoLAXArc") //Klasse auswählen
        .transition().duration(2000) //Übergangsdauer
        .attr("opacity", 0) //Unsichrbar
        .each("end", function() {d3.selectAll(".JFKtoLAXArc").remove();}); //Bogen löschen
	
    //Oberen Text ändern
	changeTopText(newText = "Hier sind alle Flüge dargestellt, die von Atlanta gestartet sind.",
		loc = -3/2, delayDisappear = 0, delayAppear = 1, finalText = true, xloc=0, w=200);
		
	/*Remove the Nokia arc
	d3.selectAll(".NokiaLoyalArc")
		.transition().duration(1000)
		.attr("opacity", 0)
		.each("end", function() {d3.selectAll(".NokiaLoyalArc").remove();});
	*/

	//Nur Chords von ATL anzeigen
	chords.transition().duration(2000) //Übergangsdauer
    .attr("opacity", function(d, i) { //Function of Date
		if(d.source.index == 0 || d.target.index == 0) {return opacityValueBase;} //Wenn Herkunft oder Ziel Index 0 anzeigen
		else {return 0;} //Sonst unsichtbar
	});

	//Nur Bogen von Atlanta hervorheben
	svg.selectAll("g.group").select("path") //Alle Elemente auswählen
		.transition().duration(2000) //Übergangsdauer
		.style("opacity", function(d) { //Function of Data
			if(d.index != 0) {return opacityValue;} //Wenn Index 0 dann anzeigen
		});	
		
	//Ticks bis auf ATL transparent machen
	d3.selectAll("g.group").selectAll("line") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.style("stroke",function(d,i,j) {if (j == 0) {return "#000";} else {return "#DBDBDB";}}); //Function of Data für Stroke Style über Index
    
	//Beschriftungen bis auf ATL transparent machen
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.selectAll(".tickLabels").style("opacity",function(d,i,j) {if (j == 0) {return 1;} else {return opacityValue;}}); //Function of Data für Transparenz über Index
    
	//Titel bis auf ATL transparent machen	
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.selectAll(".titles").style("opacity", function(d) { if(d.index == 0) {return 1;} else {return opacityValue;}}); //Function of Data für Transparenz über Index

};


/*//////////////////////////////////////////////////////////
//Explanation of Atlanta Example
//////////////////////////////////////////////////////////*/

//Funktion für zehnten Schritt der User Story
function Draw10(){

	//Button deaktivieren
	stopClicker();

	//Ladebalken starten
	runProgressBar(time=700*11);	

    //Oberen Text ändern
	changeTopText(newText = "Von diesem Airport werden alle anderen Flughäfen angeflogen.",
		loc = -3/2, delayDisappear = 0, delayAppear = 1, finalText = false, xloc=0, w=210);
    
    //Oberen Text ändern
	changeTopText(newText = "Obwohl hier am meisten Flüge starten, dominiert dieser Flughafen nicht alle Zielflughäfen.",
		loc = -3/2, delayDisappear = 9, delayAppear = 10, finalText = true, xloc=0, w=210);

};

/*//////////////////////////////////////////////////////////
//Information Before Full Diagram
//////////////////////////////////////////////////////////*/

//Funktion für elfte Schritt der User Story
function Draw11(){

	//Button deaktivieren
	stopClicker();

    //Alle Chords transparent machen
	chords.transition().duration(1000) //Übergangsdauer
    .style("opacity", 0.1); //Transpatenz

    //Alle Bögen sichtbar machen
	svg.selectAll("g.group").select("path") //Alle Elemente auswählen
    .transition().duration(2000) //Übergangsdauer
    .style("opacity", function(d) { //Function of Data
        if(d.index == 0 && d.index != 0) {return opacityValue;} //Transparenz über Index
    });

    //Oberen Text ändern
	changeTopText(newText = "Im nächsten Schritt wird das gesamte Diagramm mit allen Chords angezeigt.",
		loc = 8/2, delayDisappear = 0, delayAppear = 1, finalText = true);
	
    //Oberen Text ändern
	changeBottomText(newText = "Du kannst mit deinem Cursor über die Airports hovern, um diese zu hervorzuheben. Viel Spaß!",
		loc = 3/2, delayDisappear = 0, delayAppear = 1);		
	
	//Ticks transparent machen
	d3.selectAll("g.group").selectAll("line") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.style("stroke","#DBDBDB"); //Stroke anpassen
    
	//Beschriftung transparent machen
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.selectAll(".tickLabels").style("opacity",0.4); //Transparenz anpassen
    
	//Titel transparenz machen
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(700) //Übergangsdauer
		.selectAll(".titles").style("opacity",0.4);	//Transparenz anpassen
		
};

/*///////////////////////////////////////////////////////////
//Draw The Original Chord Diagram
///////////////////////////////////////////////////////////*/

//Funktion für das vollständige Chord Diagramm
function finalChord() {
	
	//Elemente unsichtbar machen
	d3.select("#clicker") //Auswahl durch Klasse
		.style("visibility", "hidden"); //Button unsichtbar
	d3.select("#skip") //Auswhal durch Klasse
		.style("visibility", "hidden"); //Überspringen-Button unsichtbar
	d3.select("#progress") //Auswahl durch Klasse
		.style("visibility", "hidden"); //Ladebalken unsichtbar
	
	//Oberes Text-Element "löschen"
	changeTopText(newText = "", loc = 0, delayDisappear = 0, delayAppear = 1);

    //Unteres Text-Element "löschen"
	changeBottomText(newText = "", loc = 0, delayDisappear = 0, delayAppear = 1);			

	//Bögen anzeigen oder erstellen, je nach Stand in der User Story
	if (counter <= 4 ) { //Wenn Bögen schon erstellt
		g.append("svg:path") //SVG Element erstellen
		  .style("stroke", function(d) { return fill(d.index); }) //Function of Data für Randfarbe
		  .style("fill", function(d) { return fill(d.index); }) //Function of Data für Füllfarbe
		  .attr("d", arc) //Bögen hinzufügen
		  .style("opacity", 0) //Unsichtbar
		  .transition().duration(1000) //Übergangsdauer
		  .style("opacity", 1); //Alle Bögen sichtbar
		  
	} else { //Wenn Bögen noch nicht erstellt
		svg.selectAll("g.group").select("path") //Alle Elemente auswählen
			.transition().duration(1000) //Übergangsdauer
			.style("opacity", 1); //Alle Bögen sichtbar
	};
	
	//OnHover Event
	d3.selectAll(".group") //Alle Elemente auswählen
		.on("mouseover", fade(.02)) //Wenn Hover hohe transparenz
		.on("mouseout", fade(.80)); //Wenn kein Hover niedrige Transparenz
		
	//Alle Chords anzeigen
	chords.transition().duration(1000) //Übergangsdauer
		.style("opacity", opacityValueBase); //Alle Chords anzeigen

	//Alle Tics anzeigen
	d3.selectAll("g.group").selectAll("line") //Alle Elemente auswählen
		.transition().duration(100) //Übergangsdauer
		.style("stroke","#000"); //Stroke sichtbar
    
	//Alle Beschriftungen sichtbar
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(100) //Übergangsdauer
		.selectAll(".tickLabels").style("opacity",1); //Alle Beschriftungen sichtbar
    
	//Alle Titel sichtbar
	svg.selectAll("g.group") //Alle Elemente auswählen
		.transition().duration(100) //Übergangsdauer
		.selectAll(".titles").style("opacity",1); //Alle Titel sichtbar		

};


/*//////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
//////////////////////////////////////////////////////////*/

//Gibt einen Eventhandler zurück für die Transparenz
function fade(opacity) { //Funktion fase
  return function(d, i) { //Function of Data
    svg.selectAll("path.chord") //Alle Chords auswählen
        .filter(function(d) { return d.source.index != i && d.target.index != i; }) //Function of Data für Filter nach Index
		.transition()
        .style("stroke-opacity", opacity) //Transparenz für Rahmen
        .style("fill-opacity", opacity); //Transparenz für Fläche
  };
};

//Gibt ein Array für eine Gruppe mit den Ticks, Winkeln und Beschriftungen zurück
function groupTicks(d) { //Funktion groupTicks
  var k = (d.endAngle - d.startAngle) / d.value; //Berechnet Winkel für Tick
  return d3.range(0, d.value, 1).map(function(v, i) { //Function of Data für Array
    return {
      angle: v * k + d.startAngle, //Winkel
      label: i % 1 ? null : v + "%" //Beschriftungen
    };
  });
};


//Ruft eine Funktion nur auf, wenn Übergänge beendet
function endall(transition, callback) { //Funktion endall
    var n = 0; //Zählvariable
    transition //Für transition
        .each(function() { ++n; }) //Für jede Funktion n erhöhen
        .each("end", function() { if (!--n) callback.apply(this, arguments); }); //Warten bis Übergänge beendet
};

//Wrapt SVG Text
function wrap(text, width) { //Funktion wrap
    var text = d3.select(this)[0][0], //Text auswählen
        words = text.text().split(/\s+/).reverse(), //Parsen
        word, //Variale
        line = [], //Leeres Array für Zeilen
        lineNumber = 0, //Variable für Zeilennummer
        lineHeight = 1.4, //Variable für Zeilenhöhe
        y = text.attr("y"), //y-Wert zuweisen
		x = text.attr("x"), //x-Wert zuweisen
        dy = parseFloat(text.attr("dy")), //text parsen
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em"); //Variable aus geparsten Text
		
    while (word = words.pop()) { //Solange es neue Wörter gibt
      line.push(word); //Einzelne Wörter pushen
      tspan.text(line.join(" ")); //Wörter zusammenfügen
      if (tspan.node().getComputedTextLength() > width) { //Wenn Zeile länger als Breite
        line.pop(); //Linie popen
        tspan.text(line.join(" ")); //Text zusammenfügen
        line = [word]; //line zuweisen
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word); //Variable aus geparsten Text
      };
    };  
};

//Änderung des oberen mittleren Texts
function changeTopText (newText, loc, delayDisappear, delayAppear, finalText, xloc, w) { //Funktion changeTopText

	//Wenn finalText nicht angegeben ist, ist default falsch
	if(typeof(finalText)==='undefined') finalText = false;
	//Wenn xloc nicht gegeben ist, ist die default xlocation 0
	if(typeof(xloc)==='undefined') xloc = 0;
    //Wenn w nicht gegeben ist, ist die default Breite 350px
	if(typeof(w)==='undefined') w = 350;
	
	middleTextTop	
		//Bisherigen Text unsichtbar machen
		.transition().delay(700 * delayDisappear).duration(700) //Übergangsdauer
		.attr('opacity', 0)	//Transparent
		//Neuen Text sichtbar machen
		.call(endall,  function() { //Function of Data
			middleTextTop.text(newText) //Neuen Text zuweisen
			.attr("y", -24*loc + "px") //y-Wert festlegen
			.attr("x", xloc + "px") //x-Wert festlegen
			.call(wrap, w);	//Text wrappen
		})
		.transition().delay(700 * delayAppear).duration(700) //Übergangsdauer
		.attr('opacity', 1) //Sichtbar
		.call(endall,  function() { //Warten bis alle anderen Übergänge beendet
			if (finalText == true) { //Wenn Text final
				d3.select("#clicker") //Klasse von Button auswählen
					.text(buttonTexts[counter-2]) //Text ändern
					.style("pointer-events", "auto") //Button aktivieren
					.transition().duration(400) //Übergangsdauer
					.style("border-color", "#363636") //Farbe auf "aktiv" ändern
					.style("color", "#363636"); //Farbe auf "aktiv" ändern
				};
		});
};

//Änderung des unteren mittleren Texts
function changeBottomText (newText, loc, delayDisappear, delayAppear) { //Funktion changeBottomText
	middleTextBottom
		//Bisherigen Text unsichtbar machen
		.transition().delay(700 * delayDisappear).duration(700) //Übergangsdauer
		.attr('opacity', 0) //Transparent
		//Neuen Text sichtbar machen
		.call(endall,  function() { //Function of Data
			middleTextBottom.text(newText) //Neuen Text zuweisen
			.attr("y", 24*loc + "px") //y-Wert festlegen
			.call(wrap, 350); //Text wrappen
		})
		.transition().delay(700 * delayAppear).duration(700) //Übergangsdauer
		.attr('opacity', 1); //Sichtbar
;}

//Button deaktivieren
function stopClicker() { //Funktion stopClicker
	d3.select("#clicker") //Klasse auswählen
		.style("pointer-events", "none") //Click Events deaktivieren
		.transition().duration(400) //Übergangsdauer
		.style("border-color", "#D3D3D3") //Farbe auf "inaktiv" setzen
		.style("color", "#D3D3D3"); //Farbe auf "inaktiv" setzen
};

//Ladebalken während den Animationen verändern
function runProgressBar(time) {	//Funktion runProgressBar
	
	//Fortschritt-Divs unsichtbar machen
	d3.selectAll("#progress") //Klasse auswählen
		.style("visibility", "visible"); //Unsichtbar
	
	//Div mit Fortschrittslinie linear vergrößern und wenn fertig unsichtbar machen
	d3.selectAll(".prgsFront") //Klasse auswählen
		.transition().duration(time).ease("linear") //Div linear über Zeit vergrößern
		.attr("width", prgsWidth) //Breite des Divs
		.call(endall,  function() { //Wenn am Ende
			d3.selectAll("#progress") //Klasse auswählen
				.style("visibility", "hidden"); //Unsichtbar machen
		});
	
	//Reset auf Breite 0
	d3.selectAll(".prgsFront") //Klasse auswählen
		.attr("width", 0); //Breite auf 0
		
};