const MAKE_WEBHOOK_URL = "https://hook.make.com/VOTRE_LIEN_UNIQUE_ICI";
const SOBFLOUS_MERCHANT_URL = "https://www.sobflous.tn/api/v1/payment/VOTRE_ID_MARCHAND";

const GateKeeper = {
    verifyAccess() {
        const enteredKey = document.getElementById("access-key").value.trim();
        if (!enteredKey) return alert("Veuillez saisir une clé valide.");
        if (enteredKey === "1234") {
            document.getElementById("gatekeeper").style.display = "none";
            CHAS.init();
        } else {
            alert("Clé incorrecte. Utilisez '1234' pour tester.");
        }
    },
    redirectToSobflous() { window.location.href = SOBFLOUS_MERCHANT_URL; }
};

const Dico = {
    fr: { init_msg: "Business Agent System...Ready!", q1_title: "Questionnaire 1 : Structure & Modèle", q2_title: "Questionnaire 2 : Finance & Trésorerie", q3_title: "Questionnaire 3 : Ventes & Marketing", q4_title: "Questionnaire 4 : Situations de Crise", q5_title: "Questionnaire 5 : Vision Stratégique", btn_send: "VALIDER LA RÉPONSE", btn_wasel: "LANCER L'ANALYSE (WASEL)", loading_title: "ANALYSE DE VOS DONNÉES BUSINESS", final_title: "AUDIT STRATÉGIQUE FINAL", text_placeholder: "Détaillez votre problème ou objectif..." },
    darja: { init_msg: "Business Agent System...Ready!", q1_title: "Moutaba3a 1: Charka w Modèle", q2_title: "Moutaba3a 2: Flous w Finance", q3_title: "Moutaba3a 3: Marketing w Bi3", q4_title: "Moutaba3a 4: Machakel w Azamet", q5_title: "Moutaba3a 5: Vision Stratégique", btn_send: "AB3ATH", btn_wasel: "TAHLIL (WASEL)", loading_title: "TAHLIL EL-CHARKA", final_title: "KHOLASA NEHAYEYA EL-BUSINESS", text_placeholder: "Ikteb houni el-mochkla mte3ek..." }
};

const QuestionsStatic = {
    Q1: [
        { q: "Quel est le statut actuel de votre entreprise ?", a: [ ["a", "Idée / En cours de création"], ["b", "Indépendant / Freelance"], ["c", "PME établie (1 à 10 salariés)"], ["d", "Grande structure (+10 salariés)"] ] },
        { q: "Quel est votre modèle de revenu principal ?", a: [ ["a", "Vente de produits physiques"], ["b", "Prestation de services / Conseil"], ["c", "Abonnement / SaaS / Digital"], ["d", "Commerce de gros / Distribution"] ] },
        { q: "Quelle est votre plus grande urgence ?", a: [ ["a", "Trouver des clients rapidement"], ["b", "Structurer mon équipe"], ["c", "Lever des fonds / Financement"], ["d", "Digitaliser mes processus"] ] }
    ],
    Q2: [
        { q: "Comment qualifiez-vous votre rentabilité actuelle ?", a: [ ["a", "Déficitaire (Je perds de l'loi)"], ["b", "À l'équilibre (Zéro-Zéro)"], ["c", "Rentable et stable"], ["d", "Très rentable avec forte croissance"] ] },
        { q: "Quelle est la situation de votre trésorerie ?", a: [ ["a", "Moins de 1 mois de survie"], ["b", "1 à 3 mois de visibilité"], ["c", "Plus de 6 mois de réserve"], ["d", "Aucune idée, gestion au jour le jour"] ] }
    ],
    Q3: [
        { q: "Quel est votre principal canal d'acquisition ?", a: [ ["a", "Bouche-à-oreille / Recommandations"], ["b", "Réseaux sociaux (Facebook, Insta, LinkedIn)"], ["c", "Publicité payante (Ads) / Prospection"], ["d", "Boutique physique / Passage"] ] },
        { q: "Avez-vous une équipe commerciale dédiée ?", a: [ ["a", "Non, je vends tout seul"], ["b", "Oui, 1 à 3 commerciaux"], ["c", "Oui, une équipe structurée"], ["d", "Je sous-traite ma force de vente"] ] }
    ]
};

const CHAS = {
    state: "[INIT]", lang: "fr", currentIdx: 0,
    answers: { Q1: [], Q2: [], Q3: [], Q4: [], Q5: [] },

    init() {
        this.state = "[INIT]"; this.currentIdx = 0;
        this.answers = { Q1: [], Q2: [], Q3: [], Q4: [], Q5: [] };
        document.getElementById("chat-viewport").innerHTML = "";
        this.printCHASMessage("<h2>BUSINESS SYSTEM ONLINE</h2><p>Veuillez choisir votre langue d'analyse.</p>");
        this.renderLanguageSelection();
    },

    forceReset() { this.init(); },

    setLanguage(langCode) {
        this.lang = langCode === "4" ? "darja" : "fr";
        this.state = "[Q1_BUSINESS]"; this.currentIdx = 0;
        document.getElementById("sub-state-title").innerText = Dico[this.lang].q1_title;
        this.printUserMessage(langCode === "4" ? "Darja" : "Français");
        this.nextQuestion();
    },

    nextQuestion() {
        if (this.state === "[Q1_BUSINESS]") {
            if (this.currentIdx < QuestionsStatic.Q1.length) this.renderQuestionBlock(QuestionsStatic.Q1[this.currentIdx], "Q1");
            else { this.state = "[Q2_FINANCE]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q2_title; this.nextQuestion(); }
        } else if (this.state === "[Q2_FINANCE]") {
            if (this.currentIdx < QuestionsStatic.Q2.length) this.renderQuestionBlock(QuestionsStatic.Q2[this.currentIdx], "Q2");
            else { this.state = "[Q3_MARKETING]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q3_title; this.nextQuestion(); }
        } else if (this.state === "[Q3_MARKETING]") {
            if (this.currentIdx < QuestionsStatic.Q3.length) this.renderQuestionBlock(QuestionsStatic.Q3[this.currentIdx], "Q3");
            else { this.state = "[Q4_CRISES]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q4_title; this.generateQ4CrisesFlow(); }
        }
    },

    handleStaticSelection(section, key, label) {
        this.answers[section].push(key); this.printUserMessage(label); this.currentIdx++; this.nextQuestion();
    },

    generateQ4CrisesFlow() {
        let scenarios = this.lang === "fr" ? [
            { q: "SCÉNARIO RUPTURE : Votre meilleur client décide de rompre son contrat demain. Votre réaction ?", a:[["a","Baisse des prix immédiate"],["b","Action juridique agressive"],["c","Activation immédiate du réseau"],["d","Réduction drastique des charges"]] },
            { q: "SCÉNARIO CONCURRENCE : Un concurrent casse les prix de 40% sur le marché tunisien. Stratégie ?", a:[["a","S'aligner et casser mes prix"],["b","Ignorer et miser sur la qualité"],["c","Pivoter vers une offre VIP"],["d","Créer une sous-marque low-cost"]] }
        ] : [
            { q: "SÉMINARIO AZMA: Akber client mte3ek i9os el-contrat ghodwa. Chnoua ta3mel ?", a:[["a","Taye7 filssoum toul"],["b","Tachtki bih lel 9adha2"],["c","Tkalem l-ma3ارف mte3ek"],["d","Tna9as fil masarif toul"]] },
            { q: "SÉMINARIO CONCURRENCE: Wa7ed jdid taye7 filssoum 40% fil tounes. Chniya l-khotta ?", a:[["a","Taye7 kifou toul"],["b/-","Ttafi edhaw wtsaker rasek"],["c","Ta3mel offre VIP ralia"],["d","Ta3mel marka okhra rkhissa"]] }
        ];

        if (this.currentIdx < scenarios.length) this.renderQuestionBlock(scenarios[this.currentIdx], "Q4");
        else { this.state = "[Q5_VISION]"; this.currentIdx = 0; document.getElementById("sub-state-title").innerText = Dico[this.lang].q5_title; this.generateQ5VisionFlow(); }
    },

    handleQ4Selection(key, label) {
        this.answers.Q4.push(key); this.printUserMessage(label); this.currentIdx++; this.generateQ4CrisesFlow();
    },

    generateQ5VisionFlow() {
        let openQuestions = this.lang === "fr" ? [
            "Décrivez précisément votre produit ou service phare :",
            "Quelles sont vos ambitions de chiffre d'affaires d'ici un an en Dinars ?"
        ] : [
            "Ahkili bel gda 3la l-produit wala service mte3ek :",
            "Chnoua l-objectif mte3ek fi chiffre d'affaires ba3d 3am fil tounes ?"
        ];

        if (this.currentIdx < openQuestions.length) this.renderOpenQuestionZone(openQuestions[this.currentIdx]);
        else { this.state = "[ATTENTE_SYNTHESE]"; document.getElementById("sub-state-title").innerText = "VALIDATION"; this.renderWaselTrigger(); }
    },

    handleQ5TextSubmit() {
        const txtArea = document.getElementById("q5-textarea");
        if (!txtArea || !txtArea.value.trim()) return;
        this.answers.Q5.push(txtArea.value.trim());
        this.printUserMessage(txtArea.value.trim().substring(0, 40) + "...");
        this.currentIdx++; this.generateQ5VisionFlow();
    },

    async triggerInternalSynthesisLoading() {
        this.state = "[SYNTHESE_INTERNE]";
        document.getElementById("sub-state-title").innerText = Dico[this.lang].loading_title;
        document.getElementById("response-viewport").innerHTML = "";

        const chatView = document.getElementById("chat-viewport");
        const loadContainer = document.createElement("div");
        loadContainer.className = "loader-interne";
        loadContainer.innerHTML = `<div>⚡ CONNECTING BUSINESS IA (GROQ/LLAMA3)...</div>`;
        chatView.appendChild(loadContainer);
        chatView.scrollTop = chatView.scrollHeight;

        try {
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agent: "business", key: document.getElementById("access-key").value, data: this.answers, lang: this.lang })
            });
            const result = await response.json();
            this.state = "[RENDU_FINAL]";
            document.getElementById("sub-state-title").innerText = Dico[this.lang].final_title;
            this.printCHASMessage(result.analysis_html || `<h2>Audit Terminé</h2><p>${result.text_fallback}</p>`);
        } catch (err) {
            this.printCHASMessage("<h2>Erreur de synchronisation IA Business.</h2><p>Vérifiez Make.com.</p>");
        }
        document.getElementById("response-viewport").innerHTML = `<button class="btn-action-unique" onclick="CHAS.init()">Nouvel Audit</button>`;
    },

    renderLanguageSelection() {
        document.getElementById("response-viewport").innerHTML = `
            <div class="grille-boutons" style="grid-template-rows: 1fr 1fr;">
                <div class="btn-carre" onclick="CHAS.setLanguage('2')">Français</div>
                <div class="btn-carre" onclick="CHAS.setLanguage('4')">دارجة تونسية</div>
            </div>`;
    },

    renderQuestionBlock(qObj, section) {
        this.printCHASMessage(`<h3>${qObj.q}</h3>`);
        let btnHtml = `<div class="grille-boutons">`;
        qObj.a.forEach(opt => {
            let clickAction = section === "Q4" ? `CHAS.handleQ4Selection('${opt[0]}', '${opt[1].replace(/'/g, "\\'")}')` : `CHAS.handleStaticSelection('${section}', '${opt[0]}', '${opt[1].replace(/'/g, "\\'")}')`;
            btnHtml += `<div class="btn-carre" onclick="${clickAction}">${opt[1]}</div>`;
        });
        document.getElementById("response-viewport").innerHTML = btnHtml + `</div>`;
    },

    renderOpenQuestionZone(questionText) {
        this.printCHASMessage(`<h3>${questionText}</h3>`);
        document.getElementById("response-viewport").innerHTML = `
            <div class="zone-saisie-wrapper">
                <textarea class="zone-saisie" id="q5-textarea" placeholder="${Dico[this.lang].text_placeholder}"></textarea>
                <button class="btn-action-unique" style="height:35%; font-size:2rem;" onclick="CHAS.handleQ5TextSubmit()">${Dico[this.lang].btn_send}</button>
            </div>`;
    },

    renderWaselTrigger() {
        document.getElementById("response-viewport").innerHTML = `<button class="btn-action-unique" onclick="CHAS.triggerInternalSynthesisLoading()">${Dico[this.lang].btn_wasel}</button>`;
    },

    printCHASMessage(htmlContent) {
        const viewport = document.getElementById("chat-viewport");
        const block = document.createElement("div"); block.className = "message-cas";
        block.innerHTML = `<span class="badge-etape">${this.state.replace("[", "").replace("]", "")}</span><div style="margin-top:6px;">${htmlContent}</div>`;
        viewport.appendChild(block); viewport.scrollTop = viewport.scrollHeight;
    },

    printUserMessage(text) {
        const viewport = document.getElementById("chat-viewport");
        const bubble = document.createElement("div"); bubble.className = "message-user"; bubble.innerText = text;
        viewport.appendChild(bubble); viewport.scrollTop = viewport.scrollHeight;
    }
};