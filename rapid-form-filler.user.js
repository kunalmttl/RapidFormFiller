// ==UserScript==
// @name         Form Filler Pro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A high-speed, configurable user script to automatically fill Google Forms in milliseconds, designed for time-sensitive applications.
// @author       github.com/kunalmttl
// @match        https://docs.google.com/forms/d/e/*
// @match        https://forms.gle/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    /*********************************************************************************************
     *                                                                                           *
     *   =============================== CONFIGURATION ===============================           *
     *   This is the only section you need to edit. Follow the instructions carefully.           *
     *                                                                                           *
     *********************************************************************************************/

    /**
     * PART 1: The Question Map
     * ------------------------
     * Why: Google Forms can have slightly different questions (e.g., "Full Name" vs "Your Name").
     *      This map connects all possible question phrases to a single, simple key.
     * How:
     *   1. On the left side (in quotes), write a potential question phrase in all lowercase.
     *   2. On the right side (in quotes), give it a simple, unique key (e.g., "fullName").
     *   3. Add as many variations for each question as you can think of.
     */
  
    const potentialQuestionsMap = {
        // --- Example: Name Variations ---
        "full name": "fullName",
        "name": "fullName",
        "student's name": "fullName",
        "your name": "fullName",

        // --- Example: Email Variations ---
        "email address": "email",
        "email": "email",
        "e-mail address": "email",
        "registered email": "email",

        // --- Example: Student ID Variations ---
        "student id": "sid",
        "sid": "sid",
        "roll number": "sid",
        "roll no": "sid",

        // --- Example: Choice/Radio Button Variations ---
        "gender": "gender",
        "branch": "branch",
        "year": "year",

        // ADD ALL YOUR OTHER POTENTIAL QUESTIONS HERE
    };

    /**
     * PART 2: Your Answers
     * --------------------
     * Why: This is where you store the actual data that will be filled into the form.
     * How:
     *   1. On the left side (in quotes), use the simple key you defined in the `potentialQuestionsMap`.
     *   2. On the right side (in quotes), write your exact answer.
     *   3. Make sure every key from the map has a corresponding answer here.
     */
    const myAnswers = {
        // --- Use the keys from PART 1 to provide your answers ---
        "fullName": "Your Full Name",
        "email": "your.email@example.com",
        "sid": "12345678",
        
        // For Radio Buttons or Dropdowns, the answer must EXACTLY match the option text.
        "gender": "Male",
        "branch": "Electrical Engineering",
        "year": "3rd Year",
        
        // ADD ALL YOUR OTHER ANSWERS HERE
    };


    /*********************************************************************************************
     *                                                                                           *
     *   ================================= CORE LOGIC =================================          *
     *   DO NOT EDIT BELOW THIS LINE unless you know what you are doing.                         *
     *                                                                                           *
     *********************************************************************************************/

    /**
     * THE GOLDEN RULE: If the script doesn't work, it's almost always because the "question container"
     * class name used by Google has changed. See the README on GitHub for how to find the new one.
     */
    const GOOGLE_FORM_QUESTION_CONTAINER_CLASS = '.Qr7Oae';

    // Function to find the correct answer key for a given question label
    function findKeyForLabel(label) {
        const normalizedLabel = label.toLowerCase();
        for (const key in potentialQuestionsMap) {
            if (normalizedLabel.includes(key)) {
                return potentialQuestionsMap[key];
            }
        }
        return null;
    }

    // Main function to fill the form
    function fillTheForm() {
        console.log("🚀 Form Filler Pro: Starting high-speed fill...");
        const questionContainers = document.querySelectorAll(GOOGLE_FORM_QUESTION_CONTAINER_CLASS);

        if (questionContainers.length === 0) {
            console.error(`❌ Form Filler Pro: Could not find any question containers with the class "${GOOGLE_FORM_QUESTION_CONTAINER_CLASS}". The form structure might have changed! See the project README for instructions on how to fix this.`);
            return;
        }

        questionContainers.forEach(container => {
            const labelElement = container.querySelector('.M7eMe');
            if (!labelElement || !labelElement.innerText) return;
            const labelText = labelElement.innerText.trim();
            const answerKey = findKeyForLabel(labelText);

            if (!answerKey) {
                console.warn(`🤔 Form Filler Pro: No match found for question: "${labelText}"`);
                return;
            }

            const answer = myAnswers[answerKey];
            if (answer === undefined) {
                console.warn(`❓ Form Filler Pro: No answer provided for key: "${answerKey}"`);
                return;
            }

            // Logic for Text and Number inputs
            const textInput = container.querySelector('input[type="text"], input[type="email"], input[type="number"]');
            if (textInput && typeof answer === 'string') {
                textInput.value = answer;
                // This 'input' event is the magic that makes Google Forms recognize the change.
                textInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log(`✅ Filled [Text]: "${labelText}"`);
                return;
            }

            // Logic for Radio Buttons and Checkboxes
            const choiceOptions = container.querySelectorAll('.uVccjd');
            if (choiceOptions.length > 0) {
                choiceOptions.forEach(choice => {
                    const choiceText = choice.querySelector('.v3o3I, .Y5sE8d')?.innerText.trim();
                    if (choiceText && choiceText === answer) {
                        choice.click();
                        console.log(`✅ Clicked [Choice]: "${labelText}" -> "${choiceText}"`);
                    }
                });
            }
        });
        console.log("🎉 Form Filler Pro: Fill complete! Manually handle file uploads and click submit.");
    }

    // Run the script once the page is fully loaded.
    window.addEventListener('load', () => {
        setTimeout(fillTheForm, 150);
    });

})();
