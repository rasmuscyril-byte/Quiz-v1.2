const quizBeretningBredde = [
    {
        category: "Frivillighed",
        question: "Hvad har forperson Bjarne Christensen fremhævet som den vigtigste årsag til det stigende medlemstal i fynsk fodbold?",
        options: [
            "Flere kunstgræsbaner",
            "Det frivillige arbejde i de fynske klubber",
            "Flere sponsorpenge",
            "Bedre TV-dækning af fodbold"
        ],
        correct: 1,
        explanation: "Bjarne Christensen udtalte: 'Det stigende medlemstal er på ingen måde en selvfølge – det er et resultat af, at nogen lægger tid og sjæl i at give andre gode oplevelser.' Frivilligheden er grundstenen i fynsk fodbold."
    },
    {
        category: "Medlemsvækst",
        question: "I hvor mange år i træk havde fynsk fodbold oplevet medlemsvækst ifølge formandens beretning i 2024?",
        options: ["1 år", "2 år", "3 år", "5 år"],
        correct: 2,
        explanation: "Fynsk fodbold havde gennem de seneste tre år oplevet en medlemsvækst, hvor flere og flere fynboer snørede fodboldstøvlerne – fra de yngste til de rutinerede spillere."
    },
    {
        category: "Medlemsvækst",
        question: "Hvilken aldersgruppe gav anledning til bekymring, trods generel vækst i fynsk fodbold?",
        options: [
            "Seniorspillere over 40",
            "Børnefodbolden",
            "Ungdomsspillere 16-19 år",
            "Kvindelige seniorspillere"
        ],
        correct: 1,
        explanation: "De nyeste tal for børnefodbolden gav anledning til nærmere drøftelse, da tallene ikke viste samme fremgang som i øvrige aldersklasser – trods store ressourcer afsat til udvikling."
    },
    {
        category: "Medlemsvækst",
        question: "Hvor stor var medlemsvæksten i fynsk fodbold fra 2023 til 2024?",
        options: ["Ca. 1% (320 medlemmer)", "Ca. 3% (796 medlemmer)", "Ca. 5% (1.500 medlemmer)", "Ca. 7% (2.100 medlemmer)"],
        correct: 1,
        explanation: "Fynsk fodbold oplevede en vækst på 796 medlemmer, svarende til knap 3%. Væksten stod ifølge forpersonen på skuldrene af det frivillige arbejde i de fynske klubber."
    },
    {
        category: "Get Movin'",
        question: "Hvad hedder det projekt, hvor DBU og Nordea-fonden sammen styrker pige- og kvindefodbolden?",
        options: ["Piger i Spil", "Get Movin'", "Fodbold for Alle", "Girls United"],
        correct: 1,
        explanation: "Get Movin' er et samarbejdsprojekt mellem DBU og Nordea-fonden, der i samarbejde med danske fodboldklubber skal styrke og løfte pige- og kvindefodbolden. Ambitionen er at skabe øget ligeværd mellem kønnene."
    },
    {
        category: "Get Movin'",
        question: "Hvilken fynsk klub var den første Get Movin'-klub på Fyn?",
        options: ["Bogense G & IF", "Fortuna Oure", "Næsby BK", "Vindinge BK"],
        correct: 2,
        explanation: "Næsby BK gik all in på pigerne som Fyns første Get Movin'-klub. Klubben har en engageret børneudviklingschef, pigeungdomsformand og pigetræner ved navn Lenni Lund."
    },
    {
        category: "Get Movin'",
        question: "Hvad er en del af Get Movin'-projektets ambassadørkorps?",
        options: [
            "Et netværk af minimum 96 unge piger/kvinder, der besøger skoler og SFO'er",
            "Et panel af professionelle kvindelige fodboldspillere",
            "En gruppe af mandlige trænere med specialuddannelse",
            "Et udvalg af borgmestre fra fynske kommuner"
        ],
        correct: 0,
        explanation: "Get Movin' har et ambassadørkorps bestående af minimum 96 unge piger og kvinder rekrutteret via klubber. Ambassadørerne havde allerede afholdt 140 besøg på skoler og SFO'er."
    },
    {
        category: "Kvindefodbold",
        question: "Hvornår nedsatte DBU Fyn et dedikeret pige-/kvindeudvalg?",
        options: ["2020", "2021", "2023", "2025"],
        correct: 2,
        explanation: "I 2023 nedsatte DBU Fyn et pige-/kvindeudvalg for at sætte spot og turbo på udviklingen af fodboldmiljøer for piger og kvinder på Fyn. Næsten 30 kandidater meldte sig."
    },
    {
        category: "Kvindefodbold",
        question: "Hvem er forperson for DBU Fyns pige- og kvindeudvalg?",
        options: ["Bjarne Christensen", "Mette Gregersen", "Helene Hagsten Pedersen", "Pernille Teichert"],
        correct: 2,
        explanation: "Helene Hagsten Pedersen fra DBU Fyns bestyrelse er forperson for det nye pige- og kvindeudvalg. Hun blev i februar 2026 også valgt som næstforperson i DBU Fyn."
    },
    {
        category: "Kvindefodbold",
        question: "Hvilken sproglig ændring vedtog DBU Fyn ved delegeretmødet i 2023 som led i at kønsneutralisere fodboldsproget?",
        options: [
            "At kalde alle spillere 'fodboldere'",
            "At ændre 'Formand' til 'Forperson' og 'Næstformand' til 'Næstforperson'",
            "At fjerne 'mand' fra alle klubnavne",
            "At indføre engelske titler"
        ],
        correct: 1,
        explanation: "Ved delegeretmødet i 2023 besluttede DBU Fyn at ændre 'Formand' til 'Forperson' og 'Næstformand' til 'Næstforperson' i lovene – et konkret skridt mod et mere kønsneutralt fodboldsprog."
    },
    {
        category: "Kvindefodbold",
        question: "Hvilken sydfynsk klub har boosted pigefodbolden via 'Fantastisk Fodboldstart for piger'?",
        options: ["Svendborg fB", "Fortuna Oure", "Faaborg BK", "Ringe BK"],
        correct: 1,
        explanation: "Fortuna Oure (Fortuna Svendborg) har gennem flere år arrangeret DBU's 'Fantastisk Fodboldstart for piger' og er en aktiv Get Movin'-klub på Sydfyn."
    },
    {
        category: "Velfærdsalliancer",
        question: "Hvilken kommune indgik en velfærdsalliance med DBU Fyn og DBU om at bringe fodbold ud i daginstitutioner, skoler og klubber?",
        options: ["Odense Kommune", "Middelfart Kommune", "Svendborg Kommune", "Nyborg Kommune"],
        correct: 1,
        explanation: "Middelfart Kommune, DBU Fyn og DBU indgik en 5-årig samarbejdsaftale, der løber til 31. december 2030, med et budget på 250.000 kr. i 2026."
    },
    {
        category: "Velfærdsalliancer",
        question: "Hvilken kommune indgik en 5-årig velfærdsalliance med DBU og DBU Fyn for at samle mennesker på tværs af alder, køn og forudsætninger?",
        options: ["Middelfart Kommune", "Faaborg-Midtfyn Kommune", "Nordfyns Kommune", "Assens Kommune"],
        correct: 2,
        explanation: "Nordfyns Kommune, DBU og DBU Fyn indgik en ny 5-årig velfærdsalliance, der skal samle mennesker på tværs af alder, køn og forudsætninger i fodboldens fællesskab."
    },
    {
        category: "Sociale projekter",
        question: "Hvad er FC Demens?",
        options: [
            "Et fodboldhold for seniorer over 70",
            "Fodbold for mennesker med demenslignende symptomer eller tidlig demens",
            "Et fantasyhold i Superligaen",
            "En afdeling i OB for motionister"
        ],
        correct: 1,
        explanation: "FC Demens er fodbold for mennesker med demenslignende symptomer eller tidlig demens. OKS kører FC Demens i samarbejde med DBU Fyn og Odense Kommune."
    },
    {
        category: "Sociale projekter",
        question: "Hvad er 'Fodbold for Hjertet'?",
        options: [
            "En velgørenhedskamp for Hjerteforeningen",
            "Fodbold for mennesker med hjerte-kar-sygdomme, i samarbejde med Hjerteforeningen og SDU",
            "Et event for børn med medføddte hjertefejl",
            "En kampagne for at fremme fair play"
        ],
        correct: 1,
        explanation: "Fodbold for Hjertet er et samarbejde mellem DBU, Hjerteforeningen og Syddansk Universitet (SDU) om fodbold for mennesker med hjerte-kar-sygdomme. Målet er 10 kommuner og 30 lokale klubber."
    },
    {
        category: "Ungdomsstrategi",
        question: "Hvad byggede DBU's nye ungdomsstrategi ovenpå, ifølge formandens beretning?",
        options: [
            "UEFA's talentprogram",
            "Den succesfulde børnestrategi",
            "Superligaklubbernes akademier",
            "Kommunernes fritidstilbud"
        ],
        correct: 1,
        explanation: "DBU's nye ungdomsstrategi byggede ovenpå den succesfulde børnestrategi og skulle skabe bedre rammer for de unge, så de kan opleve glæden ved sporten og udvikle sig som mennesker."
    },
    {
        category: "Adfærd og kultur",
        question: "Hvad er titlen på kampagnen DBU Fyn lancerede i 2025 for god adfærd?",
        options: [
            "Fair Play Fyn",
            "Gode fodboldoplevelser er et fælles ansvar",
            "Respekt på banen",
            "Fynsk Fair Football"
        ],
        correct: 1,
        explanation: "Under overskriften 'Gode fodboldoplevelser er et fælles ansvar' udrullede DBU Fyn i 2025 en kampagne med fokus på alles ansvar for at skabe gode fodboldoplevelser."
    },
    {
        category: "Klubudvikling",
        question: "Hvem er klubrådgiver hos DBU Fyn og nævnes i forbindelse med Get Movin'-arbejdet i Bogense?",
        options: ["Anders Haagen Jensen", "Thomas Søfeldt", "Lenni Lund", "Bjarne Christensen"],
        correct: 1,
        explanation: "Thomas Søfeldt er klubrådgiver hos DBU Fyn. Han har bl.a. fremhævet Bogense G & IF's arbejde med pige-/kvindefodbolden gennem Get Movin'-projektet."
    },
    {
        category: "Nationale tal",
        question: "Hvor mange fodboldspillere var der i alt i de danske klubber i 2024 (rekord)?",
        options: ["298.000", "335.000", "373.501", "412.000"],
        correct: 2,
        explanation: "Medlemstallet satte rekord i 2024 med 373.501 fodboldspillere i de danske klubber. Over 85.000 af dem var piger og kvinder – et hurtigt voksende segment."
    },
    {
        category: "Nationale tal",
        question: "Hvor mange børn deltog på DBU's Fodboldskoler i 2024?",
        options: ["15.800", "19.200", "24.613", "31.000"],
        correct: 2,
        explanation: "I 2024 deltog 24.613 børn på DBU's Fodboldskoler. Samtidig deltog 8.007 kursister i 531 trænerkurser – uddannelse af trænere er en central del af fodboldens udvikling."
    }
];
