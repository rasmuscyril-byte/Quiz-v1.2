const quizQuestions = [
    {
        category: "Pionerårene",
        question: "Hvilket år blev Odense Boldklub (OB) grundlagt?",
        options: ["1887", "1889", "1893", "1901"],
        correct: 1,
        explanation: "OB blev grundlagt den 12. august 1889 og er dermed en af Danmarks ældste fodboldklubber. Som formandens beretninger har fremhævet, har klubben været bærende for fynsk fodbold i over 130 år."
    },
    {
        category: "Pionerårene",
        question: "Hvilken fynsk klub, grundlagt i 1909, var med til at forme den tidlige fynske fodbold?",
        options: ["Svendborg fB", "Boldklubben 1909 (B1909)", "Kerteminde BK", "Nyborg GIF"],
        correct: 1,
        explanation: "B1909 (Boldklubben 1909) fra Odense har spillet en vigtig rolle i fynsk fodboldhistorie. Ifølge formandens beretninger var klubben i årtier en central del af fodboldmiljøet i Odense sammen med OB og B1913."
    },
    {
        category: "Pionerårene",
        question: "Hvornår blev DBU Fyn (Dansk Boldspil-Union Fyn) stiftet som lokalunion?",
        options: ["1895", "1903", "1907", "1911"],
        correct: 2,
        explanation: "DBU Fyn blev stiftet i 1907 for at organisere fodbold på Fyn. Formandens beretninger har gennem årene dokumenteret unionens arbejde med at udvikle bredde- og elitefodbold i regionen."
    },
    {
        category: "OB – Mesterskaber",
        question: "Hvornår vandt OB sit første danske mesterskab?",
        options: ["1975", "1977", "1979", "1982"],
        correct: 1,
        explanation: "OB vandt sit første danske mesterskab i 1977 under træner Kurt Nielsen. Formandens beretning fra det år fremhævede det som et historisk gennembrud for fynsk fodbold."
    },
    {
        category: "OB – Mesterskaber",
        question: "Hvor mange danske mesterskaber har OB vundet i alt?",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "OB har vundet 3 danske mesterskaber: 1977, 1982 og 1989. Formandens beretninger fra disse guldår beskriver, hvordan OB satte Fyn på Danmarkskortet i dansk fodbold."
    },
    {
        category: "OB – Mesterskaber",
        question: "I 1982 vandt OB mesterskabet under hvilken legendarisk træner?",
        options: ["Sepp Piontek", "Kurt Nielsen", "Roald Poulsen", "John Eriksen"],
        correct: 0,
        explanation: "Sepp Piontek, der også var dansk landstræner, stod i spidsen for OB i den periode. Formandens beretning fremhævede samarbejdet mellem OB og landsholdet som et stolt kapitel i fynsk fodbold."
    },
    {
        category: "OB – Pokaler",
        question: "Hvor mange gange har OB vundet den danske pokalturnering (DBU Pokalen)?",
        options: ["3", "5", "6", "8"],
        correct: 1,
        explanation: "OB har vundet pokalturneringen 5 gange (1983, 1991, 1993, 2002, 2007). Pokaltriumferne er gentagne gange blevet fejret i formandens beretninger som højdepunkter for klubben."
    },
    {
        category: "OB – Europa",
        question: "I hvilken europæisk turnering deltog OB efter mesterskabet i 1989?",
        options: ["Champions League", "Europa League", "Mesterholdenes Europa Cup", "UEFA Cuppen"],
        correct: 2,
        explanation: "Efter mesterskabet i 1989 deltog OB i Mesterholdenes Europa Cup (forgængeren for Champions League). Formandens beretning beskrev det som en milepæl at repræsentere Fyn på den europæiske scene."
    },
    {
        category: "OB – Europa",
        question: "Hvilket storhold mødte OB i Europa Cup-sammenhæng i sæsonen 1989/90?",
        options: ["AC Milan", "Real Madrid", "Bayern München", "Liverpool"],
        correct: 2,
        explanation: "OB mødte Bayern München i Mesterholdenes Europa Cup 1989/90. Kampen på Odense Stadion tiltrak enorm opmærksomhed, og formandens beretning kaldte det et af de største øjeblikke i fynsk fodboldhistorie."
    },
    {
        category: "Legendariske spillere",
        question: "Hvilken OB-spiller blev topscorer i Superligaen og var kendt som en fynsk fodboldlegende i 1990'erne?",
        options: ["Lars Høgh", "Thomas Helveg", "Stig Tøfting", "Morten Bisgaard"],
        correct: 3,
        explanation: "Morten Bisgaard var en nøglespiller for OB i 1990'erne og blev en af de mest markante fynske fodboldprofiler. Formandens beretninger har fremhævet hans bidrag til klubben og hans status som et forbillede."
    },
    {
        category: "Legendariske spillere",
        question: "Hvilken legendarisk OB-målmand spillede for klubben i over 25 år og blev et symbol på fynsk fodbold?",
        options: ["Lars Høgh", "Kaare Danielsen", "Arek Onyszko", "Stephan Andersen"],
        correct: 0,
        explanation: "Lars Høgh tilbragte hele sin karriere i OB (1978–1999) og spillede over 800 kampe. Formandens beretninger har gentagne gange hyldet ham som den ultimative OB-legende og et symbol på fynsk fodboldloyalitet."
    },
    {
        category: "Legendariske spillere",
        question: "Hvilken OB-spiller skiftede til AC Milan og spillede VM-finale med Danmark i 1998?",
        options: ["Brian Steen Nielsen", "Thomas Helveg", "Allan Nielsen", "Peter Møller"],
        correct: 1,
        explanation: "Thomas Helveg startede sin karriere i OB inden han skiftede til Udinese og senere AC Milan. Formandens beretning fremhævede ham som et eksempel på, hvordan fynsk fodbold kan udvikle spillere til verdensklasse."
    },
    {
        category: "Stadions og faciliteter",
        question: "Hvad hedder OB's hjemmebane, der i dag er kendt under et sponsornavn?",
        options: ["Parken", "Nature Energy Park", "Brøndby Stadion", "MCH Arena"],
        correct: 1,
        explanation: "OB's hjemmebane er Odense Stadion, der i dag er kendt som Nature Energy Park. Formandens beretninger har gennem årene beskrevet stadionets udvikling fra en simpel fodboldbane til et moderne stadionanlæg."
    },
    {
        category: "Stadions og faciliteter",
        question: "Hvornår blev Odense Stadion oprindeligt indviet?",
        options: ["1930", "1941", "1955", "1963"],
        correct: 1,
        explanation: "Odense Stadion blev indviet i 1941. Formandens beretninger dokumenterer stadionets mange renoveringer og udvidelser, som har gjort det til et centralt samlingspunkt for fynsk fodbold."
    },
    {
        category: "Fynske klubber",
        question: "Hvilken fynsk klub, grundlagt i 1913, har navn efter sit stiftelsesår og har haft perioder i de øverste danske rækker?",
        options: ["B1901", "B1909", "B1913", "B1921"],
        correct: 2,
        explanation: "B1913 fra Odense har ligesom B1909 været en del af det fynske fodboldlandskab. Formandens beretninger har nævnt klubbens rolle i udviklingen af talenter og breddefodbold på Fyn."
    },
    {
        category: "Fynske klubber",
        question: "Hvilken sydfynsk klub har repræsenteret Svendborg i dansk fodbold?",
        options: ["Nyborg GIF", "Svendborg fB", "Faaborg BK", "Assens FC"],
        correct: 1,
        explanation: "Svendborg forenede Boldklubber (Svendborg fB) har været Sydfyns flagskib i fodbold. Formandens beretninger har anerkendt klubbens indsats for at holde fodbolden levende uden for Odense."
    },
    {
        category: "DBU Fyn og organisation",
        question: "Hvad er den primære opgave for DBU Fyn ifølge formandens beretninger?",
        options: [
            "At drive Superligaen",
            "At udvikle bredde- og ungdomsfodbold på Fyn",
            "At udvælge landsholdet",
            "At bygge stadioner"
        ],
        correct: 1,
        explanation: "Formandens beretninger har konsekvent understreget, at DBU Fyns kerneopgave er at udvikle bredde- og ungdomsfodbolden i regionen, sikre gode rammer for klubberne og fremme fodboldens vækst på alle niveauer."
    },
    {
        category: "DBU Fyn og organisation",
        question: "Hvilket tema er ifølge formandens beretninger blevet stadig vigtigere i fynsk fodbold i de seneste årtier?",
        options: [
            "Færre hold i turneringerne",
            "Kvindefodbold og ligestilling",
            "Afskaffelse af ungdomsfodbold",
            "Kun fokus på elitefodbold"
        ],
        correct: 1,
        explanation: "Formandens beretninger har i de seneste årtier i stigende grad fokuseret på kvindefodbold og ligestilling som et centralt udviklingsområde. Fyn har haft en aktiv rolle i at fremme pigefodbold og kvindelige trænere og ledere."
    },
    {
        category: "Moderne tid",
        question: "I hvilket årti oplevede OB en markant succes med to mesterskaber og pokaltriumfer i Superligaen?",
        options: ["1990'erne", "2000'erne", "2010'erne", "2020'erne"],
        correct: 1,
        explanation: "I 2000'erne (særligt 2002–2011) oplevede OB en storhedstid med pokaltitler i 2002 og 2007. Formandens beretninger fra denne periode beskriver en klub i rivende udvikling med stærke sportslige resultater."
    },
    {
        category: "Moderne tid",
        question: "Hvad har formandens beretninger i nyere tid fremhævet som en udfordring for de fynske klubber?",
        options: [
            "For mange spillere",
            "Frivillighedens vilkår og rekruttering af ledere",
            "For mange stadioner",
            "Mangel på græsbaner"
        ],
        correct: 1,
        explanation: "Formandens beretninger har i nyere tid gentagne gange påpeget udfordringen med at fastholde og rekruttere frivillige ledere, trænere og dommere. Frivilligheden er grundstenen i dansk fodbold, og dens vilkår er afgørende for fynsk fodbolds fremtid."
    }
];
