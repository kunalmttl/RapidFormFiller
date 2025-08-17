// ==UserScript==
// @name         Universal Google Form Autofiller
// @namespace    http://tampermonkey.net/
// @version      2025.08.18.1
// @description  Auto-fills Google Forms reliably (text, radio, checkbox) with flexible matching. Highly customizable.
// @author       github.com/kunalmttl
// @match        https://docs.google.com/forms/d/e/*
// @match        https://docs.google.com/forms/d/e/*/viewform
// @match        https://docs.google.com/forms/d/e/*/formResponse
// @match        https://forms.gle/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    /*********************************************************************************************
     *                                   🚀 HOW TO USE THIS SCRIPT
     *
     * 1. Install the Tampermonkey extension in your browser.
     * 2. Copy-paste this entire script into a new Tampermonkey userscript.
     * 3. Edit the CONFIGURATION sections below:
     *      - Map your Google Form questions to short keys (`potentialQuestionsMap`).
     *      - Fill your personal answers inside `myAnswers`.
     * 4. Open your target Google Form and watch the script auto-fill it.
     *
     *  NOTES:
     *   - The script supports TEXT, EMAIL, NUMBER, RADIO BUTTONS, and CHECKBOXES.
     *   - Matching is case-insensitive and fuzzy (so “Yes” ≈ “yes” ≈ “YES”).
     *   - If the form layout changes, update the container class (default: `.Qr7Oae`).
     *
     *********************************************************************************************/


    /*********************************************************************************************
     * PART 1: QUESTION MAP
     * -------------------------------------------------------------------------------------------
     * Why: Google Forms questions may be worded differently (e.g., "Roll No" vs "Student ID").
     * This map links all possible question texts to a simple, unique key.
     *
     * How to use:
     *   - The **left side**: phrases you expect to see in the form (lowercase, flexible).
     *   - The **right side**: a short key that YOU define and will use in `myAnswers`.
     *
     *********************************************************************************************/
    const potentialQuestionsMap = {
        // --- Identification ---
        "student id": "sid", "sid": "sid", "roll no.": "sid", "roll number": "sid",

        // --- Name ---
        "full name": "fullName", "name": "fullName", "student's name": "fullName", "your name": "fullName",

        // --- Email ---
        "email address": "email", "email": "email", "pec email": "email", "e-mail address": "email",
        "college e-mail address": "email", "registered email": "email",

        // --- Phone ---
        "phone number": "phone", "contact no": "phone", "mobile number": "phone",

        // --- Payment/Transaction ---
        "transaction id": "txId", "payment reference": "txId", "reference number": "txId",
        "fee receipt number": "txId", "utr number": "txId",

        // --- Aadhar ---
        "aadhar": "aadhar", "aadhar card no": "aadhar", "aadhar card number": "aadhar",

        // --- Hostel related ---
        "hostel": "hostel", "hostel you will be staying in": "hostel",
        "are you a previous hosteller": "isHosteller",

        // --- Year / Academic ---
        "select your year": "year", "year": "year", "your current year": "year",

        // --- Parents ---
        "enter your parent's name": "parentName",
        "parent's aadhar card number": "parentAadhar",

        // --- General ---
        "gender": "gender",
        "branch": "branch",
    };


    /*********************************************************************************************
     * PART 2: YOUR ANSWERS
     * -------------------------------------------------------------------------------------------
     * Why: This is where you store the answers to be filled in automatically.
     *
     * How to use:
     *   - The **left side**: the simple keys you defined in the `potentialQuestionsMap`.
     *   - The **right side**: your actual answers (strings, numbers, or arrays for checkboxes).
     *
     *   NOTE: For radio buttons & dropdowns → answer text MUST match the option’s text.
     *         For checkboxes → you can use an array: ["Option 1", "Option 2"].
     *********************************************************************************************/
    const myAnswers = {
        "sid": "blank",
        "fullName": "blank",
        "email": "blank",
        "phone": "blank",
        "txId": "blank",
        "aadhar": "blank",
        "isHosteller": "blank",
        "year": "blank",
        "hostel": "blank",
        "parentName": "blank",
        "parentAadhar": "blank",
        "gender": "blank",
        "branch": "blank"
    };


    /*********************************************************************************************
     * PART 3: CORE LOGIC
     * -------------------------------------------------------------------------------------------
     * You don’t need to touch this unless Google Forms changes its DOM structure.
     * Handles:
     *   ✅ Text Inputs
     *   ✅ Emails
     *   ✅ Numbers
     *   ✅ Radio Buttons (with fuzzy matching)
     *   ✅ Checkboxes (with fuzzy matching)
     *********************************************************************************************/

    // Utility: Normalize text (case-insensitive, collapse spaces)
    function normalize(s){
        return (s||"").toLowerCase().replace(/\s+/g," ").trim();
    }

    // Utility: Match a label to one of our keys
    function findKeyForLabel(label){
        const norm = normalize(label);
        for(const k in potentialQuestionsMap){
            if(norm.includes(k)) return potentialQuestionsMap[k];
        }
        return null;
    }

    // Utility: Safe click simulation
    function simulateClick(el){ if(el) el.click(); }

    // Main autofill engine
    function fillTheForm(){
        console.log("🚀 Starting Form Autofill...");
        const questionContainers = document.querySelectorAll('.Qr7Oae'); // Google Form question wrapper

        if(!questionContainers.length){
            console.warn("❌ No question containers found. Update the class if Google changes DOM.");
            return;
        }

        let filled = 0;

        questionContainers.forEach(c=>{
            const labelEl = c.querySelector('.M7eMe'); // Question text
            if(!labelEl) return;

            const labelText = labelEl.innerText.trim();
            if(!labelText) return;

            const key = findKeyForLabel(labelText);
            if(!key) return;

            const ans = myAnswers[key];
            if(ans === undefined) return;

            // --- TEXT / EMAIL / NUMBER INPUTS ---
            const input = c.querySelector('input[type="text"],input[type="email"],input[type="number"],textarea');
            if(input){
                input.value = ans;
                input.dispatchEvent(new Event('input',{bubbles:true}));
                console.log(`✅ Filled TEXT: ${labelText} -> ${ans}`);
                filled++;
                return;
            }

            // --- RADIO BUTTONS ---
            const radios = c.querySelectorAll('[role="radio"], .uVccjd, .docssharedWizToggleLabeledContainer');
            if(radios.length){
                const ansNorm = normalize(String(ans));
                for(const r of radios){
                    const txt = (r.innerText||"").trim();
                    if(!txt) continue;
                    const txtNorm = normalize(txt);
                    if(txtNorm===ansNorm || txtNorm.includes(ansNorm) || ansNorm.includes(txtNorm)){
                        simulateClick(r);
                        console.log(`✅ Selected RADIO: ${labelText} -> ${txt}`);
                        filled++;
                        break;
                    }
                }
                return;
            }

            // --- CHECKBOXES ---
            const checks = c.querySelectorAll('[role="checkbox"]');
            if(checks.length){
                const ansList = Array.isArray(ans)?ans:[ans];
                for(const a of ansList){
                    const ansNorm = normalize(String(a));
                    for(const ck of checks){
                        const txt = (ck.innerText||"").trim();
                        if(!txt) continue;
                        const txtNorm = normalize(txt);
                        if(txtNorm===ansNorm || txtNorm.includes(ansNorm) || ansNorm.includes(txtNorm)){
                            simulateClick(ck);
                            console.log(`✅ Checked BOX: ${labelText} -> ${txt}`);
                            filled++;
                        }
                    }
                }
                return;
            }
        });

        console.log(`🎉 Done! Filled ${filled} fields.`);
    }

    // Run after page load
    window.addEventListener('load',()=>{ setTimeout(fillTheForm,500); });

})();
