# RapidFormFiller

A high-speed, configurable user script to automatically fill Google Forms in milliseconds. Ideal for time-sensitive situations like hostel allotments, course registrations, or flash sales where every second counts.

### My Experience
> I originally created this script for my own college's hostel allotment, which was a first-come, first-served process where the form opened at a specific time. Manually filling the form was too slow. This script allowed me to pre-load almost all my answers that I knew will be asked compulsarily and fill the form, including all validation checks, in under 200 milliseconds. It worked perfectly. I'm sharing it so others can use this advantage.

---

### Features

*   **⚡ Blazing Fast:** Fills the form in the blink of an eye.
*   **🧠 Intelligent Matching:** Uses a "fuzzy matching" map so it doesn't break if a question is worded slightly differently.
*   **🤖 Robust Automation:** Simulates real user input events to satisfy even complex forms with field validation.
*   **🔧 Easy to Configure:** A single, simple configuration section to enter all your data. No coding knowledge required to set up.

---

### How to Use

#### Step 1: Install a User Script Manager

You need a browser extension that can run user scripts.
*   [**Tampermonkey**](https://www.tampermonkey.net/) (for Chrome, Firefox, Edge, Opera)
*   [**Greasemonkey**](https://www.greasespot.net/) (for Firefox)

#### Step 2: Install the `RapidFormFiller` Script

1.  Go to the `rapid-form-filler.user.js` file in this repository.
2.  Click the **"Raw"** button at the top right of the file viewer.
3.  Tampermonkey (or your script manager) will automatically open a new tab.
4.  Click the **"Install"** button.

#### Step 3: Configure Your Answers

This is the most important step!

1.  Click on the Tampermonkey extension icon in your browser and go to the **"Dashboard"**.
2.  You will see `Rapid Form Filler` in the list. Click on its name to open the editor.
3.  Carefully edit the **`potentialQuestionsMap`** and **`myAnswers`** sections at the top of the file, following the instructions in the script's comments.
4.  Save the file by pressing **Ctrl+S** (or File -> Save).

#### Step 4: Run the Script!
The script will run automatically when you open a Google Form.
1.  Open the Google Form you want to fill.
2.  The script will instantly fill in all the data you configured.
3.  All you need to do is **manually handle any file uploads** and click the final **"Submit"** button.

---

### ⚠️ Troubleshooting: The Golden Rule

**"My form didn't fill! What do I do?"**

This almost always means Google has updated their internal code for forms. The fix is usually simple:

1.  **Open the Developer Console:** On the Google Form page, press the **F12** key and click the **"Console"** tab.
2.  **Look for an Error:** The script will print an error like `❌ Form Filler Pro: Could not find any question containers...`. This confirms the problem.
3.  **Find the New Container Class:**
    *   Right-click on the text of any question on the form and choose **"Inspect"**.
    *   In the HTML code that appears, move your mouse up a few lines until you find the element that highlights the *entire* question block (both the question text and the answer area).
    *   Note down its `class` attribute (e.g., `class="Qr7Oae"` or `class="some-other-name"`).
4.  **Update the Script:**
    *   Open the script editor in Tampermonkey.
    *   Find the line: `const GOOGLE_FORM_QUESTION_CONTAINER_CLASS = '.Qr7Oae';`
    *   Replace `.Qr7Oae` with the new class name you found (don't forget the dot `.` at the beginning).
    *   Save the script and refresh the form. It should work now!

---

### License

This project is licensed under the **MIT License**. See the `LICENSE` file for details. You are free to use, modify, and distribute it.
