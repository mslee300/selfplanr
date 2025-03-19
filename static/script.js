document.addEventListener("DOMContentLoaded", () => {
    let step = 0;
    const initialContent = document.getElementById("initial-content");
    const formContent = document.getElementById("form-content");
    const navButtons = document.getElementById("nav-buttons");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const startBtn = document.getElementById("start-btn");

    let formData = JSON.parse(localStorage.getItem("formData")) || {
        gradeLevel: "",
        major: "",
        gpa: "",
        courses: "",
        activities: "",
    };

    const steps = [renderBasicInfo, renderCourses, renderActivities];

    function startForm() {
        initialContent.style.display = "none";
        formContent.classList.remove("hidden");
        navButtons.classList.remove("hidden");
        updateForm();
    }

    function updateForm() {
        formContent.innerHTML = "";
        steps[step]();
        updateButtons();
    }

    function updateButtons() {
        prevBtn.classList.toggle("hidden", step === 0);
        nextBtn.textContent = step === steps.length - 1 ? "Submit" : "Next";

        const isValid = isStepValid();
        nextBtn.disabled = !isValid;
        nextBtn.style.backgroundColor = isValid ? "#007bff" : "#b0b0b0";
        nextBtn.style.cursor = isValid ? "pointer" : "not-allowed";
    }

    function isStepValid() {
        if (step === 0) {
            const gpaValue = parseFloat(formData.gpa);
            const gpaValid = formData.gpa.trim() !== "" && !isNaN(gpaValue) && gpaValue >= 0 && gpaValue <= 4.0;

            return formData.gradeLevel.trim() !== "" && formData.major.trim() !== "" && gpaValid;
        }
        if (step === 1) {
            return formData.courses.trim().length > 0 && formData.courses.split(" ").length <= 200;
        }
        if (step === 2) {
            return formData.activities.trim().length > 0 && formData.activities.split(" ").length <= 200;
        }
        return false;
    }

    function handleInputChange(field, value) {
        formData[field] = value.trim();
        localStorage.setItem("formData", JSON.stringify(formData));
        updateButtons();
    }

    function renderBasicInfo() {
        formContent.innerHTML = `
            <h2 class="test-title">Tell Us About You 👋</h2>

            <div class="form-group">
                <label for="grade-level">Grade Level</label>
                <select id="grade-level" class="input-field">
                    <option value="">Select Grade</option>
                    <option value="9th">Before 9th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                </select>
            </div>

            <div class="form-group">
                <label for="major">Intended Major</label>
                <input type="text" id="major" class="input-field" placeholder="Computer Science" maxlength="100">
            </div>

            <div class="form-group">
                <label for="gpa">Unweighted GPA (out of 4.0)</label>
                <input type="number" id="gpa" class="input-field" min="0" max="4" step="0.01">
                <p id="gpa-error" style="color: red; font-size: 14px; display: none;">GPA must be between 0.0 and 4.0</p>
            </div>
        `;

        const gradeLevel = document.getElementById("grade-level");
        const major = document.getElementById("major");
        const gpa = document.getElementById("gpa");
        const gpaError = document.getElementById("gpa-error");

        gradeLevel.value = formData.gradeLevel;
        major.value = formData.major;
        gpa.value = formData.gpa;

        function validateInputs() {
            let gpaValue = parseFloat(gpa.value);
            let isGpaValid = !isNaN(gpaValue) && gpaValue >= 0 && gpaValue <= 4.0;

            gpaError.style.display = isGpaValid ? "none" : "block";
            handleInputChange("gpa", isGpaValid ? gpa.value : "");
        }

        gradeLevel.addEventListener("change", (e) => handleInputChange("gradeLevel", e.target.value));
        major.addEventListener("input", (e) => handleInputChange("major", e.target.value));
        gpa.addEventListener("input", validateInputs);

        updateButtons();
    }

    function renderCourses() {
        formContent.innerHTML = `
            <h2 class="test-title">Courses & Grades 💯</h2>
            <label class="course-label">List most relevant courses and grades (+SAT/ACT score if any)</label>
            <textarea id="courses" class="input-field large-textarea" placeholder="List courses here..." maxlength="2000"></textarea>
            <p id="courses-error" style="color: red; font-size: 14px; display: none;">Max 200 words allowed</p>
        `;

        const courses = document.getElementById("courses");
        const coursesError = document.getElementById("courses-error");

        courses.value = formData.courses;

        function validateCourses() {
            const wordCount = courses.value.trim().split(/\s+/).length;
            const isValid = wordCount <= 200;
            coursesError.style.display = isValid ? "none" : "block";
            handleInputChange("courses", isValid ? courses.value : "");
        }

        courses.addEventListener("input", validateCourses);
        updateButtons();
    }

    function renderActivities() {
        formContent.innerHTML = `
            <h2 class="test-title">Extracurricular Activities ⚽</h2>
            <label class="activity-label">List relevant activities (Leadership, Volunteer, Internships, etc.)</label>
            <textarea id="activities" class="input-field large-textarea" placeholder="List activities here..." maxlength="2000"></textarea>
            <p id="activities-error" style="color: red; font-size: 14px; display: none;">Max 200 words allowed</p>
        `;

        const activities = document.getElementById("activities");
        const activitiesError = document.getElementById("activities-error");

        activities.value = formData.activities;

        function validateActivities() {
            const wordCount = activities.value.trim().split(/\s+/).length;
            const isValid = wordCount <= 200;
            activitiesError.style.display = isValid ? "none" : "block";
            handleInputChange("activities", isValid ? activities.value : "");
        }

        activities.addEventListener("input", validateActivities);
        updateButtons();
    }

    function submitForm() {
        // Store the form data in sessionStorage for retrieval on the report page
        sessionStorage.setItem("userFormData", JSON.stringify(formData));

        // Redirect to the loading page
        window.location.href = "/loading/";
    }

    startBtn.addEventListener("click", startForm);
    nextBtn.addEventListener("click", () => {
        if (!nextBtn.disabled) {
            if (step < steps.length - 1) {
                step++;
                updateForm();
            } else {
                submitForm(); // Call our new submitForm function
            }
        }
    });

    prevBtn.addEventListener("click", () => {
        if (step > 0) {
            step--;
            updateForm();
        }
    });

    updateButtons();
});